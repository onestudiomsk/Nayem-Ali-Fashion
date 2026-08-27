import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
    formatPrice,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div id="cart-empty-view" className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-2">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          Looks like you haven&apos;t added any items to your cart yet. Explore our trending categories and exclusive offers!
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-rose-600/30 inline-flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div id="cart-full-page" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({cartCount} items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your selections before proceeding to secure checkout</p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      {/* Main Cart Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Details */}
                <div
                  className="flex items-center gap-4 flex-1 cursor-pointer"
                  onClick={() => navigateTo('product-details', { productId: item.product.id })}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                      {item.product.categoryName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base hover:text-rose-600 transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                    </div>
                    <p className="text-xs font-bold text-slate-900 sm:hidden mt-2">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>
                </div>

                {/* Pricing, Quantity & Removal */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Modifier */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <span className="font-extrabold text-base text-slate-900 block">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatPrice(item.product.price)} / unit
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue shopping button */}
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Right Column: Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-rose-600" />
              <h3 className="font-heading text-sm font-extrabold text-slate-900">
                Apply Promo / Coupon Code
              </h3>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-mono font-bold text-xs text-emerald-900 block">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[11px] text-emerald-700">{appliedCoupon.description}</span>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-emerald-700 hover:text-rose-600"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. ZAYN20, WELCOME10"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 uppercase font-mono font-semibold focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>Try:</span>
                  <button
                    type="button"
                    onClick={() => setCouponInput('ZAYN20')}
                    className="underline text-rose-600 font-bold"
                  >
                    ZAYN20
                  </button>
                  <span>or</span>
                  <button
                    type="button"
                    onClick={() => setCouponInput('FREESHIP')}
                    className="underline text-rose-600 font-bold"
                  >
                    FREESHIP
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Financial Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Nationwide Delivery</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase text-xs">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">{formatPrice(deliveryCharge)}</span>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-base sm:text-lg font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl sm:text-2xl text-rose-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Encrypted 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
