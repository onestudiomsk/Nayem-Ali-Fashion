import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { Sparkles, TrendingUp, Award, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface ProductGridSectionProps {
  type: 'trending' | 'bestsellers' | 'newarrivals' | 'all';
  title: string;
  subtitle: string;
  limit?: number;
  enableInfiniteScroll?: boolean;
}

// Fisher-Yates shuffle algorithm for random product distribution on refresh
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({
  type,
  title,
  subtitle,
  limit = 12,
  enableInfiniteScroll = true,
}) => {
  const { products, navigateTo } = useStore();
  const [visibleCount, setVisibleCount] = useState<number>(limit);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Randomize product ordering on every page refresh / load for 'all' section
  const baseProducts = useMemo(() => {
    if (type === 'all') {
      return shuffleArray(products);
    }
    return products;
  }, [products, type]);

  // Filter products based on section type
  const filtered = baseProducts.filter((p) => {
    if (type === 'bestsellers') return Boolean(p.isBestSeller);
    if (type === 'trending') return Boolean(p.isTrending);
    if (type === 'newarrivals') return Boolean(p.isNewArrival);
    if (type === 'all') return true;
    return true;
  });

  // Reset visibleCount whenever filter changes
  useEffect(() => {
    setVisibleCount(limit);
  }, [type, limit]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    if (!enableInfiniteScroll) return;
    if (visibleCount >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 8, filtered.length));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { rootMargin: '300px' }
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
  }, [enableInfiniteScroll, visibleCount, filtered.length, isLoadingMore]);

  const displayedProducts = enableInfiniteScroll
    ? filtered.slice(0, visibleCount)
    : filtered.slice(0, limit);

  const hasMore = visibleCount < filtered.length;

  const getIcon = () => {
    if (type === 'bestsellers') return <Award className="w-4 h-4 text-[#E67E22]" />;
    if (type === 'trending') return <TrendingUp className="w-4 h-4 text-[#E67E22]" />;
    if (type === 'all') return <Sparkles className="w-4 h-4 text-[#E67E22]" />;
    return <Sparkles className="w-4 h-4 text-[#E67E22]" />;
  };

  return (
    <section id={`section-${type}`} className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Title */}
      <div className="mb-8 border-b border-gray-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#E67E22] uppercase tracking-wider mb-1">
          {getIcon()}
          <span>{type === 'all' ? 'ALL PRODUCTS' : type.toUpperCase()} COLLECTION</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1A1C23] tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {/* Responsive Product Grid */}
      {displayedProducts.length === 0 ? (
        <div className="py-14 text-center bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
          <p className="text-sm font-semibold text-gray-700">No products available in this section right now.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Infinite Scroll Sentinel and Status Indicator */}
          {enableInfiniteScroll && (
            <div ref={sentinelRef} className="pt-8 pb-4 text-center">
              {isLoadingMore ? (
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-200/80 rounded-full shadow-xs text-xs font-bold text-gray-700">
                  <Loader2 className="w-4 h-4 text-[#E67E22] animate-spin" />
                  <span>আরও প্রোডাক্ট লোড হচ্ছে... (Loading more products)</span>
                </div>
              ) : hasMore ? (
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filtered.length))}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-gray-500 hover:text-[#E67E22] hover:bg-orange-50/50 rounded-xl transition-colors cursor-pointer"
                >
                  <span>স্ক্রল করুন অথবা আরও দেখতে ক্লিক করুন ({displayedProducts.length} / {filtered.length})</span>
                </button>
              ) : filtered.length > limit ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>সকল {filtered.length}টি প্রোডাক্ট প্রদর্শিত হয়েছে (All products loaded)</span>
                </div>
              ) : null}
            </div>
          )}
        </>
      )}

      {/* View More in Shop Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white hover:bg-orange-50 text-[#1A1C23] hover:text-[#E67E22] font-bold text-xs border border-gray-200 shadow-xs hover:shadow-sm transition-all group cursor-pointer"
        >
          <span>Explore All Collections in Shop</span>
          <ArrowRight className="w-4 h-4 text-[#E67E22] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

