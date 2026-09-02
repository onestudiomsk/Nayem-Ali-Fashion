import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Product } from '../../types';
import { SearchSuggestionsDropdown } from './SearchSuggestionsDropdown';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Truck,
  Sparkles,
  LayoutDashboard,
  LogOut,
  MapPin,
  Flame,
  ArrowRight,
  Download,
  Smartphone,
  Clock,
  TrendingUp,
} from 'lucide-react';

const LOCAL_STORAGE_RECENT_SEARCHES_KEY = 'ebundi_recent_searches_v1';

const POPULAR_SEARCH_TAGS = [
  'Panjabi',
  'Cotton Saree',
  'Smart Watch',
  'Sneakers',
  'Wireless Earbuds',
  'T-Shirt',
  'Leather Wallet',
  'Polo Shirt',
];

export const Navbar: React.FC = () => {
  const {
    activeView,
    navigateTo,
    categories,
    cartCount,
    cartSubtotal,
    wishlist,
    currentUser,
    isAdmin,
    openAuthModal,
    openCartDrawer,
    logout,
    searchQuery,
    setSearchQuery,
    products,
    formatPrice,
    currency,
    setCurrency,
  } = useStore();

  const { isInstallable, isInstalled, triggerInstall, isIOS } = usePwaInstall();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [selectedSearchCat, setSelectedSearchCat] = useState('all');

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load recent searches:', e);
    }
    return ['Panjabi', 'Smart Watch', 'Cotton Saree', 'Sneakers'];
  });

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save new search query to recent searches history
  const saveRecentSearch = (query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist recent searches:', e);
      }
      return updated;
    });
  };

  const handleRemoveRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item.toLowerCase() !== termToRemove.toLowerCase());
      try {
        localStorage.setItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist recent searches:', e);
      }
      return updated;
    });
  };

  const handleClearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY);
    } catch (e) {
      console.warn('Failed to clear recent searches:', e);
    }
  };

  // Filter products for instant search dropdown suggestions
  const searchSuggestions = searchQuery.trim().length > 1
    ? products
        .filter((p) => {
          const matchesQuery =
            (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.tags || []).some((t) => (t || '').toLowerCase().includes(searchQuery.toLowerCase()));
          const matchesCat = selectedSearchCat === 'all' || p.category === selectedSearchCat;
          return matchesQuery && matchesCat;
        })
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim();
    if (clean) {
      saveRecentSearch(clean);
      setIsSearchFocused(false);
      setIsMobileSearchFocused(false);
      navigateTo('shop', {
        searchQuery: clean,
        categoryId: selectedSearchCat !== 'all' ? selectedSearchCat : undefined,
      });
    }
  };

  const handleSelectSearchTerm = (term: string) => {
    saveRecentSearch(term);
    setSearchQuery(term);
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
    navigateTo('shop', {
      searchQuery: term,
      categoryId: selectedSearchCat !== 'all' ? selectedSearchCat : undefined,
    });
  };

  const handleSelectSuggestion = (product: Product) => {
    saveRecentSearch(product.name);
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
    navigateTo('product-details', { productId: product.id });
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs transition-all">
      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              id="header-logo-btn"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <img
                src="https://raw.githubusercontent.com/mskhereiam/nc-image/refs/heads/main/zayn.jpg"
                alt="Zayn.Fashion Logo"
                className="h-8 sm:h-9 md:h-10 w-8 sm:w-9 md:w-10 rounded-full object-cover shadow-xs border border-amber-500/30 group-hover:scale-105 transition-transform"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <span className="font-heading font-black text-xl sm:text-2xl tracking-tight text-[#1A1C23] flex items-center leading-none">
                Zayn<span className="text-[#E67E22]">.Fashion</span>
              </span>
            </button>
          </div>

          {/* Search Bar with Autocomplete */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative flex-1 flex items-center bg-gray-100 hover:bg-gray-100/90 focus-within:bg-white border border-transparent focus-within:border-[#E67E22] focus-within:ring-2 focus-within:ring-[#E67E22]/20 rounded-full transition-all duration-200 overflow-hidden">
                <input
                  id="header-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search products, styles, collections..."
                  className="w-full bg-transparent pl-4 pr-2 py-2 text-sm text-[#1A1C23] placeholder:text-gray-400 focus:outline-none"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-gray-400 hover:text-gray-600 mr-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  id="header-search-submit-btn"
                  type="submit"
                  className="bg-[#E67E22] hover:bg-[#D35400] text-white p-2 rounded-full m-1 transition-colors flex items-center justify-center shrink-0 shadow-sm"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Instant Search Suggestions & Recent Searches Dropdown */}
            {isSearchFocused && (
              <SearchSuggestionsDropdown
                id="search-suggestions-dropdown"
                searchQuery={searchQuery}
                recentSearches={recentSearches}
                popularTags={POPULAR_SEARCH_TAGS}
                searchSuggestions={searchSuggestions}
                formatPrice={formatPrice}
                onSelectSearchTerm={handleSelectSearchTerm}
                onRemoveRecentSearch={handleRemoveRecentSearch}
                onClearAllRecentSearches={handleClearAllRecentSearches}
                onSelectProductSuggestion={handleSelectSuggestion}
                onViewAllResults={() => handleSearchSubmit()}
              />
            )}
          </div>

          {/* Action Icons Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigateTo('account')}
              className="relative p-2 text-gray-700 hover:text-[#E67E22] rounded-full hover:bg-gray-100 transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span
                  id="header-wishlist-count-badge"
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E67E22] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={openCartDrawer}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-gray-100 hover:bg-orange-50 text-[#1A1C23] hover:text-[#E67E22] rounded-full transition-all border border-gray-200/80"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 text-gray-800 hover:text-[#E67E22]" />
                {cartCount > 0 && (
                  <span
                    id="header-cart-count-badge"
                    className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#E67E22] text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left text-xs leading-tight">
                <span className="text-[10px] text-gray-500 font-medium">Bag</span>
                <span className="font-bold text-[#1A1C23]">{formatPrice(cartSubtotal)}</span>
              </div>
            </button>

            {/* User Account / Profile */}
            <div ref={userDropdownRef} className="relative">
              {currentUser ? (
                <button
                  id="header-user-menu-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                  aria-label="User Account"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || 'User'}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white shadow-xs"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center border border-white shadow-xs">
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-600 hidden sm:block mr-1" />
                </button>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-gray-700 hover:text-[#E67E22] rounded-full hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && currentUser && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2.5 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-[#1A1C23] truncate">{currentUser.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-orange-50 text-[#E67E22]">
                      {currentUser.role}
                    </span>
                  </div>

                  <div className="py-1 text-sm text-gray-700">
                    <button
                      id="dropdown-profile-btn"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigateTo('account');
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      id="dropdown-orders-btn"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigateTo('account');
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      <span>My Orders</span>
                    </button>
                    <button
                      id="dropdown-tracking-btn"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigateTo('order-tracking');
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>Order Tracking</span>
                    </button>
                    <button
                      id="dropdown-wishlist-btn"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigateTo('account');
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span>Wishlist ({wishlist.length})</span>
                    </button>

                    <div className="my-1 border-t border-gray-100"></div>

                    {/* PWA Install in Dropdown if available */}
                    {!isInstalled && (
                      <button
                        id="dropdown-install-pwa-btn"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          triggerInstall();
                        }}
                        className="w-full px-3 py-2 text-left rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <Download className="w-4 h-4 text-rose-500" />
                        <span>Install Zayn.Fashion App</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        id="dropdown-admin-btn"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo('admin');
                        }}
                        className="w-full px-3 py-2 text-left rounded-lg hover:bg-amber-50 text-amber-900 flex items-center gap-2.5 font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div ref={mobileSearchContainerRef} className="relative pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="w-full flex items-center bg-gray-100 border border-transparent focus-within:border-[#E67E22] focus-within:bg-white rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#E67E22]/20">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                id="mobile-header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsMobileSearchFocused(true);
                }}
                onFocus={() => setIsMobileSearchFocused(true)}
                placeholder="Search products, categories..."
                className="w-full bg-transparent px-2.5 py-1 text-sm text-[#1A1C23] placeholder:text-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Mobile Instant Search Suggestions & Recent Searches Dropdown */}
          {isMobileSearchFocused && (
            <SearchSuggestionsDropdown
              id="mobile-search-suggestions-dropdown"
              searchQuery={searchQuery}
              recentSearches={recentSearches}
              popularTags={POPULAR_SEARCH_TAGS}
              searchSuggestions={searchSuggestions}
              formatPrice={formatPrice}
              onSelectSearchTerm={handleSelectSearchTerm}
              onRemoveRecentSearch={handleRemoveRecentSearch}
              onClearAllRecentSearches={handleClearAllRecentSearches}
              onSelectProductSuggestion={handleSelectSuggestion}
              onViewAllResults={() => handleSearchSubmit()}
            />
          )}
        </div>
      </div>

      {/* Category Menu Bar (Desktop) */}
      <nav id="category-navigation-bar" className="hidden lg:block bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 py-2 gap-1">
            {/* All Products Shop Link */}
            <button
              id="nav-all-shop-btn"
              onClick={() => navigateTo('shop')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                activeView === 'shop' && !selectedSearchCat
                  ? 'bg-[#1A1C23] text-white shadow-xs'
                  : 'hover:bg-gray-100 hover:text-[#E67E22] text-[#1A1C23] font-bold'
              }`}
            >
              <span>All Products</span>
            </button>

            {/* Category Links */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`nav-cat-${cat.id}`}
                onClick={() => navigateTo('shop', { categoryId: cat.id })}
                className="px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-[#E67E22] transition-colors flex items-center gap-1 text-gray-600 font-medium whitespace-nowrap"
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-backdrop"
          className="lg:hidden fixed inset-0 top-16 bg-slate-900/60 backdrop-blur-xs z-50 animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            id="mobile-drawer-content"
            className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img
                  src="https://raw.githubusercontent.com/mskhereiam/nc-image/refs/heads/main/zayn.jpg"
                  alt="Zayn.Fashion Logo"
                  className="h-8 w-8 rounded-full object-cover border border-amber-500/30 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <span className="font-heading font-black text-xl text-[#1A1C23]">
                  Zayn<span className="text-[#E67E22]">.Fashion</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Shop By Category
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('shop');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-[#1A1C23] hover:bg-orange-50 hover:text-[#E67E22] transition-colors flex items-center justify-between"
                >
                  <span>All Products</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('shop', { categoryId: cat.id });
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#E67E22] transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Quick Links
              </p>
              <div className="space-y-1 text-sm text-gray-700">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('order-tracking');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[#E67E22]" />
                  <span>Track Order</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('account');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{currentUser ? 'My Account & Orders' : 'Sign In / Account'}</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('admin');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-800 flex items-center gap-2 font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-600" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                {!isInstalled && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      triggerInstall();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center gap-2 font-bold transition-colors"
                  >
                    <Download className="w-4 h-4 text-rose-600" />
                    <span>📱 Install Zayn.Fashion App</span>
                  </button>
                )}
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 mt-4 text-xs text-gray-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>100% Genuine Products & Cash on Delivery Available</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
