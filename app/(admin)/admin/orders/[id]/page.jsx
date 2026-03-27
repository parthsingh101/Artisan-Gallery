"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  HiOutlineChevronLeft,
  HiOutlineTruck,
  HiOutlineCheck,
  HiOutlineInformationCircle,
} from "react-icons/hi";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

const statusColor = (s) => {
  switch (s) {
    case "Processing": return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    case "Shipped": return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
    case "Delivered": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "Cancelled": return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    case "Paid": return "text-emerald-500";
    case "Failed": return "text-red-500";
    default: return "bg-charcoal-100 text-charcoal-600 dark:bg-charcoal-700 dark:text-charcoal-300";
  }
};

export default function AdminOrderDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setSelectedOrderStatus(data.order.orderStatus);
        setSelectedPaymentStatus(data.order.paymentStatus);
      } else {
        toast.error("Order not found.");
        router.push("/admin/orders");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: selectedOrderStatus,
          paymentStatus: selectedPaymentStatus,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrder((prev) => ({
          ...prev,
          orderStatus: data.orderStatus,
          paymentStatus: data.paymentStatus,
        }));
        toast.success("Fulfillment status updated successfully.");
      } else {
        const err = await res.json();
        toast.error(err.error || "Update failed.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="p-6 md:p-10">
      {/* Navigation */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-charcoal-500 hover:text-gold-600 transition-colors mb-8"
      >
        <HiOutlineChevronLeft className="w-4 h-4" /> Back to Orders Ledger
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink dark:text-cream-50">
            Fulfillment Console
          </h1>
          <p className="font-mono text-xs text-charcoal-400 mt-1 uppercase tracking-widest">{order._id}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase ${statusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
          <span className={`text-[10px] font-extrabold uppercase tracking-widest ${statusColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Items + Shipping */}
        <div className="xl:col-span-2 space-y-6">
          {/* Items table */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-charcoal-100 dark:border-charcoal-700 p-6 shadow-sm">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-4">Acquisition Inventory</h2>
            <div className="space-y-5">
              {order.items.map((item) => (
                <div key={item.cartItemId || item.productId} className="flex gap-5 border-b border-charcoal-50 dark:border-charcoal-700 pb-5 last:border-0 last:pb-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-charcoal-50 dark:bg-charcoal-900">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-sm">
                    <p className="text-[10px] font-extrabold text-gold-600 uppercase tracking-widest">{item.artistName}</p>
                    <p className="font-bold text-ink dark:text-cream-50">{item.title}</p>
                    {item.variant && (
                      <p className="text-xs text-charcoal-400 mt-1">
                        {[item.variant.size, item.variant.frame, item.variant.material].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-charcoal-500">Qty: <strong>{item.quantity}</strong></span>
                      <span className="font-bold text-ink dark:text-cream-50">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-charcoal-100 dark:border-charcoal-700 p-6 shadow-sm">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-4 flex items-center gap-2">
              <HiOutlineTruck className="w-4 h-4" /> Transit Destination
            </h2>
            <div className="text-sm leading-relaxed text-charcoal-600 dark:text-charcoal-300">
              <strong className="block text-ink dark:text-cream-50 mb-1">{order.shippingAddress.fullName}</strong>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p className="mb-2">{order.shippingAddress.country}</p>
              <p className="text-xs text-charcoal-500">📞 {order.shippingAddress.phone}</p>
              <p className="text-xs text-charcoal-500">✉️ {order.shippingAddress.email}</p>
            </div>
          </div>
        </div>

        {/* Right: Financials + Status Controls */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-charcoal-100 dark:border-charcoal-700 p-6 shadow-sm text-sm">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-4">Financial Ledger</h2>
            <div className="space-y-2 text-charcoal-600 dark:text-charcoal-300">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">₹{order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-bold">₹{order.shippingPrice.toLocaleString()}</span></div>
              <div className="flex justify-between pb-3 border-b border-charcoal-100 dark:border-charcoal-700"><span>Tax</span><span className="font-bold">₹{order.taxPrice.toLocaleString()}</span></div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-ink dark:text-cream-50">Total</span>
                <span className="text-2xl font-bold text-ink dark:text-cream-50">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-charcoal-100 dark:border-charcoal-700 flex items-center gap-2 text-xs text-charcoal-400">
              <HiOutlineInformationCircle className="w-4 h-4 shrink-0" />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* Fulfillment Controls */}
          <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-charcoal-100 dark:border-charcoal-700 p-6 shadow-sm">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-4">Update Fulfillment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-500 uppercase tracking-widest mb-2">Order Status</label>
                <select
                  value={selectedOrderStatus}
                  onChange={(e) => setSelectedOrderStatus(e.target.value)}
                  className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 outline-none"
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal-500 uppercase tracking-widest mb-2">Payment Status</label>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 outline-none"
                >
                  {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-gold-600 hover:bg-gold-700 text-white font-bold py-3 rounded-xl transition-all text-sm uppercase tracking-widest shadow-md shadow-gold-600/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><HiOutlineCheck className="w-4 h-4" /> Save Fulfillment</>
                )}
              </button>
            </div>
          </div>

          {/* Collector Info */}
          {order.userId && (
            <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-charcoal-100 dark:border-charcoal-700 p-6 shadow-sm text-sm">
              <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-3">Collector Identity</h2>
              <p className="font-bold text-ink dark:text-cream-50">{order.userId.name || "—"}</p>
              <p className="text-charcoal-500 text-xs">{order.userId.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
