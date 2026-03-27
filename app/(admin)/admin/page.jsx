"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HiOutlineCube, 
  HiOutlineShoppingCart, 
  HiOutlineUsers, 
  HiOutlineExclamationCircle,
  HiOutlinePlus,
  HiOutlineCollection,
  HiOutlineExternalLink,
  HiOutlineClock,
  HiOutlineCurrencyRupee
} from "react-icons/hi";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const json = await res.json();
        setData(json);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin" />
        <p className="text-charcoal-400 font-bold uppercase tracking-widest text-[10px]">Assembling Dashboard...</p>
      </div>
    );
  }

  const { stats, recentOrders, recentProducts } = data || {};

  const statCards = [
    { label: "Total Artworks", value: stats?.products || 0, icon: HiOutlineCube, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Global Orders", value: stats?.orders || 0, icon: HiOutlineShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Private Revenue", value: `₹${(stats?.revenue || 0).toLocaleString()}`, icon: HiOutlineCurrencyRupee, color: "text-gold-600", bg: "bg-gold-50 dark:bg-gold-500/10" },
    { label: "Critical Stock", value: stats?.lowStock || 0, icon: HiOutlineExclamationCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  const quickActions = [
    { name: "Add Product", href: "/admin/products/new", icon: HiOutlinePlus, bg: "bg-gold-500", text: "text-white" },
    { name: "Categories", href: "/admin/categories", icon: HiOutlineCollection, bg: "bg-charcoal-800", text: "text-white" },
    { name: "View Store", href: "/", icon: HiOutlineExternalLink, bg: "bg-white", text: "text-charcoal-700" },
  ];

  return (
    <div className="space-y-8 animate-fade-in no-scrollbar pb-10">
      <div>
        <h2 className="font-heading text-3xl font-bold text-ink dark:text-cream-50">Dashboard Overview</h2>
        <p className="text-charcoal-500 dark:text-charcoal-400 text-sm mt-1">Welcome back, Curator. Here's a live pulse of the gallery.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-charcoal-500 dark:text-charcoal-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="font-heading text-3xl font-bold text-ink dark:text-cream-50 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gold-50 dark:bg-charcoal-800/50 p-6 rounded-3xl border border-gold-100 dark:border-charcoal-700">
        <h3 className="text-xs font-bold text-gold-700 dark:text-gold-500 uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          {quickActions.map((action) => (
            <Link 
              key={action.name} 
              href={action.href}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${action.bg} ${action.text} border border-charcoal-100/10`}
            >
              <action.icon className="w-5 h-5" />
              {action.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-charcoal-50 dark:border-charcoal-700 flex justify-between items-center">
             <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">Recent Curations</h3>
             <Link href="/admin/products" className="text-xs font-bold text-gold-600 hover:text-gold-700 underline uppercase tracking-widest">View All</Link>
          </div>
          <div className="overflow-x-auto text-sm">
            {recentProducts?.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-charcoal-50 dark:bg-charcoal-900/50 text-charcoal-400 text-[10px] uppercase font-bold tracking-widest">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-50 dark:divide-charcoal-700">
                  {recentProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-charcoal-50/50 dark:hover:bg-charcoal-900/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-ink dark:text-cream-100">{p.title}</td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                           p.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-charcoal-100 text-charcoal-400'
                         }`}>
                           {p.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-ink dark:text-cream-50">₹{p.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center text-charcoal-400">No artworks curated yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-charcoal-50 dark:border-charcoal-700 flex justify-between items-center">
             <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">Recent Acquisitions</h3>
             <Link href="/admin/orders" className="text-xs font-bold text-gold-600 hover:text-gold-700 underline uppercase tracking-widest">Manage All</Link>
          </div>
          <div className="divide-y divide-charcoal-50 dark:divide-charcoal-700">
             {recentOrders?.length > 0 ? recentOrders.map((o) => (
               <div key={o._id} className="p-4 hover:bg-charcoal-50/50 dark:hover:bg-charcoal-900/30 transition-colors flex justify-between items-center group">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-charcoal-50 dark:bg-charcoal-900 flex items-center justify-center">
                      <HiOutlineClock className="w-5 h-5 text-charcoal-400 group-hover:text-gold-500 transition-colors" />
                   </div>
                   <div>
                      <p className="font-bold text-ink dark:text-cream-50 text-sm overflow-hidden text-ellipsis w-32 md:w-auto">{o._id.substring(o._id.length - 8).toUpperCase()}</p>
                      <p className="text-[10px] text-charcoal-400">{o.userId?.name || 'Guest'} • {new Date(o.createdAt).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className="font-bold text-ink dark:text-cream-50 text-sm">₹{o.total.toLocaleString()}</p>
                    <span className="text-[9px] font-bold uppercase text-gold-600">{o.orderStatus}</span>
                 </div>
               </div>
             )) : (
              <div className="py-20 text-center text-charcoal-400">No acquisitions yet.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
