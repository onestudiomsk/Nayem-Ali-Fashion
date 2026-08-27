import React, { useState } from 'react';
import { Order, OrderStatus, Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  Printer,
  Copy,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  BadgeCheck,
  Trash2,
} from 'lucide-react';

interface AdminOrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: Order) => void;
}

export const AdminOrderDetailsModal: React.FC<AdminOrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onSelectOrder,
}) => {
  const { orders, updateOrderStatus, deleteOrder, formatPrice, addToast } = useStore();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  // Find all orders associated with this customer (by userId, email, or phone number)
  const cleanPhone = (order.shippingAddress?.phone || '').replace(/[^0-9]/g, '');
  const orderEmail = (order.userEmail || order.customerProfile?.email || '').toLowerCase().trim();

  const customerRelatedOrders = (orders || []).filter((o) => {
    if (!o) return false;
    if (o.userId && order.userId && o.userId === order.userId) return true;
    if (orderEmail && (o.userEmail || o.customerProfile?.email || '').toLowerCase().trim() === orderEmail) return true;
    const oPhone = (o.shippingAddress?.phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone && oPhone && (cleanPhone === oPhone || cleanPhone.endsWith(oPhone) || oPhone.endsWith(cleanPhone))) {
      return true;
    }
    return false;
  });

  const otherOrders = (customerRelatedOrders || []).filter((o) => o && o.id !== order.id);
  const totalCustomerSpend = (customerRelatedOrders || []).reduce((sum, o) => sum + (o?.total || 0), 0);
  const totalCustomerOrdersCount = (customerRelatedOrders || []).length;
  const isRepeatCustomer = totalCustomerOrdersCount > 1;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    addToast(`${label} ক্লিপবোর্ডে কপি করা হয়েছে!`, 'info');
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Delivered (সম্পন্ন)',
        };
      case 'shipped':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Shipped (কুরিয়ারে প্রেরিত)',
        };
      case 'processing':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Processing (প্যাকিং চলছে)',
        };
      case 'confirmed':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Confirmed (নিশ্চিতকৃত)',
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Cancelled (বাতিলকৃত)',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-500',
          label: 'Placed (নতুন অর্ডার)',
        };
    }
  };

  const badge = getStatusBadge(order.status);
  const rawPhoneDigits = (order.shippingAddress?.phone || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawPhoneDigits.startsWith('880') ? rawPhoneDigits : '88' + (rawPhoneDigits.startsWith('0') ? rawPhoneDigits : '0' + rawPhoneDigits)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white">
      <div
        id="admin-order-details-modal"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 print:shadow-none print:border-none print:max-h-full print:w-full"
      >
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-600/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-heading font-black text-xl sm:text-2xl tracking-tight text-white">
                  {order.orderNumber}
                </h2>
                <button
                  type="button"
                  onClick={() => copyToClipboard(order.orderNumber, 'Order Number')}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                  title="Copy Order Number"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedText === 'Order Number' ? 'Copied!' : 'Copy'}</span>
                </button>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${badge.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
                  {badge.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {order.date}
                </span>
                <span>•</span>
                <span>ID: {order.id}</span>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Quick Status Updater */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1">
              <span className="text-[10px] font-semibold text-slate-400">Status:</span>
              <select
                value={order.status}
                onChange={(e) => {
                  updateOrderStatus(order.id, e.target.value as OrderStatus);
                  addToast(`Order ${order.orderNumber} status updated to ${e.target.value}`, 'success');
                }}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="placed" className="bg-slate-900 text-white">Placed</option>
                <option value="confirmed" className="bg-slate-900 text-white">Confirmed</option>
                <option value="processing" className="bg-slate-900 text-white">Processing</option>
                <option value="shipped" className="bg-slate-900 text-white">Shipped</option>
                <option value="out_for_delivery" className="bg-slate-900 text-white">Out for Delivery</option>
                <option value="delivered" className="bg-slate-900 text-white">Delivered</option>
                <option value="cancelled" className="bg-slate-900 text-white">Cancelled</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
              title="Print Invoice / Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* SECTION 1: CUSTOMER PROFILE & INTELLIGENCE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* 1A: Customer Profile Card (কোন প্রোফাইল থেকে) */}
            <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <User className="w-4 h-4 text-rose-600" />
                  <span>Customer Profile / প্রোফাইল তথ্য</span>
                </div>
                {order.customerProfile || order.userId ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <BadgeCheck className="w-3 h-3 text-emerald-600" />
                    <span>Registered Account</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                    Guest Checkout
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3.5">
                {order.customerProfile?.avatar ? (
                  <img
                    src={order.customerProfile.avatar}
                    alt={order.customerProfile.name || order.shippingAddress?.receiverName || 'Avatar'}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                    {(order.customerProfile?.name || order.shippingAddress?.receiverName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1 flex-1">
                  <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{order.customerProfile?.name || order.shippingAddress?.receiverName || 'Customer'}</span>
                    {order.customerProfile?.role === 'admin' && (
                      <span className="text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded">ADMIN</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{order.userEmail || order.customerProfile?.email || 'No email provided'}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span className="font-semibold text-slate-800">{order.shippingAddress?.phone || 'No phone'}</span>
                  </p>
                  {order.customerProfile?.joinedDate && (
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>Member since {order.customerProfile.joinedDate}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Direct Quick Contact Bar */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
                <a
                  href={`tel:${order.shippingAddress?.phone || ''}`}
                  className="flex-1 min-w-[100px] py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>Call Phone</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[100px] py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
                {order.userEmail && (
                  <a
                    href={`mailto:${order.userEmail}`}
                    className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* 1B: Delivery Address & Location Card (ঠিকানা কি দিয়েছে) */}
            <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Delivery Address / প্রাপকের ঠিকানা</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullAddr = `${order.shippingAddress?.receiverName || ''}, ${order.shippingAddress?.phone || ''}, ${order.shippingAddress?.streetAddress || ''}, ${order.shippingAddress?.area || ''}, ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.postalCode || ''}`;
                    copyToClipboard(fullAddr, 'Full Address');
                  }}
                  className="text-[10px] font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedText === 'Full Address' ? 'Address Copied!' : 'Copy Address'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recipient Name:</span>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{order.shippingAddress?.receiverName || 'Not specified'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Street Address:</span>
                  <p className="text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                    {order.shippingAddress?.streetAddress || 'Not specified'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Area / Thana</span>
                    <span className="font-bold text-slate-800">{order.shippingAddress?.area || 'N/A'}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">District & Division</span>
                    <span className="font-bold text-slate-800">
                      {order.shippingAddress?.district || order.shippingAddress?.city || 'Dhaka'}
                      {order.shippingAddress?.division ? ` (${order.shippingAddress.division})` : ''}
                      {order.shippingAddress?.postalCode ? ` - ${order.shippingAddress.postalCode}` : ''}
                    </span>
                  </div>
                </div>

                {order.deliveryNotes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-amber-900 text-[11px]">
                    <div className="flex items-center gap-1 font-bold mb-0.5 text-amber-800">
                      <AlertCircle className="w-3 h-3" />
                      <span>Customer Special Instructions:</span>
                    </div>
                    <p className="italic">{order.deliveryNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: CUSTOMER ORDER HISTORY (এই একাউন্ট বা প্রোফাইল থেকে আরো কোন অর্ডার হয়েছে কিনা) */}
          <div className="bg-rose-50/50 border-2 border-rose-200/80 rounded-2xl p-4.5 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-600 text-white rounded-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="font-heading font-black text-slate-900 text-sm">
                    Customer Account Order History (এই প্রোফাইল/ফোন থেকে অর্ডার হিস্ট্রি)
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Cross-referenced by Account ID, Email ({order.userEmail || 'N/A'}) & Phone ({order.shippingAddress?.phone || 'N/A'})
                  </p>
                </div>
              </div>

              {/* Customer Stats Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-xl bg-white text-slate-900 font-bold border border-rose-200 text-xs shadow-2xs">
                  Total Orders: <span className="text-rose-600 font-extrabold">{totalCustomerOrdersCount}</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-white text-slate-900 font-bold border border-rose-200 text-xs shadow-2xs">
                  Lifetime Value: <span className="text-emerald-600 font-black">{formatPrice(totalCustomerSpend)}</span>
                </span>
              </div>
            </div>

            {/* Past orders list or First order status */}
            {isRepeatCustomer ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>👑 এই প্রোফাইল / ফোন নম্বর থেকে মোট {totalCustomerOrdersCount}টি অর্ডার সম্পন্ন/চলমান রয়েছে:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Click to switch & inspect</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {customerRelatedOrders.map((relatedOrd) => {
                    const isCurrent = relatedOrd.id === order.id;
                    const relatedBadge = getStatusBadge(relatedOrd.status);
                    return (
                      <div
                        key={relatedOrd.id}
                        onClick={() => {
                          if (!isCurrent) {
                            onSelectOrder(relatedOrd);
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isCurrent
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs">{relatedOrd.orderNumber}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-black uppercase bg-white/20 px-1.5 py-0.2 rounded">
                                Active View
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] ${isCurrent ? 'text-white/80' : 'text-slate-500'}`}>
                            {relatedOrd.date} • {(relatedOrd.items || []).length} item(s)
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="font-black text-xs">
                            {formatPrice(relatedOrd.total)}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isCurrent ? 'bg-white text-rose-800' : relatedBadge.bg
                            }`}
                          >
                            {relatedOrd.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white p-3.5 rounded-xl border border-rose-200/80 flex items-center gap-2.5 text-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-xs text-slate-900">
                    🌱 New First-Time Customer (নতুন গ্রাহক)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    এটি এই একাউন্ট/ফোন নম্বর থেকে প্রথম অর্ডার। পূর্ববর্তী কোনো অর্ডার রেকর্ড পাওয়া যায়নি।
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: ORDERED ITEMS & VARIANTS BREAKDOWN */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Package className="w-4 h-4 text-rose-600" />
                <span>Ordered Items & Variants / অর্ডারের পণ্যসমূহ ({(order.items || []).length})</span>
              </div>
              <span className="text-[10px] text-slate-500">Itemized SKU specifications</span>
            </div>

            <div className="divide-y divide-slate-200/80">
              {(order.items || []).map((item, idx) => {
                if (!item) return null;
                const prod: Partial<Product> = item.product || {
                  id: 'unknown',
                  name: 'Product Item',
                  price: 0,
                  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
                  category: 'daily-products',
                  categoryName: 'General',
                };
                return (
                  <div key={item.id || idx} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3.5">
                    <div className="flex items-start gap-3">
                      <img
                        src={prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'}
                        alt={prod.name || 'Product'}
                        className="w-14 h-14 rounded-xl object-contain bg-white border border-slate-200 p-1 shrink-0"
                      />
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                          {prod.name}
                        </h5>
                        
                        {/* Product Category & Subcategory */}
                        <p className="text-[10px] text-slate-500">
                          {prod.categoryName || 'General'} {prod.subcategory ? `› ${prod.subcategory}` : ''}
                        </p>

                        {/* Variant Attributes (Size, Color, Unit) */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {item.selectedSize && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-[10px] font-bold text-slate-800">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-[10px] font-bold text-slate-800">
                              <span className="w-2 h-2 rounded-full border border-slate-400" />
                              Color: {item.selectedColor}
                            </span>
                          )}
                          {prod.unit && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-200/80 text-[10px] font-semibold text-slate-700">
                              Unit: {prod.unit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {formatPrice((prod.price || 0) * (item.quantity || 1))}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatPrice(prod.price || 0)} × {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: PAYMENT & FINANCIAL SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Payment Method & Verification */}
            <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CreditCard className="w-4 h-4 text-rose-600" />
                  <span>Payment Information</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-extrabold uppercase text-slate-900">{order.paymentMethod}</span>
                </div>

                {order.paymentDetails?.transactionId && (
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">TrxID:</span>
                    <span className="font-mono font-bold text-rose-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {order.paymentDetails.transactionId}
                    </span>
                  </div>
                )}

                {order.paymentDetails?.accountNumber && (
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Account No:</span>
                    <span className="font-mono font-bold text-slate-800">{order.paymentDetails.accountNumber}</span>
                  </div>
                )}

                {order.paymentDetails?.cardLast4 && (
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Card ending:</span>
                    <span className="font-mono font-bold text-slate-800">•••• {order.paymentDetails.cardLast4}</span>
                  </div>
                )}

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <span className="font-bold text-slate-800">{order.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200/80 pb-2">
                Order Billing Ledger
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">{formatPrice(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-bold text-slate-800">
                    {order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-black text-slate-900">Total Payable:</span>
                  <span className="font-heading font-black text-rose-600 text-lg">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: LIVE LOGISTICS TIMELINE */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Truck className="w-4 h-4 text-rose-600" />
                <span>Logistics & Tracking Events Timeline</span>
              </div>
              <span className="text-[10px] text-slate-400">Step progression</span>
            </div>

            <div className="space-y-3 pt-1">
              {(order.trackingEvents || []).map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      evt.completed
                        ? 'bg-emerald-600 text-white'
                        : evt.current
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {evt.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs">{evt.title}</span>
                      <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Close Viewer
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`আপনি কি নিশ্চিত যে অর্ডার #${order.orderNumber} এবং এর সমস্ত তথ্য ডাটাবেজ থেকে মুছে ফেলতে চান?`)) {
                  deleteOrder(order.id);
                  onClose();
                }
              }}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Order</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
