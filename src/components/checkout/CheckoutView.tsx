import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Address } from '../../types';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  getDistrictsByDivision,
  findDistrictByName,
  findDivisionByDistrict,
  BDDistrict,
} from '../../data/bangladeshGeoData';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Banknote,
  Smartphone,
  CreditCard,
  Building,
  Info,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    appliedCoupon,
    currentUser,
    createOrder,
    navigateTo,
    formatPrice,
    addToast,
    openAuthModal,
  } = useStore();

  const defaultUserAddr = currentUser?.addresses?.[0];

  // Initial Division & District resolution
  const initialDistName = defaultUserAddr?.district || defaultUserAddr?.city || 'Dhaka';
  const matchedDiv = findDivisionByDistrict(initialDistName);
  const initialDivId = defaultUserAddr?.division || (matchedDiv ? matchedDiv.id : 'dhaka');

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  // Bangladesh Geo fields
  const [selectedDivision, setSelectedDivision] = useState<string>(initialDivId);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistName);
  const [streetAddress, setStreetAddress] = useState(defaultUserAddr?.streetAddress || '');
  const [area, setArea] = useState(defaultUserAddr?.area || 'Banani');
  const [postalCode, setPostalCode] = useState(defaultUserAddr?.postalCode || '1213');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Available districts for the chosen division
  const availableDistricts = getDistrictsByDivision(selectedDivision);

  // When division changes, ensure selected district belongs to the new division
  const handleDivisionChange = (newDivId: string) => {
    setSelectedDivision(newDivId);
    const districtsForNewDiv = getDistrictsByDivision(newDivId);
    if (districtsForNewDiv.length > 0) {
      const isCurrentInNew = districtsForNewDiv.some(
        (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase() || d.id === selectedDistrict.toLowerCase()
      );
      if (!isCurrentInNew) {
        const firstDist = districtsForNewDiv[0];
        setSelectedDistrict(firstDist.name);
        if (firstDist.postalCode) {
          setPostalCode(firstDist.postalCode);
        }
        if (firstDist.popularAreas && firstDist.popularAreas.length > 0) {
          setArea(firstDist.popularAreas[0]);
        }
      }
    }
  };

  // When district changes, update default postal code and suggestion
  const handleDistrictChange = (newDistName: string) => {
    setSelectedDistrict(newDistName);
    const distObj = findDistrictByName(newDistName);
    if (distObj) {
      if (distObj.postalCode) {
        setPostalCode(distObj.postalCode);
      }
      if (distObj.popularAreas && distObj.popularAreas.length > 0) {
        setArea(distObj.popularAreas[0]);
      }
    }
  };

  // Quick preset from saved user addresses
  const handleApplySavedAddress = (savedAddr: Address) => {
    setCustomerName(savedAddr.receiverName || customerName);
    setPhone(savedAddr.phone || phone);
    setStreetAddress(savedAddr.streetAddress);
    setArea(savedAddr.area);
    setPostalCode(savedAddr.postalCode);

    const distName = savedAddr.district || savedAddr.city || 'Dhaka';
    const divObj = findDivisionByDistrict(distName);
    if (divObj) {
      setSelectedDivision(divObj.id);
    }
    setSelectedDistrict(distName);
    addToast(`Applied saved address "${savedAddr.title}"`, 'info');
  };

  // Current active district details for suggestions
  const currentDistrictObj = findDistrictByName(selectedDistrict);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [mobileAccount, setMobileAccount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">No items in your cart</h2>
        <p className="text-xs text-slate-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-rose-600 text-white rounded-xl text-xs font-bold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const isInsideDhaka = selectedDistrict.toLowerCase() === 'dhaka';

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      addToast('Please sign in or create an account to confirm your order.', 'warning', 'Account Required');
      openAuthModal();
      return;
    }

    if (!customerName.trim() || !phone.trim() || !streetAddress.trim() || !selectedDistrict.trim() || !area.trim()) {
      addToast('Please complete all required delivery fields.', 'error');
      return;
    }

    if (phone.length < 10) {
      addToast('Please enter a valid mobile phone number.', 'error');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      addToast('Please enter your Mobile Banking Transaction ID (or use demo TRX12345).', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const divisionObj = BANGLADESH_DIVISIONS.find((d) => d.id === selectedDivision);
      const divisionName = divisionObj ? divisionObj.name : selectedDivision;

      const shippingAddress: Address = {
        id: `addr-${Date.now()}`,
        title: 'Checkout Address',
        receiverName: customerName.trim(),
        phone: phone.trim(),
        streetAddress: streetAddress.trim(),
        division: divisionName,
        district: selectedDistrict.trim(),
        city: selectedDistrict.trim(), // Keep city mapped to district for backwards compatibility
        area: area.trim(),
        postalCode: postalCode.trim() || (currentDistrictObj?.postalCode || '1200'),
        isDefault: true,
      };

      const newOrder = createOrder({
        items: [...cart],
        subtotal: cartSubtotal,
        deliveryCharge,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        total: cartTotal,
        status: 'placed',
        shippingAddress,
        paymentMethod,
        paymentDetails: {
          accountNumber: mobileAccount,
          transactionId: transactionId || (paymentMethod === 'card' ? 'CARD_AUTH_OK' : undefined),
          cardLast4: cardNumber ? cardNumber.slice(-4) : undefined,
        },
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        deliveryNotes: deliveryNotes.trim() || undefined,
        estimatedDelivery: isInsideDhaka ? 'Tomorrow, 2:00 PM - 6:00 PM (Inside Dhaka)' : 'Within 2-4 Business Days (Nationwide)',
        userId: currentUser?.id,
        userEmail: currentUser?.email || email.trim() || undefined,
        customerProfile: currentUser ? {
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          avatar: currentUser.avatar,
          role: currentUser.role,
          joinedDate: currentUser.joinedDate,
        } : (email.trim() ? {
          name: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: 'customer',
        } : undefined),
      });

      setIsSubmitting(false);
      navigateTo('order-tracking', { orderId: newOrder.id });
    }, 800);
  };

  return (
    <div id="checkout-page" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => navigateTo('cart')}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Delivery
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Secure 256-Bit SSL Checkout</span>
          <span className="sm:hidden">Secure</span>
        </div>
      </div>

      {/* Guest Account Requirement Alert */}
      {!currentUser && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-slate-900">
                Account Required for Placing Orders
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                You are currently browsing as a guest. Please sign in or register to confirm your order and track live shipment.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAuthModal}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Sign In / Register</span>
          </button>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-heading text-base font-extrabold text-slate-900">
                  Customer & Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sumaiya Chowdhury"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712-345678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(for invoice & updates)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Full Delivery Address with Bangladesh Geo Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-heading text-base font-extrabold text-slate-900">
                    Delivery Destination / ডেলিভারির ঠিকানা
                  </h3>
                </div>
                
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>৬৪ জেলায় দ্রুত ডেলিভারি</span>
                </div>
              </div>

              {/* Saved Addresses quick switcher */}
              {currentUser?.addresses && currentUser.addresses.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    Use a Saved Address:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.addresses.map((saved) => (
                      <button
                        key={saved.id}
                        type="button"
                        onClick={() => handleApplySavedAddress(saved)}
                        className="text-xs px-3 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-slate-700 font-medium transition-colors text-left flex items-center gap-1.5"
                      >
                        <span className="font-bold text-rose-600">{saved.title}:</span>
                        <span className="truncate max-w-[200px]">{saved.area}, {saved.district || saved.city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Division Selector (বিভাগ) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Division / বিভাগ <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={selectedDivision}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white font-medium"
                  >
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.bnName} ({div.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Selector (জেলা - All 64 Districts) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District / জেলা <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white font-medium"
                  >
                    {availableDistricts.map((dist) => (
                      <option key={dist.id} value={dist.name}>
                        {dist.bnName} ({dist.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Thana / Upazila / Area (থানা / উপজেলা / এলাকা) */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thana / Upazila / Area (থানা / উপজেলা / এলাকা) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="popular-areas-list"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder={`e.g. ${currentDistrictObj?.popularAreas?.[0] || 'Sadar, Main Town'}`}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                  <datalist id="popular-areas-list">
                    {currentDistrictObj?.popularAreas?.map((popArea) => (
                      <option key={popArea} value={popArea} />
                    ))}
                  </datalist>

                  {/* Quick Clickable Area Suggestions for Selected District */}
                  {currentDistrictObj?.popularAreas && currentDistrictObj.popularAreas.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">Quick suggestions:</span>
                      {currentDistrictObj.popularAreas.slice(0, 6).map((popArea) => (
                        <button
                          key={popArea}
                          type="button"
                          onClick={() => setArea(popArea)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                            area.toLowerCase() === popArea.toLowerCase()
                              ? 'bg-rose-600 text-white border-rose-600 font-bold'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          }`}
                        >
                          {popArea}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Street Address / Detailed Location */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address, House, Road & Village (সম্পূর্ণ ঠিকানা) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. House 42, Road 11, Block D / গ্রাম, পোস্ট অফিস ও বাড়ি নম্বর"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal / Zip Code (পোস্ট কোড)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder={currentDistrictObj?.postalCode || '1200'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white font-mono"
                  />
                </div>

                {/* Delivery Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Instructions (ঐচ্ছিক নির্দেশনা)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. কল করে আসবেন, অফিসের সময়ে ডেলিভারি"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Dynamic Delivery Timeframe Banner */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    {isInsideDhaka ? 'ঢাকা সিটির ভেতরে হোম ডেলিভারি' : `${selectedDistrict} জেলায় ডোরস্টেপ ডেলিভারি`}
                  </span>
                  <span className="text-slate-500">
                    {isInsideDhaka
                      ? 'আনুমানিক সময়: আগামীকাল দুপুর ২:০০ - সন্ধ্যা ৬:০০ (২৪-৪৮ ঘণ্টার মধ্যে)'
                      : 'আনুমানিক সময়: ২-৪ কার্যদিবসের মধ্যে আপনার দোরগোড়ায়'}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Options */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h3 className="font-heading text-base font-extrabold text-slate-900">
                  Payment Method
                </h3>
              </div>

              {/* Payment Methods Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* COD */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-6 h-6 text-emerald-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                      Cash on Delivery
                    </span>
                    <span className="text-[11px] text-slate-500">Pay at doorstep</span>
                  </div>
                </label>

                {/* Mobile Banking bKash/Nagad */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    paymentMethod === 'bkash' || paymentMethod === 'nagad'
                      ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-6 h-6 text-rose-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={paymentMethod === 'bkash' || paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                      bKash / Nagad
                    </span>
                    <span className="text-[11px] text-slate-500">Instant Mobile Pay</span>
                  </div>
                </label>

                {/* Online Debit/Credit Card */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    paymentMethod === 'card'
                      ? 'border-rose-600 bg-rose-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                      Debit / Credit Card
                    </span>
                    <span className="text-[11px] text-slate-500">Visa, Master, AMEX</span>
                  </div>
                </label>
              </div>

              {/* bKash / Nagad payment instructions */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === 'bkash'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white text-slate-700 border'
                      }`}
                    >
                      bKash Merchant: 01712-328634
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === 'nagad'
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-slate-700 border'
                      }`}
                    >
                      Nagad Merchant: 01712-328634
                    </button>
                  </div>

                  <p className="text-xs text-slate-600">
                    Send Payment of <strong>{formatPrice(cartTotal)}</strong> using &ldquo;Make Payment&rdquo; option. Then enter your Transaction ID below:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={mobileAccount}
                      onChange={(e) => setMobileAccount(e.target.value)}
                      placeholder="Your bKash / Nagad Number"
                      className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      placeholder="Transaction ID (e.g. TRX99214)"
                      className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4123 •••• •••• 8912"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Expiration</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4 sticky top-28">
              <h3 className="font-heading text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
                Order Review ({cart.length} Items)
              </h3>

              {/* Items Miniature List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate max-w-[170px]">{item.product.name}</p>
                        <p className="text-[11px] text-slate-400">
                          Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  {deliveryCharge === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">{formatPrice(deliveryCharge)}</span>
                  )}
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-base font-black text-slate-900">
                  <span>Payable Total</span>
                  <span className="text-2xl text-rose-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-extrabold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <span>Confirm & Place Order ({formatPrice(cartTotal)})</span>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
                <p className="flex items-center justify-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>7-Day Return & Replacement Policy applies</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  By clicking Place Order you agree to Zayn.Fashion&apos;s Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
