"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { HiOutlineChevronRight, HiOutlineFilter } from "react-icons/hi";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeletons";
import NoResults from "@/components/ui/NoResults";

const STATUS_OPTIONS = ["", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const LIMIT = 20;

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filterStatus) params.set("status", filterStatus);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load admin orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, filterStatus, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const orderStatusColor = (s) => {
    switch (s) {
      case "Processing": return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
      case "Shipped": return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
      case "Delivered": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "Cancelled": return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
      default: return "bg-charcoal-100 text-charcoal-600 dark:bg-charcoal-700 dark:text-charcoal-300";
    }
  };

  const paymentColor = (s) => {
    switch (s) {
      case "Paid": return "text-emerald-500";
      case "Failed": return "text-red-500";
      default: return "text-gold-500";
    }
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink dark:text-cream-50">Orders Ledger</h1>
          <p className="text-charcoal-500 text-sm mt-1">{total} total acquisition{total !== 1 ? "s" : ""}</p>
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            paramName="search"
            placeholder="Search by ID or email…"
            className="w-64"
          />
          <div className="flex items-center gap-2">
            <HiOutlineFilter className="w-4 h-4 text-charcoal-400" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-2 text-sm focus:border-gold-500 outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s || "All Statuses"}</option>
            ))}
          </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-charcoal-800 rounded-2xl border border-charcoal-100 dark:border-charcoal-700 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 dark:border-charcoal-700 bg-charcoal-50 dark:bg-charcoal-900">
                  {["Order ID", "Date", "Collector", "Items", "Total", "Payment", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] font-extrabold text-charcoal-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody><TableSkeleton rows={8} cols={8} /></tbody>
            </table>
          </div>
        ) : orders.length === 0 ? (
          <NoResults
            searchTerm={search}
            onClear={() => { setSearch(""); setFilterStatus(""); setPage(1); }}
            className="h-64"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 dark:border-charcoal-700 bg-charcoal-50 dark:bg-charcoal-900">
                  {["Order ID", "Date", "Collector", "Items", "Total", "Payment", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] font-extrabold text-charcoal-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-50 dark:divide-charcoal-700/50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-charcoal-50/50 dark:hover:bg-charcoal-700/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-charcoal-500 dark:text-charcoal-400 max-w-[120px] truncate">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      {order.userId ? (
                        <div>
                          <p className="font-bold text-ink dark:text-cream-50">{order.userId.name || "—"}</p>
                          <p className="text-charcoal-400 text-xs">{order.userId.email}</p>
                        </div>
                      ) : (
                        <span className="text-charcoal-400">Guest</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="px-6 py-4 font-bold text-ink dark:text-cream-50">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-extrabold text-[10px] uppercase tracking-widest ${paymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${orderStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="flex items-center justify-center p-2 rounded-lg hover:bg-gold-50 dark:hover:bg-gold-500/10 text-charcoal-400 hover:text-gold-600 transition-all"
                      >
                        <HiOutlineChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination using shared component */}
      <Pagination total={total} page={page} limit={LIMIT} />
    </div>
  );
}
