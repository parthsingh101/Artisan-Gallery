"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineChevronLeft, HiOutlinePrinter, HiOutlineInformationCircle } from "react-icons/hi";
import ErrorState from "@/components/ui/ErrorState";

export default function OrderDetailsPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && id) {
      fetchOrderDetails();
    }
  }, [status, router, id]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        setError("Order not found or access denied.");
      }
    } catch (err) {
      setError("Failed to load order details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pt-24 md:pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="shimmer h-6 w-32 rounded mb-8" />
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 md:p-12 border border-charcoal-100 dark:border-charcoal-700">
            <div className="shimmer h-10 w-72 rounded mb-3" />
            <div className="shimmer h-4 w-48 rounded mb-10" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-6 pb-6 border-b border-charcoal-50 dark:border-charcoal-700">
                    <div className="shimmer w-28 h-28 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="shimmer h-3 w-1/4 rounded" />
                      <div className="shimmer h-5 w-3/4 rounded" />
                      <div className="shimmer h-4 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="shimmer h-4 w-32 rounded" />
                <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="shimmer h-4 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pt-32">
        <ErrorState
          title="Order Not Found"
          message={error}
          onRetry={fetchOrderDetails}
        />
      </div>
    );
  }

  if (!order) return null;

  const formatDate = (dateString, withTime = false) => {
    const opts = { month: "long", day: "numeric", year: "numeric" };
    if (withTime) {
      opts.hour = '2-digit';
      opts.minute = '2-digit';
    }
    return new Date(dateString).toLocaleDateString("en-US", opts);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32 print:pt-4 print:bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Navigation & Utilities */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link href="/account/orders" className="text-sm font-bold text-charcoal-500 hover:text-gold-600 transition-colors flex items-center gap-2">
             <HiOutlineChevronLeft className="w-4 h-4" /> Return to Ledger
          </Link>
          <button onClick={handlePrint} className="text-sm font-bold text-charcoal-500 hover:text-gold-600 transition-colors flex items-center gap-2">
             <HiOutlinePrinter className="w-4 h-4" /> Print Digital Receipt
          </button>
        </div>

        {/* Primary Receipt Container */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 md:p-12 shadow-sm border border-charcoal-100 dark:border-charcoal-700 print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="border-b border-charcoal-100 dark:border-charcoal-700 pb-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="font-heading text-3xl font-bold text-ink dark:text-cream-50 mb-2">
                  Official Acquisition Receipt
                </h1>
                <p className="font-mono text-charcoal-500 font-bold uppercase tracking-widest text-xs">
                  Ledger ID: {order._id}
                </p>
              </div>
              <div className="flex flex-col gap-2 md:items-end text-sm text-charcoal-600 dark:text-charcoal-300">
                <span className="font-bold">Secured on {formatDate(order.createdAt, true)}</span>
                <span className="flex items-center gap-2">Status: <strong className="text-ink dark:text-cream-50">{order.orderStatus}</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left: Replicated Masterpiece Snapshot */}
            <div className="lg:col-span-2">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-6">Curated Inventory</h3>
              
              <div className="flex flex-col gap-6">
                {order.items.map(item => (
                  <div key={item.cartItemId || item.productId} className="flex gap-6 border-b border-charcoal-50 dark:border-charcoal-700/50 pb-6 last:border-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-charcoal-50 dark:bg-charcoal-900 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 justify-center">
                      <span className="text-[10px] font-extrabold text-gold-600 uppercase tracking-widest mb-1">{item.artistName}</span>
                      <h4 className="font-heading text-xl font-bold text-ink dark:text-cream-50 leading-tight mb-2">{item.title}</h4>
                      
                      {/* Fixed Historical Variant Data */}
                      {item.variant ? (
                        <div className="text-xs text-charcoal-500 dark:text-charcoal-400 mb-3">
                          {item.variant.size && <span className="mr-3">Size: <strong className="text-charcoal-600 dark:text-charcoal-300">{item.variant.size}</strong></span>}
                          {item.variant.frame && <span>Frame: <strong className="text-charcoal-600 dark:text-charcoal-300">{item.variant.frame}</strong></span>}
                        </div>
                      ) : (
                        <div className="text-xs text-charcoal-500 dark:text-charcoal-400 mb-3">Standard Edition</div>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-bold text-charcoal-600 dark:text-charcoal-300">Qty: {item.quantity}</span>
                        <span className="text-sm font-bold text-ink dark:text-cream-50">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Valuation & Shipping Snapshot */}
            <div className="lg:col-span-1 space-y-12">
              
              {/* Financial Summary */}
              <div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-6">Financial Ledger</h3>
                <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 text-sm">
                  <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300 mb-3">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300 mb-3">
                    <span>Shipping Handling</span>
                    <span className="font-bold">₹{order.shippingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300 mb-4 pb-4 border-b border-charcoal-200 dark:border-charcoal-700">
                    <span>Taxes</span>
                    <span className="font-bold">₹{order.taxPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end mb-4">
                    <span className="font-bold text-ink dark:text-cream-50">Final Total</span>
                    <span className="text-2xl font-bold text-ink dark:text-cream-50">₹{order.total.toLocaleString()}</span>
                  </div>
                  
                  {/* Payment Matrix */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-charcoal-200 dark:border-charcoal-700">
                    <HiOutlineInformationCircle className="w-4 h-4 text-charcoal-400" />
                    <span className="text-charcoal-500 dark:text-charcoal-400 text-xs">
                      Paid via {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </div>
                </div>
              </div>

              {/* Transit Details */}
              <div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-6">Transit Destination</h3>
                <div className="text-sm leading-relaxed text-charcoal-600 dark:text-charcoal-300">
                  <strong className="block text-ink dark:text-cream-50 mb-1">{order.shippingAddress.fullName}</strong>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p className="mb-2">{order.shippingAddress.country}</p>
                  <p className="text-xs text-charcoal-500">Contact: {order.shippingAddress.phone}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
