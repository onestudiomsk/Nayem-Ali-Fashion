import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    navigateTo,
    formatPrice,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    navigateTo('checkout');
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigateTo('cart');
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      onClick={closeCartDrawer}
    >
      <div
        id="cart-drawer-panel"
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h3 className="font-heading font-extrabold text-lg text-slate-900">
              Shopping Cart ({cartCount})
            </h3>
          </div>
          <button
            id="cart-drawer-close-btn"
            onClick={closeCartDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover trending fashion, designer wear, and beauty essentials at Zayn.Fashion.
                </p>
              </div>
              <button
                onClick={() => {
                  closeCartDrawer();
                  navigateTo('shop');
                }}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 flex gap-3.5 items-center first:pt-0 last:pb-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Quantity modifier */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="font-extrabold text-lg text-slate-900">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Taxes and shipping calculated during checkout
            </p>

            <div className="space-y-2 pt-1">
              <button
                id="drawer-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="drawer-view-cart-btn"
                onClick={handleViewCart}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-2xl text-xs border border-slate-200 transition-colors"
              >
                View Detailed Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
