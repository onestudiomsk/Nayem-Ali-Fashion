import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariantColor, Order, OrderStatus, CategoryInfo } from '../../types';
import { ADMIN_EMAIL } from '../../lib/auth';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  TrendingUp,
  X,
  Layers,
  Tag,
  CheckCircle2,
  Sparkles,
  Lock,
  ShieldAlert,
  ShieldCheck,
  LogIn,
  Image as ImageIcon,
  Palette,
  Check,
  Eye,
  Phone,
  Mail,
  MapPin,
  User,
  Clock,
  Truck,
  Filter,
  FileText,
  BadgeCheck,
  Award,
  RefreshCw,
  Download,
  Upload,
  Database,
} from 'lucide-react';

const UNIT_OPTIONS = [
  { value: 'Piece', label: 'Piece (পিস / টি)' },
  { value: 'Dozen', label: 'Dozen (ডজন)' },
  { value: 'Gram', label: 'Gram (গ্রাম - g)' },
  { value: 'Kilogram', label: 'Kilogram (কেজি - kg)' },
  { value: 'Liter', label: 'Liter (লিটার - L)' },
  { value: 'Packet', label: 'Packet (প্যাকেট)' },
  { value: 'Box', label: 'Box (বক্স)' },
  { value: 'Set', label: 'Set (সেট)' },
  { value: 'Pair', label: 'Pair (জোড়া)' },
  { value: 'Meter', label: 'Meter (মিটার)' },
  { value: '__custom__', label: '+ Custom Unit (অন্যান্য একক...)' },
];

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProductsFromCloud,
    importProducts,
    seedStarterCatalogToFirestore,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    orders,
    updateOrderStatus,
    deleteOrder,
    updateUserProfile,
    navigateTo,
    formatPrice,
    addToast,
    isAdmin,
    currentUser,
    login,
    openAuthModal,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'orders'>('analytics');
  const [productSearch, setProductSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Order Management tab state
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Subcategory Management tab state
  const [newSubcategoryInputs, setNewSubcategoryInputs] = useState<Record<string, string>>({});
  const [categorySearch, setCategorySearch] = useState('');

  // Category Add / Edit Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catFormName, setCatFormName] = useState('');
  const [catFormSlug, setCatFormSlug] = useState('');
  const [catFormImage, setCatFormImage] = useState('');
  const [catFormTagline, setCatFormTagline] = useState('');
  const [catFormBadge, setCatFormBadge] = useState('');
  const [catFormSubs, setCatFormSubs] = useState<string[]>([]);
  const [newSubInModal, setNewSubInModal] = useState('');

  // Add / Edit Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('women-fashion');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formCustomSubcategory, setFormCustomSubcategory] = useState('');
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  const handleManualCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      await refreshProductsFromCloud();
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleExportProductsBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `zayn-fashion-products-backup-${new Date().toISOString().substring(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('Product catalog JSON backup downloaded!', 'success');
    } catch (e: any) {
      addToast('Failed to export backup: ' + (e?.message || 'Error'), 'error');
    }
  };

  const handleImportProductsBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        addToast(`Restoring ${parsed.length} products to Cloud Database...`, 'info');
        await importProducts(parsed);
      } else {
        addToast('Invalid JSON file format. Expected an array of products.', 'error');
      }
    } catch (err: any) {
      addToast('Failed to import JSON backup: ' + (err?.message || 'Error'), 'error');
    } finally {
      e.target.value = '';
    }
  };
  const [formPrice, setFormPrice] = useState(1500);
  const [formUnit, setFormUnit] = useState('Piece');
  const [formCustomUnit, setFormCustomUnit] = useState('');
  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [formImage, setFormImage] = useState('');
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [formSizes, setFormSizes] = useState<string[]>([]);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [formColors, setFormColors] = useState<ProductVariantColor[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#E67E22');
  const [formDescription, setFormDescription] = useState('');
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);

  // Access Control Guard: Only ADMIN_EMAIL (mskhereiam5610@gmail.com) is authorized
  if (!isAdmin) {
    return (
      <div id="admin-auth-guard" className="py-16 max-w-xl mx-auto px-4 sm:px-6 animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider">
              Admin Access Required
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
              Zayn.Fashion Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              শুধুমাত্র অনুমোদিত এ্যাডমিন অ্যাকাউন্ট দিয়ে সাইন ইন করলেই এডমিন প্যানেল এক্সেস করা যাবে।
            </p>
            {currentUser && (
              <p className="text-[11px] text-slate-400">
                Current account: <span className="font-semibold text-slate-700">{currentUser.email}</span> ({currentUser.role || 'Customer'})
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => login(ADMIN_EMAIL, 'admin')}
              className="w-full py-3.5 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In as Authorized Admin</span>
            </button>

            <button
              onClick={openAuthModal}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Custom Account</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Financial Metrics Calculation
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  const totalItemsSold = (orders || []).reduce(
    (sum, o) => sum + (o?.items || []).reduce((s, it) => s + (Number(it?.quantity) || 0), 0),
    0
  );
  const activeOrdersCount = (orders || []).filter((o) => o && o.status !== 'delivered' && o.status !== 'cancelled').length;
  const totalSubcategoriesCount = (categories || []).reduce((sum, c) => sum + (c?.popularSubcategories || []).length, 0);

  // Current category subcategories list
  const currentCategoryObj = (categories || []).find((c) => c.id === formCategory || c.slug === formCategory) || (categories || [])[0];
  const availableSubcategories = currentCategoryObj?.popularSubcategories || [];

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setFormName('');
    const defaultCat = categories[0]?.id || 'women-fashion';
    setFormCategory(defaultCat);
    const catObj = (categories || []).find((c) => c.id === defaultCat || c.slug === defaultCat);
    const firstSub = catObj?.popularSubcategories?.[0] || '';
    setFormSubcategory(firstSub);
    setFormCustomSubcategory('');
    setIsCustomSubcategory(false);
    setFormPrice(1200);
    setFormUnit('Piece');
    setFormCustomUnit('');
    setIsCustomUnit(false);
    setFormImage('');
    setFormGallery([]);
    setNewGalleryInput('');
    setFormSizes([]);
    setNewSizeInput('');
    setFormColors([]);
    setNewColorName('');
    setNewColorHex('#E67E22');
    setFormDescription('High quality authentic designer product sourced for Zayn.Fashion customers.');
    setFormIsBestSeller(false);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name || '');
    setFormCategory(prod.category);
    
    const catObj = (categories || []).find((c) => c.id === prod.category || c.slug === prod.category);
    const existingSubs = catObj?.popularSubcategories || [];
    
    if (prod.subcategory && !existingSubs.includes(prod.subcategory)) {
      setFormSubcategory('__custom__');
      setFormCustomSubcategory(prod.subcategory);
      setIsCustomSubcategory(true);
    } else {
      setFormSubcategory(prod.subcategory || existingSubs[0] || '');
      setFormCustomSubcategory('');
      setIsCustomSubcategory(false);
    }

    setFormPrice(prod.price || 0);
    
    // Unit matching
    const matchingUnit = UNIT_OPTIONS.find((u) => u.value === prod.unit);
    if (matchingUnit && matchingUnit.value !== '__custom__') {
      setFormUnit(matchingUnit.value);
      setIsCustomUnit(false);
      setFormCustomUnit('');
    } else if (prod.unit) {
      setFormUnit('__custom__');
      setIsCustomUnit(true);
      setFormCustomUnit(prod.unit);
    } else {
      setFormUnit('Piece');
      setIsCustomUnit(false);
      setFormCustomUnit('');
    }

    setFormImage(prod.image || '');
    setFormGallery(prod.gallery && prod.gallery.length > 0 ? prod.gallery : (prod.image ? [prod.image] : []));
    setNewGalleryInput('');
    setFormSizes(prod.sizes || []);
    setNewSizeInput('');
    setFormColors(prod.colors || []);
    setNewColorName('');
    setNewColorHex('#E67E22');
    setFormDescription(prod.description || prod.shortDescription || '');
    setFormIsBestSeller(!!prod.isBestSeller);
    setIsProductModalOpen(true);
  };

  const handleCategoryChange = (newCatId: string) => {
    setFormCategory(newCatId);
    const catObj = (categories || []).find((c) => c.id === newCatId || c.slug === newCatId);
    const firstSub = catObj?.popularSubcategories?.[0] || '';
    setFormSubcategory(firstSub);
    setIsCustomSubcategory(false);
    setFormCustomSubcategory('');
  };

  const handleSubcategoryChange = (value: string) => {
    if (value === '__custom__') {
      setIsCustomSubcategory(true);
      setFormSubcategory('__custom__');
    } else {
      setIsCustomSubcategory(false);
      setFormSubcategory(value);
    }
  };

  const handleUnitChange = (value: string) => {
    if (value === '__custom__') {
      setIsCustomUnit(true);
      setFormUnit('__custom__');
    } else {
      setIsCustomUnit(false);
      setFormUnit(value);
    }
  };

  const handleAddGalleryImage = () => {
    const trimmed = newGalleryInput.trim();
    if (!trimmed) return;
    if (!formGallery.includes(trimmed)) {
      setFormGallery((prev) => [...prev, trimmed]);
      if (!formImage) setFormImage(trimmed);
      setNewGalleryInput('');
    }
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setFormGallery((prev) => {
      const updated = prev.filter((_, idx) => idx !== idxToRemove);
      if (updated.length > 0 && (!updated.includes(formImage) || formImage === prev[idxToRemove])) {
        setFormImage(updated[0]);
      }
      return updated;
    });
  };

  const handleAddSizeVariant = () => {
    const trimmed = newSizeInput.trim();
    if (!trimmed) return;
    if (!formSizes.includes(trimmed)) {
      setFormSizes((prev) => [...prev, trimmed]);
      setNewSizeInput('');
    }
  };

  const handleRemoveSizeVariant = (sizeToRemove: string) => {
    setFormSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const handleAddColorVariant = () => {
    const trimmed = newColorName.trim();
    if (!trimmed) return;
    if (!formColors.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setFormColors((prev) => [...prev, { name: trimmed, hex: newColorHex }]);
      setNewColorName('');
    }
  };

  const handleRemoveColorVariant = (colorNameToRemove: string) => {
    setFormColors((prev) => prev.filter((c) => c.name !== colorNameToRemove));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('Please enter a product title.', 'error');
      return;
    }

    const catObj = (categories || []).find((c) => c.id === formCategory || c.slug === formCategory);
    const categoryName = catObj ? catObj.name : 'Fashion';
    
    // Resolve final subcategory name
    let finalSubcategory = '';
    if (isCustomSubcategory || formSubcategory === '__custom__') {
      finalSubcategory = formCustomSubcategory.trim();
      if (finalSubcategory && catObj && !catObj.popularSubcategories.includes(finalSubcategory)) {
        // Save new subcategory automatically into the category list
        addSubcategory(formCategory, finalSubcategory);
      }
    } else {
      finalSubcategory = formSubcategory;
    }

    // Resolve final unit name
    let finalUnit = '';
    if (isCustomUnit || formUnit === '__custom__') {
      finalUnit = formCustomUnit.trim() || 'Piece';
    } else {
      finalUnit = formUnit || 'Piece';
    }

    // Resolve final gallery
    const primaryImg = formImage.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';
    let finalGallery = formGallery.filter(Boolean);
    if (!finalGallery.includes(primaryImg)) {
      finalGallery = [primaryImg, ...finalGallery];
    }
    if (finalGallery.length === 0) {
      finalGallery = [primaryImg];
    }

    const existing = (products || []).find((p) => p.id === editingProductId);

    if (editingProductId) {
      const updatedItem: Product = {
        ...(existing || {
          id: editingProductId,
          rating: 5.0,
          reviewCount: 1,
          createdAt: new Date().toISOString().substring(0, 10),
        }),
        id: editingProductId,
        name: formName.trim(),
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formCategory as any,
        categoryName,
        subcategory: finalSubcategory || undefined,
        price: Number(formPrice) || 0,
        originalPrice: Number(formPrice) || 0,
        discountPercent: 0,
        unit: finalUnit,
        inStock: true,
        stockCount: 9999,
        image: primaryImg,
        gallery: finalGallery,
        sizes: formSizes.length > 0 ? formSizes : undefined,
        colors: formColors.length > 0 ? formColors : undefined,
        description: formDescription,
        shortDescription: formDescription.slice(0, 100),
        features: existing?.features || ['100% Genuine Certified', '7-Day Easy Returns Guarantee', 'Nationwide Cash on Delivery'],
        specifications: {
          Category: categoryName,
          Subcategory: finalSubcategory || 'General',
          Unit: finalUnit,
          Origin: 'Authentic Sourced',
        },
        isTrending: existing?.isTrending || false,
        isBestSeller: formIsBestSeller,
        isNewArrival: existing?.isNewArrival ?? false,
        tags: ['updated', formCategory, ...(finalSubcategory ? [finalSubcategory.toLowerCase()] : [])],
      };
      await updateProduct(updatedItem);
    } else {
      await addProduct({
        name: formName.trim(),
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formCategory as any,
        categoryName,
        subcategory: finalSubcategory || undefined,
        price: Number(formPrice) || 0,
        originalPrice: Number(formPrice) || 0,
        discountPercent: 0,
        unit: finalUnit,
        inStock: true,
        stockCount: 9999,
        image: primaryImg,
        gallery: finalGallery,
        sizes: formSizes.length > 0 ? formSizes : undefined,
        colors: formColors.length > 0 ? formColors : undefined,
        description: formDescription,
        shortDescription: formDescription.slice(0, 100),
        features: ['100% Genuine Certified', '7-Day Easy Returns Guarantee', 'Nationwide Cash on Delivery'],
        specifications: { Category: categoryName, Subcategory: finalSubcategory || 'General', Unit: finalUnit, Origin: 'Authentic Sourced' },
        isTrending: false,
        isBestSeller: formIsBestSeller,
        isNewArrival: true,
        rating: 5.0,
        reviewCount: 1,
        tags: ['new', formCategory, ...(finalSubcategory ? [finalSubcategory.toLowerCase()] : [])],
      });
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" from database and store?`)) {
      deleteProduct(id);
    }
  };

  // Subcategory management handlers
  const handleAddSubcategorySubmit = (categoryId: string) => {
    const inputVal = newSubcategoryInputs[categoryId] || '';
    if (!inputVal.trim()) {
      addToast('Please enter a subcategory name.', 'error');
      return;
    }
    addSubcategory(categoryId, inputVal.trim());
    setNewSubcategoryInputs((prev) => ({ ...prev, [categoryId]: '' }));
  };

  // Category Add / Edit Handlers
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCatFormName('');
    setCatFormSlug('');
    setCatFormImage('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop');
    setCatFormTagline('');
    setCatFormBadge('');
    setCatFormSubs([]);
    setNewSubInModal('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryInfo) => {
    setEditingCategoryId(cat.id);
    setCatFormName(cat.name);
    setCatFormSlug(cat.slug);
    setCatFormImage(cat.image);
    setCatFormTagline(cat.tagline || '');
    setCatFormBadge(cat.badge || '');
    setCatFormSubs(cat.popularSubcategories || []);
    setNewSubInModal('');
    setIsCategoryModalOpen(true);
  };

  const handleAddSubInModal = () => {
    const trimmed = newSubInModal.trim();
    if (!trimmed) return;
    if (!catFormSubs.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setCatFormSubs((prev) => [...prev, trimmed]);
      setNewSubInModal('');
    }
  };

  const handleRemoveSubInModal = (subName: string) => {
    setCatFormSubs((prev) => prev.filter((s) => s !== subName));
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) {
      addToast('Please enter category name.', 'error');
      return;
    }
    const slug = (catFormSlug.trim() || catFormName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
    const id = editingCategoryId || slug;
    const image = catFormImage.trim() || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop';

    const catData: CategoryInfo = {
      id: id as any,
      name: catFormName.trim(),
      slug,
      image,
      tagline: catFormTagline.trim() || `${catFormName.trim()} collection`,
      badge: catFormBadge.trim() || undefined,
      popularSubcategories: catFormSubs,
    };

    if (editingCategoryId) {
      updateCategory(catData);
    } else {
      addCategory(catData);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে অর্ডার #${orderNumber} এবং এর সমস্ত তথ্য ডাটাবেজ থেকে চিরতরে মুছে ফেলতে চান?`)) {
      deleteOrder(orderId);
      if (selectedOrderForDetails?.id === orderId) {
        setSelectedOrderForDetails(null);
      }
    }
  };

  return (
    <div id="admin-dashboard-page" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
              Zayn.Fashion Control Center
            </span>
            <span className="text-xs text-slate-400">Live Production Dashboard</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Store Administration & Inventory
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              updateUserProfile({ role: 'customer' });
              navigateTo('home');
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>

          <button
            onClick={handleOpenAddProduct}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Sales & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories & Subcategories ({totalSubcategoriesCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{formatPrice(totalRevenue)}</p>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.8% this month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{orders.length}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>{activeOrdersCount} pending fulfillment</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Architecture</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{categories.length} Cats / {totalSubcategoriesCount} Subs</p>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                <span>{products.length} active SKUs online</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Units Delivered</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalItemsSold} Items</p>
              <div className="flex items-center gap-1 text-xs text-rose-600 font-bold">
                <span>99.2% customer satisfaction</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading text-lg font-black text-slate-900">Recent Customer Orders</h3>
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{o.orderNumber}</span>
                    <span className="text-slate-500 ml-2">by {o.shippingAddress?.receiverName || o.customerProfile?.name || 'Customer'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-slate-100 text-slate-800">
                    {o.status}
                  </span>
                  <span className="font-extrabold text-slate-900">{formatPrice(o.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Cloud Database Status & Backup/Restore Panel */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-5 rounded-3xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Firebase Cloud Database Live
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-200">
                  {products.length} Products Active in Cloud Storage
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={handleManualCloudSync}
                disabled={isSyncingCloud || isLoadingProducts}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Refresh catalog data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud || isLoadingProducts ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isSyncingCloud ? 'Syncing...' : 'Sync Catalog'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportProductsBackup}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Download JSON backup of all products"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Backup JSON</span>
              </button>

              <label
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Restore or import products from a JSON file"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Restore JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportProductsBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-rose-500"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({products.filter((p) => p.category === c.id).length})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add SKU</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category & Subcategory</th>
                    <th className="p-4">Price & Unit</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4">Variants & Images</th>
                    <th className="p-4">Best Seller</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const filtered = (products || []).filter((p) => {
                      const matchSearch = (p.name || '').toLowerCase().includes(productSearch.toLowerCase());
                      const matchCat = filterCategory === 'all' || p.category === filterCategory;
                      return matchSearch && matchCat;
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={7} className="p-10 text-center">
                            <div className="max-w-md mx-auto space-y-3">
                              <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
                                <Package className="w-6 h-6" />
                              </div>
                              <h4 className="font-bold text-slate-800 text-sm">No products in inventory</h4>
                              <p className="text-xs text-slate-500">
                                {products.length === 0
                                  ? 'Your store is ready for publishing! Add your official products to save them in your store database.'
                                  : 'No products matched your search or category filter.'}
                              </p>
                              <div className="pt-2 flex items-center justify-center gap-3">
                                <button
                                  onClick={handleOpenAddProduct}
                                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Add First Product</span>
                                </button>
                                {products.length === 0 && (
                                  <button
                                    onClick={seedStarterCatalogToFirestore}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                                  >
                                    <span>Import Sample Catalog (Optional)</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-contain bg-slate-100 border shrink-0 p-0.5"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate max-w-xs">{prod.name}</span>
                              <span className="text-[10px] text-slate-400">SKU: {prod.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-800 font-bold block">{prod.categoryName}</span>
                          {prod.subcategory ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md mt-0.5">
                              <Tag className="w-3 h-3" />
                              {prod.subcategory}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No subcategory</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">{formatPrice(prod.price)}</span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Per {prod.unit || 'Piece'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3 h-3" />
                            Always In Stock
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 text-[11px] text-slate-600">
                            <div className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-slate-400" />
                              <span>{prod.gallery && prod.gallery.length > 0 ? prod.gallery.length : 1} Images</span>
                            </div>
                            {(prod.sizes?.length || 0) > 0 && (
                              <div className="text-[10px] text-slate-500">
                                Sizes: {prod.sizes?.join(', ')}
                              </div>
                            )}
                            {(prod.colors?.length || 0) > 0 && (
                              <div className="flex items-center gap-1">
                                {prod.colors?.map((c) => (
                                  <span
                                    key={c.name}
                                    className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {prod.isBestSeller ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg">
                              <Award className="w-3 h-3 text-amber-600" />
                              Best Seller
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">—</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES & SUBCATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & Quick Intro */}
          <div className="bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-600 text-white rounded-lg">
                  <Layers className="w-4 h-4" />
                </span>
                <h3 className="font-heading text-lg font-black text-slate-900">
                  Category & Subcategory Management (ক্যাটাগরি ও সাব-ক্যাটাগরি কন্ট্রোল)
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Add new departments, edit existing categories, and organize subcategories. Changes synchronize automatically across the entire store.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <div className="relative w-full sm:w-60 shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search category/subcategory..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-rose-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Category</span>
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(categories || [])
              .filter((c) => {
                if (!categorySearch.trim()) return true;
                const query = categorySearch.toLowerCase();
                const matchName = (c.name || '').toLowerCase().includes(query);
                const matchSub = (c.popularSubcategories || []).some((s) => (s || '').toLowerCase().includes(query));
                return matchName || matchSub;
              })
              .map((cat) => {
                const categoryProducts = (products || []).filter((p) => p.category === cat.id);
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 hover:border-rose-300 transition-colors"
                  >
                    {/* Category Top Banner */}
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading text-base font-extrabold text-slate-900">
                              {cat.name}
                            </h4>
                            {cat.badge && (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {cat.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cat)}
                            title={`Edit ${cat.name}`}
                            className="px-2.5 py-1 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg inline-block">
                            {categoryProducts.length} Products
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Active Subcategories Badges */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Active Subcategories ({(cat.popularSubcategories || []).length})
                      </label>

                      {(!cat.popularSubcategories || cat.popularSubcategories.length === 0) ? (
                        <p className="text-xs text-slate-400 italic py-2">
                          No subcategories added yet. Use the field below to add one.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(cat.popularSubcategories || []).map((subName) => {
                            const subProductCount = categoryProducts.filter(
                              (p) => (p.subcategory || '').toLowerCase() === (subName || '').toLowerCase()
                            ).length;

                            return (
                              <div
                                key={subName}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 shadow-2xs"
                              >
                                <span className="font-semibold">{subName}</span>
                                {subProductCount > 0 && (
                                  <span className="px-1.5 py-0.2 bg-white text-slate-500 text-[10px] font-bold rounded-md border border-slate-200">
                                    {subProductCount}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Add Subcategory Form */}
                    <div className="pt-2 border-t border-slate-100">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddSubcategorySubmit(cat.id);
                        }}
                        className="flex items-center gap-2"
                      >
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={newSubcategoryInputs[cat.id] || ''}
                            onChange={(e) =>
                              setNewSubcategoryInputs((prev) => ({
                                ...prev,
                                [cat.id]: e.target.value,
                              }))
                            }
                            placeholder={`Add new subcategory in ${cat.name}...`}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-rose-600 focus:bg-white transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Sub</span>
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (() => {
        const filteredOrders = (orders || []).filter((ord) => {
          if (!ord) return false;
          const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
          if (!matchesStatus) return false;
          if (!orderSearchQuery.trim()) return true;
          const query = orderSearchQuery.toLowerCase().trim();
          const ordNum = (ord.orderNumber || ord.id || '').toLowerCase();
          const receiver = (ord.shippingAddress?.receiverName || ord.customerProfile?.name || '').toLowerCase();
          const phone = (ord.shippingAddress?.phone || '').toLowerCase();
          const email = (ord.userEmail || ord.customerProfile?.email || '').toLowerCase();
          const city = (ord.shippingAddress?.city || '').toLowerCase();
          const area = (ord.shippingAddress?.area || '').toLowerCase();
          return (
            ordNum.includes(query) ||
            receiver.includes(query) ||
            phone.includes(query) ||
            email.includes(query) ||
            city.includes(query) ||
            area.includes(query)
          );
        });

        const totalRevenue = (orders || []).reduce((sum, o) => sum + (o?.total || 0), 0);
        const pendingCount = (orders || []).filter((o) => o && ['placed', 'confirmed', 'processing'].includes(o.status)).length;
        const shippedCount = (orders || []).filter((o) => o && ['shipped', 'out_for_delivery'].includes(o.status)).length;
        const deliveredCount = (orders || []).filter((o) => o && o.status === 'delivered').length;

        return (
          <div className="space-y-6 animate-in fade-in">
            {/* Header & Metrics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Orders</p>
                  <p className="font-heading font-black text-lg text-slate-900">{orders.length}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Pending / Packed</p>
                  <p className="font-heading font-black text-lg text-slate-900">{pendingCount}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">In Transit</p>
                  <p className="font-heading font-black text-lg text-slate-900">{shippedCount}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Revenue</p>
                  <p className="font-heading font-black text-lg text-emerald-600">{formatPrice(totalRevenue)}</p>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order #, Customer Name, Phone, Email, City..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400"
                  />
                  {orderSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter Dropdown / Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                  {[
                    { key: 'all', label: 'All Orders' },
                    { key: 'placed', label: 'Placed' },
                    { key: 'confirmed', label: 'Confirmed' },
                    { key: 'processing', label: 'Processing' },
                    { key: 'shipped', label: 'Shipped' },
                    { key: 'delivered', label: 'Delivered' },
                    { key: 'cancelled', label: 'Cancelled' },
                  ].map((tab) => {
                    const isActive = orderStatusFilter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setOrderStatusFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer text-xs ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Informative Hint Banner */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders. Click any row or &quot;View Details&quot; to inspect full profile, address, and past orders.</span>
                </span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Order Details</th>
                      <th className="p-4">Customer / Profile</th>
                      <th className="p-4">Shipping Destination</th>
                      <th className="p-4">Payment & Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          <p className="font-semibold text-sm">No orders found matching your criteria</p>
                          <p className="text-xs mt-1">Try clearing your search query or status filter</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const isRegistered = !!(ord.customerProfile || ord.userId);
                        return (
                          <tr
                            key={ord.id}
                            onClick={() => setSelectedOrderForDetails(ord)}
                            className="hover:bg-rose-50/40 cursor-pointer transition-colors group"
                          >
                            {/* Order Number & Date */}
                            <td className="p-4 align-top">
                              <div className="space-y-1">
                                <span className="font-heading font-black text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
                                  {ord.orderNumber}
                                </span>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{ord.date}</span>
                                </div>
                                <span className="inline-block text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                                  {(ord.items || []).length} item{(ord.items || []).length > 1 ? 's' : ''}
                                </span>
                              </div>
                            </td>

                            {/* Customer Profile & Info */}
                            <td className="p-4 align-top">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                                    {(ord.customerProfile?.name || ord.shippingAddress?.receiverName || 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 block leading-tight">
                                      {ord.customerProfile?.name || ord.shippingAddress?.receiverName || 'Customer'}
                                    </span>
                                    {isRegistered ? (
                                      <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
                                        <BadgeCheck className="w-2.5 h-2.5" /> Registered Profile
                                      </span>
                                    ) : (
                                      <span className="text-[9px] text-slate-400">Guest Checkout</span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="font-semibold">{ord.shippingAddress?.phone || 'No phone'}</span>
                                </div>

                                {(ord.userEmail || ord.customerProfile?.email) && (
                                  <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[180px]">
                                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{ord.userEmail || ord.customerProfile?.email}</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Delivery Address */}
                            <td className="p-4 align-top">
                              <div className="space-y-0.5 max-w-[220px]">
                                <div className="flex items-start gap-1 text-slate-800 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{ord.shippingAddress?.streetAddress || 'Address not specified'}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 pl-4.5">
                                  {ord.shippingAddress?.area ? `${ord.shippingAddress.area}, ` : ''}{ord.shippingAddress?.city || ''}
                                </p>
                              </div>
                            </td>

                            {/* Payment & Total */}
                            <td className="p-4 align-top">
                              <div className="space-y-1">
                                <p className="font-black text-sm text-slate-900">
                                  {formatPrice(ord.total)}
                                </p>
                                <div className="flex items-center gap-1.5">
                                  <span className="uppercase text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {ord.paymentMethod}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                      ord.paymentStatus === 'paid'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {ord.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="p-4 align-top" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={ord.status}
                                onChange={(e) => {
                                  updateOrderStatus(ord.id, e.target.value as OrderStatus);
                                  addToast(`Order ${ord.orderNumber} status changed to ${e.target.value}`, 'success');
                                }}
                                className="bg-slate-50 hover:bg-white border border-slate-300 focus:border-rose-500 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                              >
                                <option value="placed">Placed (নতুন)</option>
                                <option value="confirmed">Confirmed (নিশ্চিত)</option>
                                <option value="processing">Processing (প্যাকিং)</option>
                                <option value="shipped">Shipped (কুরিয়ারে)</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered (সম্পন্ন)</option>
                                <option value="cancelled">Cancelled (বাতিল)</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="p-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderForDetails(ord)}
                                  className="px-3 py-1.5 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Full Details</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                                  title={`Delete Order #${ord.orderNumber}`}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Product Add / Edit Modal with Ordered Steps (Category First -> Subcategory Second) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                  <Package className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-black text-slate-900">
                    {editingProductId ? 'Edit Product SKU' : 'Add New Product to Zayn.Fashion'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Select Category first, then pick or add Subcategory</p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Product Title / নাম *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Handcrafted Dhakai Jamdani Saree"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white transition-all"
                />
              </div>

              {/* STEP 1: CATEGORY SELECTION & STEP 2: SUBCATEGORY SELECTION */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Category & Subcategory Arrangement</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Category Selector (FIRST) */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      ১. Category নির্বাচন করুন (Category) *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full bg-white border-2 border-rose-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-600"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Subcategory Selector (SECOND - Dynamically Populated) */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      ২. Subcategory নির্বাচন করুন (Subcategory) *
                    </label>
                    <select
                      value={isCustomSubcategory ? '__custom__' : formSubcategory}
                      onChange={(e) => handleSubcategoryChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-600"
                    >
                      {availableSubcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      <option value="__custom__">+ Add / Type Custom Subcategory...</option>
                    </select>
                  </div>
                </div>

                {/* Inline Custom Subcategory Input if requested */}
                {isCustomSubcategory && (
                  <div className="pt-2 border-t border-slate-200 animate-in fade-in">
                    <label className="font-bold text-rose-700 block mb-1 text-[11px]">
                      Type New Subcategory Name (নতুন সাব-ক্যাটাগরির নাম লিখুন):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formCustomSubcategory}
                        onChange={(e) => setFormCustomSubcategory(e.target.value)}
                        placeholder="e.g. Summer T-Shirts, Sports Accessories..."
                        className="flex-1 bg-white border border-rose-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (formCustomSubcategory.trim()) {
                            addSubcategory(formCategory, formCustomSubcategory.trim());
                            setFormSubcategory(formCustomSubcategory.trim());
                            setIsCustomSubcategory(false);
                          }
                        }}
                        className="px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 cursor-pointer"
                      >
                        Save Sub
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Unit Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (মূল্য - ৳) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit / পরিমাপের একক *</label>
                  <select
                    value={isCustomUnit ? '__custom__' : formUnit}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Unit Input if selected */}
              {isCustomUnit && (
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 animate-in fade-in">
                  <label className="font-bold text-rose-800 block mb-1 text-[11px]">
                    Custom Unit Name (কাস্টম এককের নাম লিখুন - যেমন: ৫০০ গ্রাম প্যাক, বান্ডেল ইত্যাদি):
                  </label>
                  <input
                    type="text"
                    required
                    value={formCustomUnit}
                    onChange={(e) => setFormCustomUnit(e.target.value)}
                    placeholder="e.g. 500g Pack, Bundle, Strip, Bottle"
                    className="w-full bg-white border border-rose-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              )}

              {/* Multiple Images Gallery Management */}
              <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    <span>Product Images / গ্যালারির ছবিসমূহ ({formGallery.length})</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Add multiple image URLs</span>
                </div>

                {/* Primary Image */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Primary Image URL (প্রধান ছবির লিংক):
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormImage(val);
                          if (val && !formGallery.includes(val)) {
                            setFormGallery((prev) => (prev.length === 0 ? [val] : [val, ...prev.filter((x) => x !== val)]));
                          }
                        }}
                        placeholder="এখানে প্রডাক্ট ছবির লিঙ্ক পেস্ট করুন (e.g. https://...)"
                        className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-3 pr-8 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                      />
                      {formImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormImage('');
                            setFormGallery((prev) => prev.filter((img) => img !== formImage));
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 p-0.5"
                          title="Clear image URL"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {formImage ? (
                      <img
                        src={formImage}
                        alt="Primary preview"
                        className="w-9 h-9 rounded-lg object-contain border border-slate-300 bg-white p-0.5 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Additional Image to Gallery */}
                <div className="pt-2 border-t border-slate-200/60">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    + Add More Gallery Images (আরও ছবি যুক্ত করুন):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGalleryInput}
                      onChange={(e) => setNewGalleryInput(e.target.value)}
                      placeholder="Paste additional product image URL..."
                      className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImage}
                      className="px-3 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Gallery Thumbnails List */}
                {formGallery.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {formGallery.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group w-14 h-14 rounded-xl border border-slate-300 overflow-hidden bg-white p-0.5 shadow-xs"
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md opacity-90 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {formImage === imgUrl && (
                            <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-bold text-white text-center py-0.5">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Variants (Sizes/Weights & Colors) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-rose-600" />
                    <span>Product Variants / ভেরিয়েন্ট (সাইজ, ওজন ও রঙ)</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Optional</span>
                </div>

                {/* 1. Size / Weight / Quantity Options */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Sizes / Weight / Options (সাইজ বা ওজনের অপশন):
                  </label>
                  
                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className="text-[10px] text-slate-400 font-medium mr-1">Quick:</span>
                    {['Free Size', 'S', 'M', 'L', 'XL', 'XXL', '250g', '500g', '1kg', '1 Pc', '2 Pcs', 'Set of 3'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (!formSizes.includes(preset)) {
                            setFormSizes((prev) => [...prev, preset]);
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                          formSizes.includes(preset)
                            ? 'bg-rose-100 border-rose-300 text-rose-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>

                  {/* Add Custom Size Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSizeVariant();
                        }
                      }}
                      placeholder="Type custom size/weight (e.g. 500ml, 38, 40, XL)..."
                      className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddSizeVariant}
                      className="px-3 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  {/* Active Sizes Chips */}
                  {formSizes.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {formSizes.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 text-xs font-bold bg-white text-slate-800 border border-slate-300 px-2.5 py-1 rounded-xl shadow-xs"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => handleRemoveSizeVariant(s)}
                            className="text-slate-400 hover:text-rose-600 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Color Variants */}
                <div className="pt-2 border-t border-slate-200/60">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Color Variants (রঙের ভেরিয়েন্ট):
                  </label>

                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-xl border border-slate-300 cursor-pointer bg-white"
                      title="Choose Color Hex"
                    />
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddColorVariant();
                        }
                      }}
                      placeholder="Color name (e.g. Red, Royal Blue, Black, Golden)..."
                      className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddColorVariant}
                      className="px-3 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Color</span>
                    </button>
                  </div>

                  {/* Active Colors List */}
                  {formColors.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {formColors.map((col) => (
                        <span
                          key={col.name}
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-800 border border-slate-300 px-2.5 py-1 rounded-xl shadow-xs"
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-slate-400 shrink-0"
                            style={{ backgroundColor: col.hex }}
                          />
                          {col.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveColorVariant(col.name)}
                            className="text-slate-400 hover:text-rose-600 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / বিবরণ</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                />
              </div>

              {/* Badges Toggle - Best Seller Only */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 cursor-pointer text-xs font-bold text-amber-950 hover:bg-amber-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={formIsBestSeller}
                    onChange={(e) => setFormIsBestSeller(e.target.checked)}
                    className="accent-amber-600 w-4 h-4 rounded cursor-pointer"
                  />
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Mark as Best Seller (হোমপেজ Best Sellers সেকশনে দেখাবে)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingProductId ? 'Update Product' : 'Save & Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Create / Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                  <Layers className="w-5 h-5" />
                </span>
                <h3 className="font-heading text-lg font-black text-slate-900">
                  {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catFormName}
                  onChange={(e) => {
                    setCatFormName(e.target.value);
                    if (!editingCategoryId) {
                      setCatFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Kids Toys, Women Fashion, Electronics"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category Slug / ID</label>
                <input
                  type="text"
                  value={catFormSlug}
                  onChange={(e) => setCatFormSlug(e.target.value)}
                  placeholder="e.g. kids-toys, electronics"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={catFormImage}
                  onChange={(e) => setCatFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                />
                {catFormImage && (
                  <img
                    src={catFormImage}
                    alt="Category preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-24 object-cover rounded-xl mt-2 border border-slate-200"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline / Short Subtitle</label>
                <input
                  type="text"
                  value={catFormTagline}
                  onChange={(e) => setCatFormTagline(e.target.value)}
                  placeholder="e.g. Premium trending collection for everyday lifestyle"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  value={catFormBadge}
                  onChange={(e) => setCatFormBadge(e.target.value)}
                  placeholder="e.g. Hot, Trending, Popular, 20% Off"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                />
              </div>

              {/* Subcategories in Modal */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 block mb-1">Subcategories ({catFormSubs.length})</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubInModal}
                    onChange={(e) => setNewSubInModal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubInModal();
                      }
                    }}
                    placeholder="Type subcategory name and click Add..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-rose-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubInModal}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {catFormSubs.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      {sub}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubInModal(sub)}
                        className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCategoryId ? 'Update Category' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Order Details & Customer Profile Intelligence Modal */}
      {selectedOrderForDetails && (
        <AdminOrderDetailsModal
          order={selectedOrderForDetails}
          isOpen={!!selectedOrderForDetails}
          onClose={() => setSelectedOrderForDetails(null)}
          onSelectOrder={(newOrd) => setSelectedOrderForDetails(newOrd)}
        />
      )}
    </div>
  );
};
