import React from 'react';
import { Product } from '../../types';
import {
  Clock,
  TrendingUp,
  Search,
  X,
  ArrowRight,
  Flame,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface SearchSuggestionsDropdownProps {
  id?: string;
  searchQuery: string;
  recentSearches: string[];
  popularTags: string[];
  searchSuggestions: Product[];
  formatPrice: (amount: number) => string;
  onSelectSearchTerm: (term: string) => void;
  onRemoveRecentSearch: (term: string, e: React.MouseEvent) => void;
  onClearAllRecentSearches: (e: React.MouseEvent) => void;
  onSelectProductSuggestion: (product: Product) => void;
  onViewAllResults: () => void;
}

export const SearchSuggestionsDropdown: React.FC<SearchSuggestionsDropdownProps> = ({
  id = 'search-suggestions-dropdown',
  searchQuery,
  recentSearches,
  popularTags,
  searchSuggestions,
  formatPrice,
  onSelectSearchTerm,
  onRemoveRecentSearch,
  onClearAllRecentSearches,
  onSelectProductSuggestion,
  onViewAllResults,
}) => {
  const trimmedQuery = searchQuery.trim();
  const isTyping = trimmedQuery.length > 0;

  // Filter recent searches that match typing query
  const matchingRecentSearches = isTyping
    ? recentSearches.filter((item) =>
        item.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
    : recentSearches;

  return (
    <div
      id={id}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 divide-y divide-slate-100 max-h-[80vh] overflow-y-auto"
    >
      {/* 1. If user is NOT typing or query is very short: Show Recent Searches & Trending Searches */}
      {!isTyping && (
        <div className="p-3 space-y-3">
          {/* Recent Searches Section */}
          {recentSearches.length > 0 ? (
            <div>
              <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                  <span>Recent Searches</span>
                </div>
                <button
                  type="button"
                  id="clear-all-recent-searches-btn"
                  onClick={onClearAllRecentSearches}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-rose-50"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-0.5">
                {recentSearches.map((term, index) => (
                  <div
                    key={`recent-${index}-${term}`}
                    onClick={() => onSelectSearchTerm(term)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-orange-50/70 text-slate-700 hover:text-[#E67E22] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E67E22] shrink-0 transition-colors" />
                      <span className="text-xs font-semibold truncate">{term}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => onRemoveRecentSearch(term, e)}
                      title={`Remove "${term}" from history`}
                      className="p-1 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg transition-all shrink-0 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-slate-400">
              <span>No recent searches yet</span>
            </div>
          )}

          {/* Popular / Trending Searches Section */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 pb-2 text-xs font-bold text-slate-700">
              <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {popularTags.map((tag) => (
                <button
                  key={`popular-${tag}`}
                  type="button"
                  onClick={() => onSelectSearchTerm(tag)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-[#E67E22] border border-slate-200 hover:border-[#E67E22]/30 text-xs font-medium transition-all cursor-pointer group"
                >
                  <Flame className="w-3 h-3 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. If user IS typing: Show matching recent searches (if any) + Live Product Suggestions */}
      {isTyping && (
        <>
          {/* Matching Recent Queries */}
          {matchingRecentSearches.length > 0 && (
            <div className="p-2.5 bg-slate-50/70 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5 px-1">
                <Clock className="w-3 h-3 text-[#E67E22]" />
                <span>From Your Search History</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchingRecentSearches.slice(0, 4).map((term, index) => (
                  <button
                    key={`match-recent-${index}-${term}`}
                    type="button"
                    onClick={() => onSelectSearchTerm(term)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 text-slate-700 hover:text-[#E67E22] border border-slate-200 text-xs font-medium transition-all shadow-2xs cursor-pointer group"
                  >
                    <Search className="w-3 h-3 text-slate-400 group-hover:text-[#E67E22]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Suggestions List */}
          {searchSuggestions.length > 0 ? (
            <div>
              <div className="p-2.5 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600 px-3">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E67E22]" />
                  <span>Products ({searchSuggestions.length})</span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">
                  Press Enter to view all
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {searchSuggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => onSelectProductSuggestion(product)}
                    className="w-full p-2.5 flex items-center gap-3 hover:bg-orange-50/50 transition-colors text-left group cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-11 h-11 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#E67E22] truncate transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-[#E67E22]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                          {product.categoryName}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#E67E22] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#E67E22] flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                No products found for &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Try searching for another keyword or check popular tags
              </p>
            </div>
          )}

          {/* Bottom Action: View all results */}
          <button
            type="button"
            onClick={onViewAllResults}
            className="w-full py-2.5 bg-slate-50 hover:bg-orange-50 text-center text-xs font-bold text-[#E67E22] transition-colors block border-t border-slate-100 cursor-pointer"
          >
            View all results for &ldquo;{searchQuery}&rdquo; →
          </button>
        </>
      )}
    </div>
  );
};
