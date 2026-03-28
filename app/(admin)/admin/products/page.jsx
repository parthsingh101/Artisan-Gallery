"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineCube,
  HiOutlinePhotograph
} from "react-icons/hi";
import { toast } from "react-hot-toast";

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  
  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    productType: "",
    status: "",
    page: 1
  });

  const [deleteId, setDeleteId] = useState(null); // For delete modal
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: "10"
      }).toString();

      const res = await fetch(`/api/admin/products?${query}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetches
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch categories");
        setCategories(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      
      toast.success("Masterpiece removed from gallery");
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'draft': return 'bg-charcoal-100 text-charcoal-600 dark:bg-charcoal-800 dark:text-charcoal-400';
      case 'archived': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-charcoal-100 text-charcoal-600';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in no-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-3xl font-bold text-ink dark:text-cream-50">Masterpiece Repository</h2>
          <p className="text-charcoal-500 dark:text-charcoal-400 text-sm mt-1">Refine and manage your curated art collection.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-sm font-bold shadow-xl shadow-gold-600/20 transition-all hover:scale-105"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Artwork
        </Link>
      </div>

      {/* Filter Management Bar */}
      <div className="bg-white dark:bg-charcoal-800 p-6 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5" />
          <input 
            type="text" name="search" value={filters.search} onChange={handleFilterChange}
            placeholder="Search by title..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-auto lg:flex">
          <select 
            name="category" value={filters.category} onChange={handleFilterChange}
            className="px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none text-sm font-bold text-charcoal-600 dark:text-charcoal-300"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>

          <select 
             name="productType" value={filters.productType} onChange={handleFilterChange}
             className="px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none text-sm font-bold text-charcoal-600 dark:text-charcoal-300"
          >
            <option value="">All Mediums</option>
            <option value="painting">Paintings</option>
            <option value="sketch">Sketches</option>
          </select>

          <select 
             name="status" value={filters.status} onChange={handleFilterChange}
             className="px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none text-sm font-bold text-charcoal-600 dark:text-charcoal-300"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Product Repository Table */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin" />
            <p className="text-charcoal-400 font-bold uppercase tracking-widest text-[10px]">Restoring Gallery...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 gap-6 px-4">
            <div className="w-20 h-20 bg-charcoal-50 dark:bg-charcoal-900 rounded-full flex items-center justify-center">
               <HiOutlineCube className="w-10 h-10 text-charcoal-300" />
            </div>
            <div className="text-center">
               <h3 className="text-xl font-bold text-ink dark:text-cream-50">Empty Canvas</h3>
               <p className="text-charcoal-400 max-w-xs mx-auto mt-2">No artworks found matching your criteria. Start by adding a new masterpiece.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-charcoal-50 dark:bg-charcoal-900/50 text-charcoal-500 dark:text-charcoal-400 text-[10px] uppercase font-bold tracking-widest border-b border-charcoal-100 dark:border-charcoal-700">
                  <th className="px-6 py-5">Masterpiece</th>
                  <th className="px-6 py-5">Category & Type</th>
                  <th className="px-6 py-5">Value</th>
                  <th className="px-6 py-5">Stock</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-50 dark:divide-charcoal-700">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gold-50/30 dark:hover:bg-charcoal-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl relative overflow-hidden bg-charcoal-100 dark:bg-charcoal-700 border border-charcoal-100 dark:border-charcoal-600">
                           {p.images?.find(i => i.isPrimary) ? (
                             <img src={p.images.find(i => i.isPrimary).url} alt={p.title} className="w-full h-full object-cover" />
                           ) : (
                             <HiOutlinePhotograph className="w-full h-full p-3 text-charcoal-300" />
                           )}
                        </div>
                        <div>
                          <p className="font-bold text-ink dark:text-cream-50 leading-tight">{p.title}</p>
                          <p className="text-[11px] text-charcoal-400 mt-0.5">{p.artistName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm font-bold text-charcoal-600 dark:text-charcoal-300">{p.category?.name || 'N/A'}</p>
                       <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">{p.productType}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-ink dark:text-cream-50 text-sm">₹{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-charcoal-500 dark:text-charcoal-400 text-sm">{p.stock}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getStatusColor(p.status)}`}>
                         {p.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <Link href={`/admin/products/edit/${p._id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                           <HiOutlinePencilAlt className="w-4 h-4" />
                         </Link>
                         <button 
                           onClick={() => setDeleteId(p._id)}
                           className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                         >
                           <HiOutlineTrash className="w-4 h-4" />
                         </button>
                         <Link href={`/product/${p.slug}`} className="p-2 bg-gold-50 text-gold-600 rounded-lg hover:bg-gold-600 hover:text-white transition-all shadow-sm">
                           <HiOutlineEye className="w-4 h-4" />
                         </Link>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Section */}
        {pagination.pages > 1 && (
          <div className="p-6 bg-charcoal-50 dark:bg-charcoal-900/50 flex items-center justify-between">
            <p className="text-xs font-bold text-charcoal-400">Showing <span className="text-charcoal-600 dark:text-cream-50">{(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-charcoal-600 dark:text-cream-50">{pagination.total}</span> Artworks</p>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg bg-white dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-gold-500 hover:text-white transition-all"
               >
                 <HiOutlineChevronLeft className="w-5 h-5" />
               </button>
               {[...Array(pagination.pages)].map((_, i) => (
                 <button 
                   key={i} onClick={() => handlePageChange(i + 1)}
                   className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                     pagination.page === i + 1 
                      ? 'bg-gold-600 text-white shadow-lg' 
                      : 'bg-white dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-400 hover:bg-gold-50'
                   }`}
                 >
                   {i + 1}
                 </button>
               ))}
               <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg bg-white dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-gold-500 hover:text-white transition-all"
               >
                 <HiOutlineChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in no-scrollbar">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-huge border border-charcoal-100 dark:border-charcoal-700">
             <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlineTrash className="w-8 h-8 text-red-600" />
             </div>
             <h3 className="text-2xl font-bold text-ink dark:text-cream-50 text-center">Remove Artwork?</h3>
             <p className="text-charcoal-500 dark:text-charcoal-400 text-center mt-2">This will permanently remove the piece from our repository. This action is irreversible.</p>
             <div className="grid grid-cols-2 gap-4 mt-8">
               <button 
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-6 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 font-bold text-charcoal-500 hover:bg-charcoal-50 transition-all disabled:opacity-50"
               >
                 Keep it
               </button>
               <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all disabled:opacity-50"
               >
                 {isDeleting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm Delete"}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
