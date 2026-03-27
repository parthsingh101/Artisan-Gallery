"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineFolderOpen,
  HiOutlineChevronRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { OrderListSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

const statusColor = (s) => {
  switch (s) {
    case "Processing": return "badge badge-blue";
    case "Shipped":    return "badge badge-purple";
    case "Delivered":  return "badge badge-green";
    case "Cancelled":  return "badge badge-red";
    default:           return "badge bg-charcoal-100 text-charcoal-600 dark:bg-charcoal-800 dark:text-charcoal-400";
  }
};

const paymentColor = (s) => {
  switch (s) {
    case "Paid":   return "text-emerald-500";
    case "Failed": return "text-red-500";
    default:       return "text-gold-500";
  }
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function AccountOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pt-32 pb-20">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <div className="shimmer h-10 w-48 rounded-xl mb-8" />
          <OrderListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="label-caps text-gold-600 mb-1">Account</p>
            <h1 className="font-heading text-4xl font-bold text-ink dark:text-cream-50">
              Order History
            </h1>
          </div>
          {orders.length > 0 && (
            <p className="text-sm text-charcoal-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <OrderListSkeleton count={5} />
        ) : error ? (
          <ErrorState
            title="Failed to load orders"
            message={error}
            onRetry={fetchOrders}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<HiOutlineFolderOpen className="w-10 h-10" />}
            title="No Acquisitions Yet"
            message="Your private collection history is empty. Explore the active galleries to find your first masterpiece."
            actionLabel="Enter Gallery"
            actionHref="/shop"
          />
        ) : (
          <div className="space-y-4 stagger-children">
            {orders.map((order) => (
              <div
                key={order._id}
                className="animate-fade-up bg-white dark:bg-charcoal-800 rounded-2xl p-5 md:p-7 shadow-sm border border-charcoal-100 dark:border-charcoal-700 hover:border-gold-300 dark:hover:border-gold-600/30 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* metadata grid */}
                  <div className="grid grid-cols-2 md:flex md:flex-row md:items-center gap-4 md:gap-10 text-sm flex-1">
                    <div>
                      <p className="label-caps mb-1">Order ID</p>
                      <p className="font-mono text-xs text-ink dark:text-cream-50 font-bold truncate max-w-[140px]">
                        {order._id}
                      </p>
                    </div>
                    <div>
                      <p className="label-caps mb-1">Date</p>
                      <p className="font-bold text-ink dark:text-cream-50">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="label-caps mb-1">Items</p>
                      <p className="font-bold text-ink dark:text-cream-50">
                        {order.items.reduce((s, i) => s + i.quantity, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="label-caps mb-1">Total</p>
                      <p className="font-bold text-xl text-ink dark:text-cream-50">
                        ₹{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-charcoal-100 dark:border-charcoal-700">
                    <div className="flex flex-col gap-1.5">
                      <span className={statusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${paymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>

                    <Link
                      href={`/account/orders/${order._id}`}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-charcoal-50 dark:bg-charcoal-900 text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-500/10 transition-all group-hover:bg-gold-50 dark:group-hover:bg-gold-500/10 flex-shrink-0"
                    >
                      <HiOutlineChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
