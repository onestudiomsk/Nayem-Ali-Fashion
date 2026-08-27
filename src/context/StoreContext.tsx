import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  UserProfile,
  Coupon,
  ProductReview,
  ToastNotification,
  Address,
  OrderStatus,
  TrackingEvent,
  ProductCategory,
  CategoryInfo,
} from '../types';
import { INITIAL_PRODUCTS, DEMO_STARTER_PRODUCTS, isDemoProductId } from '../data/products';
import { INITIAL_COUPONS, INITIAL_REVIEWS, INITIAL_ORDERS } from '../data/mockData';
import { CATEGORIES } from '../data/categories';
import {
  ADMIN_EMAIL,
  isAuthorizedAdminEmail,
  auth,
  onAuthStateChanged,
  logoutFirebase,
} from '../lib/auth';
import {
  subscribeToProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
  fetchAllProductsFromFirestore,
  subscribeToOrders,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  subscribeToCategories,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  testFirestoreConnection,
} from '../lib/firestoreService';


export type AppView =
  | 'home'
  | 'shop'
  | 'category'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-tracking'
  | 'account'
  | 'admin'
  | 'about'
  | 'faq'
  | 'contact'
  | 'policy';

interface StoreContextType {
  // Navigation
  activeView: AppView;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  selectedOrderId: string | null;
  navigateTo: (
    view: AppView,
    params?: { productId?: string; categoryId?: string; orderId?: string; searchQuery?: string; sectionId?: string }
  ) => void;
  getProductUrl: (productId: string) => string;
  getCategoryUrl: (categoryId: string) => string;
  getSectionUrl: (sectionId: string) => string;

