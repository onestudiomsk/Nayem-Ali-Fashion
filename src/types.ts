export type ProductCategory =
  | 'men'
  | 'women'
  | 'kids'
  | 'infant'
  | 'sports'
  | 'winter'
  | 'accessories'
  | 'beauty'
  | 'personal-care'
  | 'kids-toys'
  | 'women-fashion'
  | 'beauty-care'
  | 'home-appliances'
  | 'home-decor'
  | 'daily-products'
  | string;

export interface ProductVariantColor {
  name: string;
  hex: string;
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorCode: string;
  stock: number;
}

export interface BrandInfo {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  brand?: string;
  brandId?: string;
  category: ProductCategory;
  categoryName: string;
  subcategory?: string;
  subcategoryId?: string;
  price: number;
  unit?: string;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  image: string;
  gallery: string[];
  description: string;
  shortDescription: string;
  features: string[];
  specifications: Record<string, string>;
  colors?: ProductVariantColor[];
  sizes?: string[];
  variants?: ProductVariantItem[];
  videoUrl?: string;
  reviews?: ProductReview[];
  tags: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSpecialOffer?: boolean;
  flashSale?: boolean;
  flashSalePrice?: number;
  specialOfferEndsAt?: string;
  createdAt: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  icon?: string;
  productCount?: number;
  popularSubcategories: string[];
  badge?: string;
}

export interface CartItem {
  id: string; // unique item key e.g. productId-color-size
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  title: string;
  receiverName: string;
  phone: string;
  streetAddress: string;
  division?: string;
  district?: string;
  city: string;
  area: string;
  postalCode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface TrackingEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentDetails?: {
    accountNumber?: string;
    transactionId?: string;
    cardLast4?: string;
  };
  paymentStatus: 'pending' | 'paid';
  trackingEvents: TrackingEvent[];
  estimatedDelivery: string;
  deliveryNotes?: string;
  userId?: string;
  userEmail?: string;
  customerProfile?: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role?: string;
    joinedDate?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  addresses: Address[];
  role: 'customer' | 'admin';
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'popular';

export interface FilterState {
  category: string;
  subcategory?: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  searchQuery: string;
  sortBy: SortOption;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  timestamp: number;
}
