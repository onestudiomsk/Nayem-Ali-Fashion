import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
  ThumbsUp,
  MessageSquarePlus,
  ArrowLeft,
  Flame,
  Zap,
} from 'lucide-react';

export const ProductDetailsView: React.FC = () => {
  const {
    products,
    selectedProductId,
    navigateTo,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    getProductReviews,
    addReview,
    addToast,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || (selectedProductId ? undefined : products[0]);

  if (!product) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#E67E22] flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The requested product is currently unavailable or may have been removed. Explore our other authentic collections.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-[#E67E22] hover:bg-[#D35400] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  const reviews = getProductReviews(product.id);
  const isFavorited = isInWishlist(product.id);

  const allImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );

  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'video' | 'reviews'>('desc');

  // Review submission state
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const handleAddToCart = (openDrawer = false) => {
    addToCart(product, quantity, selectedColor, selectedSize, openDrawer);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize, false);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      addToast('Please fill out all review fields', 'error');
      return;
    }
    addReview({
      productId: product.id,
      userName: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });
    setReviewerName('');
    setReviewComment('');
    setIsAddingReview(false);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div id="product-details-page" className="py-8 pb-32 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 overflow-x-auto no-scrollbar">
        <button onClick={() => navigateTo('home')} className="hover:text-rose-600 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button
          onClick={() => navigateTo('shop', { categoryId: product.category })}
          className="hover:text-rose-600 transition-colors whitespace-nowrap"
        >
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 w-full bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs group flex items-center justify-center p-3 sm:p-6">
            <img
              src={allImages[activeImageIndex] || product.image}
              alt={product.name}
              className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-extrabold shadow-md">
                -{product.discountPercent}% OFF
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-colors"
              title="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white p-1 flex items-center justify-center ${
                    activeImageIndex === idx
                      ? 'border-rose-600 ring-2 ring-rose-200 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Highlights under images */}
          <div className="hidden sm:grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Truck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Fast 24-48h Delivery</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>7-Day Easy Returns</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Authentic</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Purchasing Details */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Category, Brand, SKU & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  {product.categoryName} • {product.subcategory || 'Featured'}
                </span>
                {product.brand && (
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-slate-900 text-white tracking-wide">
                    {product.brand}
                  </span>
                )}
                {product.sku && (
                  <span className="text-[11px] font-mono text-slate-400">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.unit && (
                    <span className="text-sm font-semibold text-slate-500">
                      / {product.unit}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Inclusive of all local taxes</p>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  In Stock • Always Available
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Color: <span className="text-slate-900 font-extrabold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                        selectedColor === c.name
                          ? 'border-rose-600 ring-2 ring-rose-200 scale-110'
                          : 'border-white shadow-md'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check className="w-4 h-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Option / Size: <span className="text-slate-900 font-extrabold">{selectedSize}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedSize === s
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
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
            <div className="mt-5 flex items-center gap-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity:
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Total: <strong className="text-slate-900">{formatPrice(product.price * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Desktop Purchase Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button
                id="product-add-to-cart-btn"
                onClick={() => handleAddToCart(true)}
                className="flex-1 py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-600/25 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                id="product-wishlist-btn"
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-2xl border transition-colors ${
                  isFavorited
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-slate-200 text-slate-600 hover:text-rose-600'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            <button
              id="product-buy-now-btn"
              onClick={handleBuyNow}
              className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Buy Now (Instant Checkout)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Reviews */}
      <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-6 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('desc')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Specifications
          </button>
          {product.videoUrl && (
            <button
              onClick={() => setActiveTab('video')}
              className={`text-sm font-bold pb-2 transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Product Video</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px]">HD</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content 1: Description */}
        {activeTab === 'desc' && (
          <div className="py-6 space-y-6 animate-in fade-in">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {product.description || product.shortDescription}
            </p>

            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">Key Highlights & Benefits:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Specifications */}
        {activeTab === 'specs' && (
          <div className="py-6 animate-in fade-in">
            <div className="max-w-2xl divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                <div key={idx} className="grid grid-cols-3 p-3.5 text-xs sm:text-sm bg-white even:bg-slate-50">
                  <span className="font-semibold text-slate-600">{key}</span>
                  <span className="col-span-2 text-slate-900 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Product Video */}
        {activeTab === 'video' && product.videoUrl && (
          <div className="py-6 animate-in fade-in space-y-4">
            <div className="max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-lg">
              <video
                src={product.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={product.image}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-center text-xs text-slate-500">
              Official HD product demonstration & fabric drape preview.
            </p>
          </div>
        )}

        {/* Tab Content 3: Customer Reviews & Submission */}
        {activeTab === 'reviews' && (
          <div className="py-6 space-y-8 animate-in fade-in">
            {/* Reviews Summary Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="font-heading text-4xl font-extrabold text-slate-900">{product.rating}</span>
                  <div className="flex items-center gap-0.5 text-amber-400 justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">Based on {product.reviewCount} ratings</span>
                </div>
              </div>

              <button
                onClick={() => setIsAddingReview(!isAddingReview)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Verified Review</span>
              </button>
            </div>

            {/* Write Review Form */}
            {isAddingReview && (
              <form onSubmit={handleSubmitReview} className="p-6 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Share Your Product Experience</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Farhana Akter"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ 4 - Good</option>
                      <option value={3}>⭐⭐⭐ 3 - Average</option>
                      <option value={2}>⭐⭐ 2 - Poor</option>
                      <option value={1}>⭐ 1 - Terrible</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe product quality, delivery speed, and how it matched expectations..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingReview(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500">No written reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Add to Cart / Buy Now Bottom Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Price</span>
          <span className="font-extrabold text-base text-slate-900">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => handleAddToCart(true)}
            className="py-2.5 px-3.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl text-xs flex items-center gap-1 border border-rose-200"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="py-2.5 px-4 bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-rose-600/30"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
