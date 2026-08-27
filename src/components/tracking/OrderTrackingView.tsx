import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  Truck,
  Check,
  Download,
  AlertCircle,
  Calendar,
  Search,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, selectedOrderId, formatPrice, addToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Find targeted order
  const activeOrder =
    (searchQuery
      ? orders.find(
          (o) =>
            o.id.toLowerCase() === searchQuery.toLowerCase() ||
            o.orderNumber.toLowerCase() === searchQuery.toLowerCase() ||
            o.shippingAddress.phone.includes(searchQuery)
        )
      : null) ||
    (selectedOrderId ? orders.find((o) => o.id === selectedOrderId) : null) ||
    orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        o.orderNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
        o.shippingAddress.phone.includes(searchQuery.trim())
    );
    if (!found) {
      addToast('No order found with this tracking or order number.', 'error');
    }
  };

  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Received & logged into Zayn.Fashion system' },
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Verified and inventory reserved' },
    { key: 'processing', label: 'Packed & Quality Checked', desc: 'Securely bubble-wrapped and sealed' },
    { key: 'shipped', label: 'Shipped / In Transit', desc: 'With courier partner in transit' },
    { key: 'delivered', label: 'Delivered', desc: 'Package handed to recipient' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 1;

  const handleDownloadInvoice = () => {
    if (!activeOrder) return;
    addToast(`Invoice for ${activeOrder.orderNumber} generated and printed.`, 'info');
    window.print();
  };

  return (
    <div id="order-tracking-page" className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Quick Lookup Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Live Fulfillment Tracking
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Track Your Shipment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Enter your Order ID (e.g. {orders[0]?.orderNumber || 'EBN-89241'}) or recipient phone number
          </p>
        </div>

        {/* Lookup form */}
        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. EBN-89241 or 017..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {!activeOrder ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Order Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please verify the order number or search with the phone number entered during checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Order Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-xl font-extrabold text-slate-900">
                    Order {activeOrder.orderNumber}
                  </h2>
                  <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200 uppercase">
                    {activeOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Placed on {activeOrder.date} • Payment: <strong className="uppercase text-slate-700">{activeOrder.paymentMethod}</strong> ({activeOrder.paymentStatus})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadInvoice}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="py-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">
                Delivery Timeline Progress
              </h3>

              {/* Progress Stepper Desktop */}
              <div className="relative">
                <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-slate-100 -translate-y-1/2 z-0">
                  <div
                    className="h-full bg-rose-600 transition-all duration-700"
                    style={{
                      width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative z-10">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm shrink-0 ${
                            isCompleted
                              ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-rose-600'
                                : isCompleted
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Courier Tracking Details Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <span className="text-slate-400 font-semibold block mb-1">Assigned Courier</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-rose-600" />
                  Pathao Express Logistics
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Tracking #: <strong>BD-{activeOrder.orderNumber}</strong>
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl">
                <span className="text-slate-400 font-semibold block mb-1">Estimated Delivery</span>
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  {activeOrder.estimatedDelivery || 'Tomorrow, 2:00 PM - 6:00 PM'}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                  On-Time Delivery Guarantee
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl">
                <span className="text-slate-400 font-semibold block mb-1">Delivery Destination</span>
                <span className="font-bold text-slate-900 truncate block">
                  {activeOrder.shippingAddress.receiverName} ({activeOrder.shippingAddress.phone})
                </span>
                <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                  {activeOrder.shippingAddress.streetAddress}, {activeOrder.shippingAddress.area}, {activeOrder.shippingAddress.district || activeOrder.shippingAddress.city}{activeOrder.shippingAddress.division ? `, ${activeOrder.shippingAddress.division}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Items in this Package */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-rose-600" />
              <span>Package Items ({(activeOrder.items || []).length})</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {(activeOrder.items || []).map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'}
                      alt={item.product?.name || 'Product'}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {item.product?.name || 'Product Item'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Qty: {item.quantity || 1} • SKU: {item.product?.id || 'N/A'}
                        {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                        {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600">Total Charged</span>
              <span className="font-heading text-lg font-black text-rose-600">
                {formatPrice(activeOrder.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
