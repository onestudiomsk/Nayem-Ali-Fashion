import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const {
    navigateTo,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    formatPrice,
  } = useStore();

  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    navigateTo('product-details', { productId: product.id });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : undefined;
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    addToCart(product, 1, defaultColor, defaultSize, false);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  if (layout === 'horizontal') {
    return (
      <div
        id={`product-card-horizontal-${product.id}`}
        onClick={handleCardClick}
        className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row cursor-pointer"
      >
        <div className="relative w-full sm:w-48 h-48 bg-gray-50 shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {Boolean(product.discountPercent && product.discountPercent > 0) && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#E67E22] text-white text-[11px] font-extrabold shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-[#E67E22] uppercase tracking-wider">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="font-semibold text-[#1A1C23] text-base group-hover:text-[#E67E22] transition-colors line-clamp-2">
              {product.name}
            </h3>

            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {product.shortDescription}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-[#1A1C23]">
                {formatPrice(product.price)}
              </span>
              {product.unit && (
                <span className="text-xs font-semibold text-gray-500">
                  / {product.unit}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-xl border transition-colors ${
                  isFavorited
                    ? 'bg-orange-50 border-orange-200 text-[#E67E22]'
                    : 'border-gray-200 text-gray-500 hover:text-[#E67E22] hover:bg-gray-50'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#E67E22]' : ''}`} />
              </button>

              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Discount Badge */}
        {Boolean(product.discountPercent && product.discountPercent > 0) && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#E67E22] text-white text-[10px] sm:text-xs font-extrabold shadow-xs tracking-tight">
            -{product.discountPercent}%
          </span>
        )}

        {/* Stock Badge if low */}
        {Boolean(product.stockCount !== undefined && product.stockCount <= 5 && product.stockCount > 0) && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
            Only {product.stockCount} left
          </span>
        )}

        {/* Hover Quick Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          {/* Wishlist Button */}
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-xs transition-all duration-200 ${
              isFavorited
                ? 'bg-[#E67E22] text-white'
                : 'bg-white/90 text-gray-600 hover:text-[#E67E22] hover:bg-white'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
          </button>

          {/* Quick View Button */}
          <button
            id={`quickview-btn-${product.id}`}
            onClick={handleOpenQuickView}
            className="w-8 h-8 rounded-full bg-white/90 text-gray-600 hover:text-[#E67E22] hover:bg-white backdrop-blur-md flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 hidden sm:flex"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#E67E22] truncate uppercase tracking-wider">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-gray-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-[#1A1C23] text-xs sm:text-sm group-hover:text-[#E67E22] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-[#1A1C23]">
                {formatPrice(product.price)}
              </span>
              {product.unit && (
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500">
                  / {product.unit}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 hover:bg-[#E67E22] hover:text-white text-[#1A1C23] text-xs font-bold transition-all duration-200 flex items-center gap-1 shrink-0"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

