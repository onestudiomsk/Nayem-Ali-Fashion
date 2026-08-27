import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/categories';
import { ProductCard } from '../product/ProductCard';
import {
  SlidersHorizontal,
  Grid,
  List,
  Star,
  X,
  Search,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryId,
    searchQuery,
    setSearchQuery,
    navigateTo,
    formatPrice,
  } = useStore();

  const [layout, setLayout] = useState<'grid' | 'horizontal'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter states
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popular');

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategoryId && p.category !== selectedCategoryId) {
          return false;
        }

        // Subcategory filter
        if (
          selectedSubcategory !== 'all' &&
          (p.subcategory || '').toLowerCase() !== selectedSubcategory.toLowerCase()
        ) {
          return false;
        }

        // Search keyword filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = (p.name || '').toLowerCase().includes(query);
          const matchCat = (p.categoryName || '').toLowerCase().includes(query);
          const matchTags = (p.tags || []).some((t) => (t || '').toLowerCase().includes(query));
          if (!matchName && !matchCat && !matchTags) return false;
        }

        // Price range filter
        if (p.price < minPrice || p.price > maxPrice) {
          return false;
        }

        // Rating filter
        if (selectedRating > 0 && p.rating < selectedRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
        // Popularity default
        return b.reviewCount - a.reviewCount;
      });
  }, [products, selectedCategoryId, selectedSubcategory, searchQuery, minPrice, maxPrice, selectedRating, sortBy]);

  // Reset visible count when filter/sort options change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategoryId, selectedSubcategory, searchQuery, minPrice, maxPrice, selectedRating, sortBy]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    if (visibleCount >= filteredProducts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { rootMargin: '350px' }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [visibleCount, filteredProducts.length, isLoadingMore]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleResetFilters = () => {
    navigateTo('shop', { categoryId: undefined });
    setSelectedSubcategory('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(20000);
    setSelectedRating(0);
    setSortBy('popular');
  };

  const hasActiveFilters =
    Boolean(selectedCategoryId) ||
    selectedSubcategory !== 'all' ||
    Boolean(searchQuery) ||
    minPrice > 0 ||
    maxPrice < 20000 ||
    selectedRating > 0;

  return (
    <div id="shop-catalog-page" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeCategory ? activeCategory.name : 'All Collections'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeCategory
              ? activeCategory.tagline
              : `Showing ${filteredProducts.length} verified products ready for nationwide shipping`}
          </p>
        </div>

        {/* Controls: Layout toggle & Sort dropdown */}
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-600" />
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Layout switcher (Grid vs Horizontal) */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('horizontal')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'horizontal'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-slate-400 font-semibold">Active:</span>

          {selectedCategoryId && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold">
              Category: {activeCategory?.name}
              <button onClick={() => navigateTo('shop', { categoryId: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold">
              Search: &ldquo;{searchQuery}&rdquo;
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold">
              {selectedRating}★ & Above
              <button onClick={() => setSelectedRating(0)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(minPrice > 0 || maxPrice < 20000) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
              {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              <button
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(20000);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Desktop Filter */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            {/* Categories Filter */}
            <div>
              <h3 className="font-heading text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                All Departments
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigateTo('shop', { categoryId: undefined });
                    setSelectedSubcategory('all');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    selectedCategoryId === undefined
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-[11px] opacity-80">{products.length}</span>
                </button>

                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => {
                          navigateTo('shop', { categoryId: cat.id });
                          setSelectedSubcategory('all');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[11px] opacity-80">{cat.productCount}</span>
                      </button>

                      {/* Subcategories dropdown if active */}
                      {isSelected && (
                        <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-rose-200 ml-3">
                          <button
                            onClick={() => setSelectedSubcategory('all')}
                            className={`w-full text-left px-2 py-1 text-[11px] font-semibold rounded-md ${
                              selectedSubcategory === 'all'
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            • All {cat.name}
                          </button>
                          {cat.popularSubcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setSelectedSubcategory(sub)}
                              className={`w-full text-left px-2 py-1 text-[11px] font-semibold rounded-md ${
                                selectedSubcategory === sub
                                  ? 'text-rose-600 font-bold'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              • {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-heading text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                Customer Rating
              </h3>
              <div className="space-y-1.5">
                {[5, 4, 3, 2].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                      selectedRating === r
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span>{r} Stars & Above</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Banner in sidebar */}
            <div className="p-4 bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl border border-rose-100 text-center space-y-2">
              <Sparkles className="w-5 h-5 text-rose-600 mx-auto" />
              <p className="text-xs font-extrabold text-slate-900">Zayn Express</p>
              <p className="text-[11px] text-slate-500">Fast nationwide doorstep delivery with safe cash on delivery!</p>
            </div>
          </div>
        </aside>

        {/* Right Product Grid Display */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try adjusting your search keywords, price filters, or department selections.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <>
              {layout === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                  {displayedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} layout="horizontal" />
                  ))}
                </div>
              )}

              {/* Infinite Scroll Bottom Sentinel */}
              <div ref={sentinelRef} className="pt-10 pb-6 text-center">
                {isLoadingMore ? (
                  <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-bold text-slate-700">
                    <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                    <span>আরও প্রোডাক্ট লোড হচ্ছে... (Loading more products)</span>
                  </div>
                ) : hasMore ? (
                  <button
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length))}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>নিচে স্ক্রল করুন অথবা আরও দেখতে ক্লিক করুন ({displayedProducts.length} / {filteredProducts.length})</span>
                  </button>
                ) : filteredProducts.length > 12 ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>সকল {filteredProducts.length}টি প্রোডাক্ট প্রদর্শিত হয়েছে</span>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-heading font-extrabold text-base text-slate-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">Category</h4>
              <select
                value={selectedCategoryId || ''}
                onChange={(e) => navigateTo('shop', { categoryId: e.target.value || undefined })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">Max Price</h4>
              <input
                type="range"
                min="0"
                max="20000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
              <div className="text-xs font-bold text-rose-600 mt-1">{formatPrice(maxPrice)}</div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
