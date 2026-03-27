"use client";

import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlinePhotograph, HiOutlineX, HiOutlineSearch, HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { toast } from "react-hot-toast";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [search, setSearch] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete states
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setCategories(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: "", description: "", image: "" });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentId(cat._id);
    setFormData({ name: cat.name, description: cat.description || "", image: cat.image || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/admin/categories/${currentId}` : "/api/admin/categories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operation failed");
      
      toast.success(isEditing ? "Collection refined!" : "New collection added!");
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Delete failed");
      
      toast.success("Collection removed");
      setDeleteId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) || 
    (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in no-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-3xl font-bold text-ink dark:text-cream-50">Curated Collections</h2>
          <p className="text-charcoal-500 dark:text-charcoal-400 text-sm mt-1">Manage the high-level organization of your gallery.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-sm font-bold shadow-xl shadow-gold-600/20 transition-all hover:scale-105"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Collection
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-charcoal-800 p-4 rounded-2xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm">
        <div className="relative max-w-md">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-bold"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-white dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 animate-pulse" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white dark:bg-charcoal-800 p-12 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 text-center">
           <p className="text-charcoal-400 italic">No collections found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <div key={cat._id} className="group flex flex-col bg-white dark:bg-charcoal-800 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm overflow-hidden hover:shadow-md transition-all">
               <div className="h-40 bg-charcoal-50 dark:bg-charcoal-900 flex items-center justify-center overflow-hidden relative">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <HiOutlinePhotograph className="w-12 h-12 text-charcoal-200" />
                  )}
                  {/* Hover Actions overlay */}
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => openEditModal(cat)}
                      className="p-3 bg-white text-ink rounded-full hover:scale-110 hover:bg-gold-500 hover:text-white transition-all shadow-lg"
                      title="Edit Collection"
                    >
                      <HiOutlinePencilAlt className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setDeleteId(cat._id)}
                      className="p-3 bg-white text-ink rounded-full hover:scale-110 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      title="Delete Collection"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">{cat.name}</h3>
                  <p className="text-charcoal-400 text-xs mt-2 line-clamp-3 flex-1">{cat.description || "No description provided."}</p>
                  <div className="mt-6 pt-4 border-t border-charcoal-50 dark:border-charcoal-700 flex justify-between items-center">
                     <span className="text-[10px] font-extrabold text-gold-600 uppercase tracking-widest">{cat.slug}</span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in no-scrollbar">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <form 
            onSubmit={handleSubmit}
            className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-huge border border-charcoal-100 dark:border-charcoal-700 space-y-6"
          >
             <div className="flex justify-between items-center">
                <h3 className="font-heading text-2xl font-bold text-ink dark:text-cream-50">
                  {isEditing ? "Refine Collection" : "New Collection"}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-charcoal-400 hover:text-ink dark:hover:text-white transition-colors">
                  <HiOutlineX className="w-6 h-6" />
                </button>
             </div>

             <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Collection Name</label>
                  <input 
                    type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Oil Paintings"
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Short Description</label>
                  <textarea 
                    rows="3" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all text-sm resize-none"
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Thumbnail URL (Optional)</label>
                   <input 
                    type="text" value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all text-sm"
                   />
                </div>
             </div>

             <button 
               type="submit" disabled={isSubmitting}
               className="flex items-center justify-center gap-2 w-full py-4 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-xl shadow-xl shadow-gold-600/20 transition-all disabled:opacity-50"
             >
               {isSubmitting ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 isEditing ? "Preserve Changes" : "Establish Collection"
               )}
             </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in no-scrollbar">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-huge border border-charcoal-100 dark:border-charcoal-700">
             <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlineTrash className="w-8 h-8 text-red-600" />
             </div>
             <h3 className="text-2xl font-bold text-ink dark:text-cream-50 text-center">Remove Collection?</h3>
             <p className="text-charcoal-500 dark:text-charcoal-400 text-center mt-2 text-sm leading-relaxed">
               This will permanently remove the category. Ensure no masterpieces are currently assigned to this collection.
             </p>
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
                 {isDeleting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm"}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