  // Products
  products: Product[];
  isLoadingProducts: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void> | void;
  updateProduct: (product: Product) => Promise<void> | void;
  deleteProduct: (id: string) => Promise<void> | void;
  seedStarterCatalogToFirestore: () => Promise<void>;
  refreshProductsFromCloud: () => Promise<void>;
  importProducts: (productsList: Product[]) => Promise<{ imported: number; failed: number }>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string, showDrawer?: boolean) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  // User & Auth
  currentUser: UserProfile | null;
  isAdmin: boolean;
  login: (emailOrPhone: string, role?: 'customer' | 'admin') => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addUserAddress: (address: Omit<Address, 'id'>) => void;
  deleteUserAddress: (addressId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'trackingEvents'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => Promise<void> | void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;

  // Modals & Drawers
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Reviews
  reviews: ProductReview[];
  getProductReviews: (productId: string) => ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;

  // Notifications / Toasts
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', title?: string) => void;
  removeToast: (id: string) => void;

  // Currency & Formatter
  currency: 'BDT' | 'USD';
  setCurrency: (c: 'BDT' | 'USD') => void;
  formatPrice: (amountInBDT?: number | null) => string;

  // Categories & Subcategories
  categories: CategoryInfo[];
  addCategory: (category: CategoryInfo) => void;
  updateCategory: (category: CategoryInfo) => void;
  deleteCategory: (categoryId: string) => void;
  addSubcategory: (categoryId: string, subcategoryName: string) => void;
  deleteSubcategory: (categoryId: string, subcategoryName: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  CART: 'zayn_cart_v1',
  WISHLIST: 'zayn_wishlist_v1',
  ORDERS: 'zayn_orders_v1',
  USER: 'zayn_user_v1',
  PRODUCTS: 'zayn_products_v1',
  CATEGORIES: 'zayn_categories_v10',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-default',
  name: 'Sumaiya Chowdhury',
  email: 'sumaiya.c@example.com',
  phone: '01712-345678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  joinedDate: '2026-01-15',
  role: 'customer',
  addresses: [
    {
      id: 'addr-1',
      title: 'Home',
      receiverName: 'Sumaiya Chowdhury',
      phone: '01712-345678',
      streetAddress: 'House 42, Road 11, Block D, Banani',
      city: 'Dhaka',
      area: 'Banani',
      postalCode: '1213',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Office',
      receiverName: 'Sumaiya Chowdhury',
      phone: '01712-345678',
      streetAddress: 'Level 7, Simpletree Anarkali, 89 Gulshan Avenue',
      city: 'Dhaka',
      area: 'Gulshan 2',
      postalCode: '1212',
      isDefault: false,
    },
  ],
};

// Helper to parse route from URL
const parseRouteFromUrl = (): {
  view: AppView;
  productId?: string;
  categoryId?: string;
  orderId?: string;
  sectionId?: string;
  searchQuery?: string;
} => {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const [routePath, queryPart] = hash.split('?');
    const segments = routePath.split('/').filter(Boolean);

    const searchParams = new URLSearchParams(queryPart || window.location.search);
    const qProductId = searchParams.get('product') || searchParams.get('productId');
    const qCategoryId = searchParams.get('category') || searchParams.get('categoryId');
    const qOrderId = searchParams.get('order') || searchParams.get('orderId') || searchParams.get('tracking');
    const qSection = searchParams.get('section');
    const qSearch = searchParams.get('q') || searchParams.get('search');

    if (segments[0] === 'product' && segments[1]) {
      return { view: 'product-details', productId: decodeURIComponent(segments[1]), searchQuery: qSearch || '' };
    }
    if (qProductId) {
      return { view: 'product-details', productId: qProductId, searchQuery: qSearch || '' };
    }

    if (segments[0] === 'category' && segments[1]) {
      return { view: 'shop', categoryId: decodeURIComponent(segments[1]), searchQuery: qSearch || '' };
    }
    if (qCategoryId) {
      return { view: 'shop', categoryId: qCategoryId, searchQuery: qSearch || '' };
    }

    if (segments[0] === 'section' && segments[1]) {
      return { view: 'home', sectionId: decodeURIComponent(segments[1]), searchQuery: qSearch || '' };
    }
    if (qSection) {
      return { view: 'home', sectionId: qSection, searchQuery: qSearch || '' };
    }

    if (segments[0] === 'tracking' || segments[0] === 'order') {
      return { view: 'order-tracking', orderId: segments[1] ? decodeURIComponent(segments[1]) : (qOrderId || undefined) };
    }
    if (qOrderId) {
      return { view: 'order-tracking', orderId: qOrderId };
    }

    if (segments[0] === 'cart') return { view: 'cart' };
    if (segments[0] === 'checkout') return { view: 'checkout' };
    if (segments[0] === 'account' || segments[0] === 'profile') return { view: 'account' };
    if (segments[0] === 'admin') return { view: 'admin' };
    if (segments[0] === 'shop') return { view: 'shop', searchQuery: qSearch || '' };

    if (['flash-deals', 'categories', 'all-products', 'bestsellers'].includes(segments[0])) {
      return { view: 'home', sectionId: segments[0] };
    }

    return { view: 'home', searchQuery: qSearch || '' };
  } catch {
    return { view: 'home' };
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = parseRouteFromUrl();

  // Navigation state
  const [activeView, setActiveView] = useState<AppView>(initialRoute.view);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialRoute.productId || null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialRoute.categoryId || null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialRoute.orderId || null);

  // Loading state for initial cloud sync
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Products state (synchronized with local storage & cloud persistence)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // User state - strictly sanitized
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      if (saved) {
        const parsed: UserProfile = JSON.parse(saved);
        // Security check: ONLY ADMIN_EMAIL (mskhereiam5610@gmail.com) can ever have admin role
        const isEligibleAdmin = isAuthorizedAdminEmail(parsed.email);
        return {
          ...parsed,
          role: isEligibleAdmin ? 'admin' : 'customer',
        };
      }
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Categories state with local storage & cloud persistence
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed: CategoryInfo[] = JSON.parse(saved);
        // Ensure default category images from CATEGORIES definition are synced
        return CATEGORIES.map((catDef) => {
          const matched = parsed.find((p) => p.id === catDef.id);
          if (matched) {
            return {
              ...matched,
              image: catDef.image, // Use newest defined image
            };
          }
          return catDef;
        });
      }
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  // Real-time Store Data Synchronization
  useEffect(() => {
    testFirestoreConnection();

    // 1. Subscribe to Products
    const unsubscribeProducts = subscribeToProducts((firestoreProducts) => {
      const activeProducts = firestoreProducts && firestoreProducts.length > 0 ? firestoreProducts : INITIAL_PRODUCTS;

      let localProducts: Product[] = [];
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localProducts = parsed;
          }
        }
      } catch (e) {}

      const missingFromFirestore = localProducts.filter(
        (localP) => !activeProducts.some((fireP) => fireP.id === localP.id)
      );

      const mergedList = [...activeProducts];
      missingFromFirestore.forEach((mp) => {
        mergedList.push(mp);
      });

      setProducts(mergedList);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(mergedList));
      } catch (e) {}

      setIsLoadingProducts(false);
    });

    // 2. Subscribe to Orders
    const unsubscribeOrders = subscribeToOrders((firestoreOrders) => {
      if (firestoreOrders && firestoreOrders.length > 0) {
        setOrders(firestoreOrders);
      }
    });

    // 3. Subscribe to Categories
    const unsubscribeCategories = subscribeToCategories((firestoreCategories) => {
      if (firestoreCategories && firestoreCategories.length > 0) {
        setCategories(firestoreCategories);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(firestoreCategories));
        } catch (e) {}
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeCategories();
    };
  }, []);

  // Listen for Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser && authUser.email) {
        const userEmail = authUser.email;
        const isTargetAdmin = isAuthorizedAdminEmail(userEmail);
        setCurrentUser((prev) => {
          const baseAddresses = prev?.addresses?.length ? prev.addresses : DEFAULT_USER.addresses;
          return {
            id: authUser.uid,
            name: authUser.displayName || (userEmail.includes('@') ? userEmail.split('@')[0] : 'Zayn User'),
            email: userEmail,
            phone: authUser.phoneNumber || prev?.phone || '01712-345678',
            avatar: authUser.photoURL || prev?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            joinedDate: prev?.joinedDate || '2026-08-20',
            role: isTargetAdmin ? 'admin' : 'customer',
            addresses: baseAddresses,
          };
        });
      }
    });

    return () => unsubscribe();
  }, []);


  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Currency
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);


  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Listen for browser popstate and hashchange to support deep links & back/forward navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseRouteFromUrl();
      setActiveView(parsed.view);
      if (parsed.productId) setSelectedProductId(parsed.productId);
      if (parsed.categoryId) {
        setSelectedCategoryId(parsed.categoryId);
        setSelectedCategoryFilter(parsed.categoryId);
      }
      if (parsed.orderId) setSelectedOrderId(parsed.orderId);
      if (parsed.searchQuery) setSearchQuery(parsed.searchQuery);

      if (parsed.sectionId) {
        setTimeout(() => {
          const sectionEl =
            document.getElementById(parsed.sectionId!) ||
            document.getElementById(`section-${parsed.sectionId}`) ||
            document.getElementById(`${parsed.sectionId}-section`);
          sectionEl?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Toast helpers
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { id, message, type, title, timestamp: Date.now() };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Deep Link URL Generators
  const getProductUrl = (productId: string): string => {
    const base = window.location.origin + window.location.pathname;
    return `${base}#/product/${encodeURIComponent(productId)}`;
  };

  const getCategoryUrl = (categoryId: string): string => {
    const base = window.location.origin + window.location.pathname;
    return `${base}#/category/${encodeURIComponent(categoryId)}`;
  };

  const getSectionUrl = (sectionId: string): string => {
    const base = window.location.origin + window.location.pathname;
    return `${base}#/section/${encodeURIComponent(sectionId)}`;
  };

  // Navigation helper with clean hash updates
  const navigateTo = (
    view: AppView,
    params?: { productId?: string; categoryId?: string; orderId?: string; searchQuery?: string; sectionId?: string }
  ) => {
    setActiveView(view);
    if (params?.productId !== undefined) setSelectedProductId(params.productId);
    if (params?.categoryId !== undefined) {
      setSelectedCategoryId(params.categoryId);
      setSelectedCategoryFilter(params.categoryId);
    }
    if (params?.orderId !== undefined) setSelectedOrderId(params.orderId);
    if (params?.searchQuery !== undefined) setSearchQuery(params.searchQuery);

    // Synchronize URL hash
    let newHash = '#/';
    if (view === 'product-details' && params?.productId) {
      newHash = `#/product/${encodeURIComponent(params.productId)}`;
    } else if (view === 'shop' && params?.categoryId && params.categoryId !== 'all') {
      newHash = `#/category/${encodeURIComponent(params.categoryId)}`;
    } else if (view === 'shop') {
      newHash = params?.searchQuery ? `#/shop?q=${encodeURIComponent(params.searchQuery)}` : '#/shop';
    } else if (view === 'order-tracking') {
      newHash = params?.orderId ? `#/tracking/${encodeURIComponent(params.orderId)}` : '#/tracking';
    } else if (view === 'cart') {
      newHash = '#/cart';
    } else if (view === 'checkout') {
      newHash = '#/checkout';
    } else if (view === 'account') {
      newHash = '#/account';
    } else if (view === 'admin') {
      newHash = '#/admin';
    } else if (view === 'home') {
      if (params?.sectionId) {
        newHash = `#/section/${encodeURIComponent(params.sectionId)}`;
      } else {
        newHash = '#/home';
      }
    }

    if (window.location.hash !== newHash) {
      try {
        window.history.pushState(null, '', newHash);
      } catch {
        window.location.hash = newHash;
      }
    }

    if (params?.sectionId) {
      setTimeout(() => {
        const sectionEl =
          document.getElementById(params.sectionId!) ||
          document.getElementById(`section-${params.sectionId}`) ||
          document.getElementById(`${params.sectionId}-section`);
        sectionEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string, showDrawer = false) => {
    const itemId = `${product.id}-${color || 'default'}-${size || 'default'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemId,
            product,
            quantity,
            selectedColor: color,
            selectedSize: size,
          },
        ];
      }
    });

    addToast(`Added "${product.name}" to cart!`, 'success', 'Cart Updated');
    if (showDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Price calculations
  const cartCount = (cart || []).reduce((total, item) => total + (item?.quantity || 0), 0);
  const cartSubtotal = (cart || []).reduce((total, item) => total + (item?.product?.price || 0) * (item?.quantity || 0), 0);

  // Delivery: Free if subtotal >= 999, else ৳60 for standard
  const deliveryCharge = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 60;

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
      // Cap percentage discount to max 500 for demo sanity
      if (appliedCoupon.code === 'EBUNDI20' || appliedCoupon.code === 'ZAYN20') discountAmount = Math.min(discountAmount, 500);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);

  // Apply Coupon
  const applyCoupon = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === formattedCode && c.isActive);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (cartSubtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Minimum order of ৳${coupon.minOrderValue} required for coupon "${coupon.code}".`,
      };
    }

    setAppliedCoupon(coupon);
    addToast(`Coupon "${coupon.code}" applied successfully!`, 'success');
    return { success: true, message: `Coupon applied: ${coupon.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addToast(`Removed from wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        addToast(`Added to wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((p) => p.id === productId);

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // User & Auth - Strict admin authorization rule
  const login = (emailOrPhone: string, requestedRole?: 'customer' | 'admin') => {
    const isTargetAdmin = isAuthorizedAdminEmail(emailOrPhone);
    const assignedRole: 'admin' | 'customer' = isTargetAdmin ? 'admin' : 'customer';

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Zayn Customer',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@zayn.fashion',
      phone: emailOrPhone.includes('@') ? '01712-345678' : emailOrPhone,
      avatar: isTargetAdmin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      joinedDate: '2026-08-20',
      role: assignedRole,
      addresses: DEFAULT_USER.addresses,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    
    if (isTargetAdmin) {
      addToast(`Admin access granted for ${ADMIN_EMAIL}`, 'success', 'Admin Authenticated');
    } else {
      addToast(`Welcome back, ${newUser.name}!`, 'success');
    }
  };

  const logout = () => {
    logoutFirebase().catch(() => {});
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    addToast('Logged out successfully', 'info');
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    // Strict safety check: Never permit role elevation to admin unless email is authorized admin email (mskhereiam5610@gmail.com)
    const effectiveEmail = profileUpdate.email || currentUser.email;
    const isEligibleAdmin = isAuthorizedAdminEmail(effectiveEmail);
    
    const sanitizedUpdate = {
      ...profileUpdate,
      role: isEligibleAdmin ? (profileUpdate.role || currentUser.role) : 'customer',
    };

    setCurrentUser({ ...currentUser, ...sanitizedUpdate });
    addToast('Profile updated successfully', 'success');
  };

  const addUserAddress = (address: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setCurrentUser({
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr],
    });
    addToast('New delivery address saved!', 'success');
  };

  const deleteUserAddress = (addressId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      addresses: currentUser.addresses.filter((a) => a.id !== addressId),
    });
    addToast('Address deleted', 'info');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'trackingEvents'>): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ZAYN-${randomSuffix}`;
    const id = `ord-${Date.now()}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      date: dateStr,
      status: 'placed',
      estimatedDelivery: 'In 2-3 Business Days',
      trackingEvents: [
        {
          status: 'placed',
          title: 'Order Placed',
          description: `Order ${orderNumber} received and registered in Zayn.Fashion system.`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'confirmed',
          title: 'Order Confirmed',
          description: 'Payment verified and items allocated in warehouse.',
          timestamp: 'Pending confirmation',
          completed: false,
          current: false,
        },
        {
          status: 'processing',
          title: 'Processing & Quality Packaging',
          description: 'Goods carefully packed in tamper-evident sealed packaging.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'shipped',
          title: 'Shipped via Express Courier',
          description: 'Handed over to delivery logistics partner.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Delivery rider is heading to destination address.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'delivered',
          title: 'Delivered to Customer',
          description: 'Delivered & signed by customer.',
          timestamp: 'Pending',
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    // Persist order in Cloud Firestore
    saveOrderToFirestore(newOrder).catch((err) => {
      console.warn('Saved order locally. Firestore notice:', err);
    });
    addToast(`Order ${orderNumber} placed successfully!`, 'success', 'Congratulations!');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    let updatedEvents: TrackingEvent[] = [];
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const statusOrder: OrderStatus[] = [
          'placed',
          'confirmed',
          'processing',
          'shipped',
          'out_for_delivery',
          'delivered',
        ];
        const targetIndex = statusOrder.indexOf(status);

        updatedEvents = ord.trackingEvents.map((evt) => {
          const eventIndex = statusOrder.indexOf(evt.status);
          return {
            ...evt,
            completed: eventIndex <= targetIndex,
            current: eventIndex === targetIndex,
            timestamp: eventIndex <= targetIndex && evt.timestamp.includes('Pending') ? 'Completed' : evt.timestamp,
          };
        });

        return {
          ...ord,
          status,
          trackingEvents: updatedEvents,
        };
      })
    );
    // Persist order status in Cloud Firestore
    updateOrderStatusInFirestore(orderId, status, updatedEvents).catch((err) => {
      console.warn('Updated order locally. Firestore notice:', err);
    });
    addToast(`Order status updated to: ${status}`, 'info');
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);
  const getOrderByNumber = (orderNumber: string) =>
    orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase().trim());

  const deleteOrder = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const orderNum = targetOrder?.orderNumber || orderId;

    // Immediately remove from local state and LocalStorage
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== orderId);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }
      return next;
    });

    try {
      await deleteOrderFromFirestore(orderId);
      addToast(`অর্ডার #${orderNum} এবং এর তথ্য ডাটাবেজ থেকে মুছে ফেলা হয়েছে!`, 'success');
    } catch (err: any) {
      console.warn('Order removed locally. Firestore notice:', err);
      addToast(`Order #${orderNum} removed from records`, 'info');
    }
  };

  // Products CRUD for Admin with Cloud Firestore durability (Supports Unlimited Products in Any Category)
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    
    // Immediately persist in local state and LocalStorage for zero-delay UI update
    setProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }
      return updated;
    });

    try {
      await saveProductToFirestore(newProduct);
      addToast(`"${newProduct.name}" সফলভাবে যুক্ত ও ডাটাবেজে সংরক্ষিত হয়েছে!`, 'success');
    } catch (err: any) {
      console.warn('Product saved locally. Firestore error:', err);
      addToast(`"${newProduct.name}" প্রডাক্ট যুক্ত হয়েছে!`, 'success');
    }
  };

  const updateProduct = async (updated: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    // Also update in cart and wishlist if present
    setCart((prev) =>
      prev.map((item) =>
        item.product?.id === updated.id ? { ...item, product: updated } : item
      )
    );
    setWishlist((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    try {
      await saveProductToFirestore(updated);
      addToast(`"${updated.name}" ডাটাবেজে সফলভাবে আপডেট হয়েছে!`, 'success');
    } catch (err: any) {
      console.warn('Product updated locally. Firestore error:', err);
      addToast(`Product updated successfully`, 'success');
    }
  };

  const deleteProduct = async (id: string) => {
    // Immediately remove from local state, localStorage, cart, and wishlist
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setCart((prev) => prev.filter((item) => item.product?.id !== id));
    setWishlist((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProductFromFirestore(id);
      addToast(`প্রডাক্টটি ডাটাবেজ থেকে সম্পূর্ণ মুছে ফেলা হয়েছে`, 'info');
    } catch (err: any) {
      console.warn('Product removed locally. Firestore error:', err);
      addToast(`Product removed from catalog`, 'info');
    }
  };

  const seedStarterCatalogToFirestore = async () => {
    try {
      addToast('Importing starter product catalog into Cloud Firestore...', 'info');
      for (const item of DEMO_STARTER_PRODUCTS) {
        await saveProductToFirestore(item);
      }
      addToast(`${DEMO_STARTER_PRODUCTS.length} starter products saved permanently to Cloud Firestore!`, 'success');
    } catch (err: any) {
      addToast('Failed to seed catalog to Firestore: ' + (err?.message || 'Check connection'), 'error');
    }
  };

  const refreshProductsFromCloud = async () => {
    try {
      setIsLoadingProducts(true);
      const cloudProds = await fetchAllProductsFromFirestore();
      const realProds = (cloudProds || []).filter((p) => !isDemoProductId(p.id));
      
      // Merge with any local products
      let localUserProducts: Product[] = [];
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            localUserProducts = parsed.filter((p: Product) => p && p.id && !isDemoProductId(p.id));
          }
        }
      } catch (e) {}

      const missingFromFirestore = localUserProducts.filter(
        (lp) => !realProds.some((fp) => fp.id === lp.id)
      );

      if (missingFromFirestore.length > 0) {
        for (const missingP of missingFromFirestore) {
          await saveProductToFirestore(missingP).catch(() => {});
        }
      }

      const merged = [...realProds, ...missingFromFirestore];
      setProducts(merged);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
      } catch (e) {}

      addToast(`ডাটাবেজ থেকে মোট ${merged.length} টি প্রডাক্ট সিঙ্ক হয়েছে!`, 'success');
    } catch (err: any) {
      console.error('Refresh cloud products error:', err);
      addToast('Cloud sync error: ' + (err?.message || 'Check network connection'), 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const importProducts = async (productsList: Product[]) => {
    let count = 0;
    let failed = 0;
    for (const p of productsList) {
      if (p && p.name && p.price !== undefined) {
        const cleanP: Product = {
          ...p,
          id: p.id || `p-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: p.createdAt || new Date().toISOString().substring(0, 10),
        };
        try {
          await saveProductToFirestore(cleanP);
          count++;
        } catch (e) {
          failed++;
        }
      }
    }
    if (count > 0) {
      addToast(`${count} টি প্রডাক্ট সফলভাবে ইমপোর্ট ও ক্লাউডে সংরক্ষিত হয়েছে!`, 'success');
      await refreshProductsFromCloud();
    }
    return { imported: count, failed };
  };

  // Coupons
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    addToast(`Coupon "${newCoupon.code}" created!`, 'success');
  };

  // Reviews
  const getProductReviews = (productId: string) => reviews.filter((r) => r.productId === productId);

  const addReview = (reviewData: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
      helpfulCount: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    addToast('Thank you! Your verified review has been submitted.', 'success');
  };

  // Category & Subcategory management
  const addCategory = (newCat: CategoryInfo) => {
    let finalCat = newCat;
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === newCat.id || c.slug === newCat.slug);
      let next: CategoryInfo[];
      if (exists) {
        next = prev.map((c) => (c.id === newCat.id || c.slug === newCat.slug ? newCat : c));
      } else {
        next = [...prev, newCat];
      }
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    saveCategoryToFirestore(finalCat).catch((e) => console.warn('Category saved locally:', e));
    addToast(`Category "${newCat.name}" added successfully!`, 'success');
  };

  const updateCategory = (updatedCat: CategoryInfo) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === updatedCat.id ? updatedCat : c));
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    saveCategoryToFirestore(updatedCat).catch((e) => console.warn('Category updated locally:', e));
    addToast(`Category "${updatedCat.name}" updated!`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== categoryId && c.slug !== categoryId);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    deleteCategoryFromFirestore(categoryId).catch((e) => console.warn('Category deleted locally:', e));
    addToast(`Category removed from store!`, 'info');
  };

  const addSubcategory = (categoryId: string, subcategoryName: string) => {
    const trimmed = subcategoryName.trim();
    if (!trimmed) return;
    let updatedCategory: CategoryInfo | undefined;
    setCategories((prev) => {
      const next = prev.map((cat) => {
        if (cat.id === categoryId || cat.slug === categoryId) {
          if (cat.popularSubcategories.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
            return cat;
          }
          const updated = {
            ...cat,
            popularSubcategories: [...cat.popularSubcategories, trimmed],
          };
          updatedCategory = updated;
          return updated;
        }
        return cat;
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    if (updatedCategory) {
      saveCategoryToFirestore(updatedCategory).catch((e) => console.warn('Category saved locally:', e));
    }
    addToast(`Subcategory "${trimmed}" added!`, 'success');
  };

  const deleteSubcategory = (categoryId: string, subcategoryName: string) => {
    let updatedCategory: CategoryInfo | undefined;
    setCategories((prev) => {
      const next = prev.map((cat) => {
        if (cat.id === categoryId || cat.slug === categoryId) {
          const updated = {
            ...cat,
            popularSubcategories: cat.popularSubcategories.filter((s) => s !== subcategoryName),
          };
          updatedCategory = updated;
          return updated;
        }
        return cat;
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    if (updatedCategory) {
      saveCategoryToFirestore(updatedCategory).catch((e) => console.warn('Category updated locally:', e));
    }
    addToast(`Subcategory "${subcategoryName}" removed!`, 'info');
  };

  // Currency & formatting
  const formatPrice = (amountInBDT?: number | null): string => {
    const validAmount = typeof amountInBDT === 'number' && !isNaN(amountInBDT) 
      ? amountInBDT 
      : (Number(amountInBDT) || 0);

    if (currency === 'USD') {
      const usd = (validAmount / 115).toFixed(2);
      return `$${usd}`;
    }
    return `৳${validAmount.toLocaleString('en-BD')}`;
  };

  const value: StoreContextType = {
    activeView,
    selectedProductId,
    selectedCategoryId,
    selectedOrderId,
    navigateTo,
    products,
    isLoadingProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    seedStarterCatalogToFirestore,
    refreshProductsFromCloud,
    importProducts,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    wishlist,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    currentUser,
    isAdmin: Boolean(currentUser && isAuthorizedAdminEmail(currentUser.email)),
    login,
    logout,
    updateUserProfile,
    addUserAddress,
    deleteUserAddress,
    orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    getOrderByNumber,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    quickViewProduct,
    openQuickView: (p) => setQuickViewProduct(p),
    closeQuickView: () => setQuickViewProduct(null),
    isCartDrawerOpen,
    openCartDrawer: () => setIsCartDrawerOpen(true),
    closeCartDrawer: () => setIsCartDrawerOpen(false),
    isAuthModalOpen,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
    reviews,
    getProductReviews,
    addReview,
    toasts,
    addToast,
    removeToast,
    currency,
    setCurrency,
    formatPrice,
    coupons,
    addCoupon,
    getProductUrl,
    getCategoryUrl,
    getSectionUrl,
  };


  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
