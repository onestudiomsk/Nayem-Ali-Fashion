/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { ToastNotification } from './components/common/ToastNotification';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { QuickViewModal } from './components/product/QuickViewModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { HomeView } from './components/home/HomeView';
import { ShopView } from './components/shop/ShopView';
import { ProductDetailsView } from './components/product/ProductDetailsView';
import { CartView } from './components/cart/CartView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { AccountView } from './components/account/AccountView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';

const MainAppContent: React.FC = () => {
  const { activeView } = useStore();

  // Scroll to top whenever active view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div id="zayn-fashion-app-root" className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#2D3436] selection:bg-[#E67E22] selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar />

      {/* Main Page Body View Switcher wrapped in ErrorBoundary */}
      <main className="flex-1">
        <ErrorBoundary fallbackTitle="Page View Error">
          {activeView === 'home' && <HomeView />}
          {activeView === 'shop' && <ShopView />}
          {activeView === 'product-details' && <ProductDetailsView />}
          {activeView === 'cart' && <CartView />}
          {activeView === 'checkout' && <CheckoutView />}
          {activeView === 'order-tracking' && <OrderTrackingView />}
          {activeView === 'account' && <AccountView />}
          {activeView === 'admin' && <AdminDashboardView />}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Bottom Bar */}
      <MobileBottomNav />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Auth Modal Dialog */}
      <AuthModal />

      {/* Quick View Modal Dialog */}
      <QuickViewModal />

      {/* PWA Offline Indicator and App Installation Banner */}
      <PwaInstallPrompt />

      {/* Toast Notification Container */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="Application Startup Error">
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
