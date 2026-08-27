import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { Address } from '../../types';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  getDistrictsByDivision,
  findDistrictByName,
  findDivisionByDistrict,
} from '../../data/bangladeshGeoData';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  Plus,
  Trash2,
  Truck,
  ArrowRight,
  ShieldCheck,
  LogIn,
  ShoppingBag,
  Sparkles,
  Search,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    addUserAddress,
    deleteUserAddress,
    orders,
    wishlist,
    navigateTo,
    formatPrice,
    addToast,
    isAdmin,
    openAuthModal,
    logout,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>('orders');

  // Address edit modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Home');
  const [newAddrReceiver, setNewAddrReceiver] = useState(currentUser?.name || '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.phone || '');
  const [newAddrDivision, setNewAddrDivision] = useState('dhaka');
  const [newAddrDistrict, setNewAddrDistrict] = useState('Dhaka');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('');
  const [newAddrPostalCode, setNewAddrPostalCode] = useState('1213');

  // Available districts for the selected division in modal
  const newAddrDistricts = getDistrictsByDivision(newAddrDivision);
  const currentNewAddrDistObj = findDistrictByName(newAddrDistrict);

  const handleModalDivisionChange = (divId: string) => {
    setNewAddrDivision(divId);
    const dists = getDistrictsByDivision(divId);
    if (dists.length > 0) {
      setNewAddrDistrict(dists[0].name);
      if (dists[0].postalCode) {
        setNewAddrPostalCode(dists[0].postalCode);
      }
      if (dists[0].popularAreas && dists[0].popularAreas.length > 0) {
        setNewAddrArea(dists[0].popularAreas[0]);
      }
    }
  };

  const handleModalDistrictChange = (distName: string) => {
    setNewAddrDistrict(distName);
    const dObj = findDistrictByName(distName);
    if (dObj) {
      if (dObj.postalCode) {
        setNewAddrPostalCode(dObj.postalCode);
      }
      if (dObj.popularAreas && dObj.popularAreas.length > 0) {
        setNewAddrArea(dObj.popularAreas[0]);
      }
    }
  };

  // Profile form state
  const [profName, setProfName] = useState(currentUser?.name || '');
  const [profPhone, setProfPhone] = useState(currentUser?.phone || '');
  const [profEmail, setProfEmail] = useState(currentUser?.email || '');

  // Keep form in sync when currentUser updates
  React.useEffect(() => {
    if (currentUser) {
      setProfName(currentUser.name || '');
      setProfPhone(currentUser.phone || '');
      setProfEmail(currentUser.email || '');
      setNewAddrReceiver(currentUser.name || '');
      setNewAddrPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Guest order tracking input
  const [trackOrderNumber, setTrackOrderNumber] = useState('');

  // If user is not logged in, show Guest Account & Sign-in portal
  if (!currentUser) {
    return (
      <div id="guest-account-view" className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-[#1A1C23] rounded-3xl p-8 sm:p-10 text-white shadow-xl text-center relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-4 relative z-10">
            <div className="w-16 h-16 bg-[#E67E22] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#E67E22]/30">
              <User className="w-8 h-8" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome to Zayn.Fashion
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sign in with your Google account to view your order history, manage saved addresses, track shipments, and access personalized features.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="guest-signin-btn"
                onClick={openAuthModal}
                className="w-full sm:w-auto px-6 py-3 bg-[#E67E22] hover:bg-[#D35400] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
              <button
                id="guest-browse-shop-btn"
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Order Tracking & Wishlist Options for Guests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Track Guest Order */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 text-[#E67E22] rounded-2xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Track An Order</h3>
                <p className="text-xs text-slate-500">Check live parcel status by order number</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (trackOrderNumber.trim()) {
                  navigateTo('order-tracking', { orderId: trackOrderNumber.trim() });
                } else {
                  navigateTo('order-tracking');
                }
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={trackOrderNumber}
                onChange={(e) => setTrackOrderNumber(e.target.value)}
                placeholder="e.g. EBN-892341"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#E67E22]"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Shipment Now</span>
              </button>
            </form>
          </div>

          {/* Saved Wishlist Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Saved Wishlist ({wishlist.length})
                  </h3>
                  <p className="text-xs text-slate-500">Items you loved while browsing</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {wishlist.length > 0
                  ? `You have ${wishlist.length} item(s) saved in your active browser session.`
                  : 'Your wishlist is empty. Tap the heart icon on any product to save it.'}
              </p>
            </div>

            <button
              onClick={() => navigateTo('shop')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Top Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Wishlist Items Grid if any exist */}
        {wishlist.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-heading text-lg font-black text-slate-900">Your Saved Items</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {wishlist.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const userAddresses = currentUser.addresses || [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profName || currentUser.name,
      phone: profPhone || currentUser.phone,
      email: profEmail || currentUser.email,
    });
    addToast('Profile updated successfully!', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrArea || !newAddrDistrict) {
      addToast('Please fill out street address, district, and area.', 'error');
      return;
    }

    const divObj = BANGLADESH_DIVISIONS.find((d) => d.id === newAddrDivision);
    const divName = divObj ? divObj.name : newAddrDivision;

    const newAddress: Omit<Address, 'id'> = {
      title: newAddrTitle || 'Home',
      receiverName: newAddrReceiver || currentUser.name,
      phone: newAddrPhone || currentUser.phone,
      streetAddress: newAddrStreet,
      division: divName,
      district: newAddrDistrict,
      city: newAddrDistrict,
      area: newAddrArea,
      postalCode: newAddrPostalCode || (currentNewAddrDistObj?.postalCode || '1200'),
      isDefault: userAddresses.length === 0,
    };

    addUserAddress(newAddress);
    setIsAddingAddress(false);
    setNewAddrStreet('');
    setNewAddrArea('');
    addToast('New delivery address saved!', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    deleteUserAddress(id);
  };

  // User-relevant orders
  const userOrders = orders.filter((o) => {
    if (o.userId && o.userId === currentUser.id) return true;
    if (currentUser.email && (o.userEmail || o.customerProfile?.email) === currentUser.email) return true;
    return true; // fallback to show orders
  });

  return (
    <div id="account-dashboard-page" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
      {/* Header Profile Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {currentUser.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                {currentUser.name || 'Zayn Member'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 uppercase">
                {currentUser.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.email} • {currentUser.phone}
            </p>
          </div>
        </div>

        {/* Role & Access Status */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-2.5 rounded-2xl">
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500 text-white flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Admin
              </span>
              <button
                onClick={() => navigateTo('admin')}
                className="px-4 py-2 rounded-xl text-xs font-black bg-slate-900 hover:bg-black text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Admin Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              logout();
              addToast('You have signed out.', 'info');
            }}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Account Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Nav Tabs */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span className="text-[11px] opacity-90">{userOrders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </div>
            <span className="text-[11px] opacity-90">{wishlist.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
            <span className="text-[11px] opacity-90">{userAddresses.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </div>
          </button>
        </div>

        {/* Right Active Tab Content */}
        <div className="lg:col-span-9">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="font-heading text-lg font-black text-slate-900">
                    Order History ({userOrders.length})
                  </h2>
                </div>

                {userOrders.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-3">
                    <Package className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-xs">You haven&apos;t placed any orders yet.</p>
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-sm text-slate-900">{ord.orderNumber}</span>
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-rose-100 text-rose-800">
                                {ord.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Placed on {ord.date} • Total: <strong className="text-slate-900">{formatPrice(ord.total)}</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => navigateTo('order-tracking', { orderId: ord.id })}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Track Shipment</span>
                          </button>
                        </div>

                        {/* Items in order */}
                        <div className="divide-y divide-slate-200/60 pt-2 border-t border-slate-200/60">
                          {ord.items?.map((it) => (
                            <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={it.product?.image || ''}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover bg-white border"
                                />
                                <div>
                                  <p className="font-semibold text-slate-800 line-clamp-1">{it.product?.name}</p>
                                  <p className="text-[10px] text-slate-400">Qty: {it.quantity}</p>
                                </div>
                              </div>
                              <span className="font-bold text-slate-900">{formatPrice((it.product?.price || 0) * it.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="font-heading text-lg font-black text-slate-900 pb-4 border-b border-slate-100">
                My Saved Wishlist ({wishlist.length})
              </h2>

              {wishlist.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="text-xs">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="mt-3 text-xs font-bold text-rose-600 underline"
                  >
                    Explore trending products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {wishlist.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="font-heading text-lg font-black text-slate-900">
                  Saved Delivery Destinations
                </h2>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">New Address Details (নতুন ঠিকানা)</h4>
                    <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      ৮ বিভাগ ও ৬৪ জেলা
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Title (নাম/লেবেল)</label>
                      <input
                        type="text"
                        value={newAddrTitle}
                        onChange={(e) => setNewAddrTitle(e.target.value)}
                        placeholder="Home / Office / Village"
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Receiver Name (প্রাপকের নাম)</label>
                      <input
                        type="text"
                        value={newAddrReceiver}
                        onChange={(e) => setNewAddrReceiver(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone Number (মোবাইল নম্বর)</label>
                      <input
                        type="text"
                        value={newAddrPhone}
                        onChange={(e) => setNewAddrPhone(e.target.value)}
                        placeholder="01712-345678"
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                      />
                    </div>

                    {/* Division Dropdown */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Division (বিভাগ) *</label>
                      <select
                        value={newAddrDivision}
                        onChange={(e) => handleModalDivisionChange(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-medium"
                      >
                        {BANGLADESH_DIVISIONS.map((div) => (
                          <option key={div.id} value={div.id}>
                            {div.bnName} ({div.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District Dropdown */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">District (জেলা) *</label>
                      <select
                        value={newAddrDistrict}
                        onChange={(e) => handleModalDistrictChange(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-medium"
                      >
                        {newAddrDistricts.map((dist) => (
                          <option key={dist.id} value={dist.name}>
                            {dist.bnName} ({dist.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Postal Code (পোস্ট কোড)</label>
                      <input
                        type="text"
                        value={newAddrPostalCode}
                        onChange={(e) => setNewAddrPostalCode(e.target.value)}
                        placeholder={currentNewAddrDistObj?.postalCode || '1200'}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono"
                      />
                    </div>

                    {/* Area / Thana */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Area / Thana / Upazila (থানা / এলাকা) *</label>
                      <input
                        type="text"
                        value={newAddrArea}
                        onChange={(e) => setNewAddrArea(e.target.value)}
                        placeholder={`e.g. ${currentNewAddrDistObj?.popularAreas?.[0] || 'Sadar, Dhanmondi'}`}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                      />
                      {currentNewAddrDistObj?.popularAreas && currentNewAddrDistObj.popularAreas.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span className="text-[10px] text-slate-400">Suggestions:</span>
                          {currentNewAddrDistObj.popularAreas.slice(0, 5).map((popArea) => (
                            <button
                              key={popArea}
                              type="button"
                              onClick={() => setNewAddrArea(popArea)}
                              className="text-[10px] px-2 py-0.5 bg-slate-200/80 hover:bg-rose-100 hover:text-rose-700 rounded-md text-slate-700 transition-colors"
                            >
                              {popArea}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Street / Village Address */}
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Street Address / House & Road (সম্পূর্ণ ঠিকানা) *</label>
                      <input
                        type="text"
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        placeholder="House, Road, Block, Holding number / গ্রাম ও বাড়ি"
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer shadow-sm"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userAddresses.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                    No saved addresses. Click &quot;Add New Address&quot; above to store your delivery destination.
                  </div>
                ) : (
                  userAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-xs text-rose-600 uppercase tracking-wider">
                            {addr.title}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-sm text-slate-900">{addr.receiverName}</p>
                        <p className="text-xs text-slate-600 mt-1">{addr.streetAddress}</p>
                        <p className="text-xs text-slate-600 font-medium">
                          {addr.area}, {addr.district || addr.city}{addr.division ? `, ${addr.division}` : ''} {addr.postalCode ? ` - ${addr.postalCode}` : ''}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 font-mono">{addr.phone}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 mt-4 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="font-heading text-lg font-black text-slate-900 pb-4 border-b border-slate-100">
                Personal Profile Details
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    placeholder={currentUser.name}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    placeholder={currentUser.phone}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    placeholder={currentUser.email}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

