import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    navigateTo,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);
  const allImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAddToCart = () => {
    const color = selectedColor || (product.colors && product.colors[0]?.name);
    const size = selectedSize || (product.sizes && product.sizes[0]);
    addToCart(product, quantity, color, size, false);
    closeQuickView();
  };

  const handleViewFullPage = () => {
    closeQuickView();
    navigateTo('product-details', { productId: product.id });
  };

  return (
    <div
      id="quick-view-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={closeQuickView}
    >
      <div
        id="quick-view-modal-content"
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-3xl w-full overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="quick-view-close-btn"
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Left */}
        <div className="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200/60 shadow-inner flex items-center justify-center p-3">
            <img
              src={allImages[activeImageIndex] || product.image}
              alt={product.name}
              className="max-w-full max-h-full w-auto h-auto object-contain"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-sm">
                -{product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white p-0.5 flex items-center justify-center ${
                    activeImageIndex === idx ? 'border-rose-600 ring-2 ring-rose-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Right */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {product.name}
            </h2>

            {/* Price section */}
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-2xl font-extrabold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.unit && (
                <span className="text-sm font-semibold text-slate-500">
                  / {product.unit}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                In Stock • Always Available
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {product.shortDescription}
            </p>

            {/* Colors variant */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-700 mb-2">Color: {selectedColor || product.colors[0].name}</p>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                        (selectedColor || product.colors![0].name) === c.name
                          ? 'border-rose-600 scale-110'
                          : 'border-white shadow-sm'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {(selectedColor || product.colors![0].name) === c.name && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes variant */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-700 mb-2">Option / Size: {selectedSize || product.sizes[0]}</p>
                <div className="flex items-center gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                        (selectedSize || product.sizes![0]) === s
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                id="quick-view-add-to-cart-btn"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatPrice(product.price * quantity)})</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isFavorited
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-slate-200 text-slate-500 hover:text-rose-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleViewFullPage}
              className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View full product specifications & reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
