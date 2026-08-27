import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, navigateTo, cartCount, wishlist, openCartDrawer } = useStore();

  return (
    <nav
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 safe-area-bottom shadow-lg"
    >
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          id="mobile-nav-home-btn"
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'home'
              ? 'text-rose-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Categories / Shop */}
        <button
          id="mobile-nav-shop-btn"
          onClick={() => navigateTo('shop')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'shop' || activeView === 'category'
              ? 'text-rose-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Categories</span>
        </button>

        {/* Wishlist */}
        <button
          id="mobile-nav-wishlist-btn"
          onClick={() => navigateTo('account')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all text-slate-500 hover:text-slate-900`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          id="mobile-nav-cart-btn"
          onClick={openCartDrawer}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'cart'
              ? 'text-rose-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>

        {/* Account */}
        <button
          id="mobile-nav-account-btn"
          onClick={() => navigateTo('account')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'account'
              ? 'text-rose-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Account</span>
        </button>
      </div>
    </nav>
  );
};
