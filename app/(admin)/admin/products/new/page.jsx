"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  HiOutlineCloudUpload, 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlineCheckCircle, 
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineCurrencyRupee,
  HiOutlineTag,
  HiOutlineInformationCircle
} from "react-icons/hi";
import { toast } from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    artistName: "",
    category: "",
    productType: "painting",
    price: "",
    salePrice: "",
    stock: 1,
    sku: "",
    status: "draft",
    shortDescription: "",
    description: "",
    careInstructions: "",
    shippingInfo: "",
    featured: false,
    bestseller: false,
    tags: "", // Combined as comma separated string for UI
  });

  const [images, setImages] = useState([]); // [{url, publicId, alt, isPrimary}]
  const [variants, setVariants] = useState([]); // [{size, frame, material, extraPrice, stock}]

  // Load Categories
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- Image Handling ---
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formDataToUpload = new FormData();
    files.forEach(file => formDataToUpload.append("files", file));

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataToUpload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const newImages = data.images.map((img, idx) => ({
        url: img.url,
        publicId: img.publicId,
        alt: img.name,
        isPrimary: images.length === 0 && idx === 0 // Make first image primary if none exist
      }));

      setImages(prev => [...prev, ...newImages]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (publicId) => {
    setImages(prev => prev.filter(img => img.publicId !== publicId));
  };

  const setPrimaryImage = (publicId) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.publicId === publicId
    })));
  };

  // --- Variant Handling ---
  const addVariant = () => {
    setVariants(prev => [...prev, { size: "", frame: "", material: "", extraPrice: 0, stock: 1 }]);
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error("Please select a category");
    if (images.length === 0) return toast.error("Please upload at least one image");

    setLoading(true);
    
    // Prepare tags
    const tagArray = formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(t => t) : [];

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: tagArray,
          images,
          variants
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in no-scrollbar">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-charcoal-100 dark:border-charcoal-800 pb-8">
        <div>
          <h2 className="font-heading text-4xl font-extrabold text-ink dark:text-cream-50 leading-tight">Curate New Artwork</h2>
          <p className="text-charcoal-500 dark:text-charcoal-400 mt-2 text-lg">Add a masterpiece to your digital gallery collection.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-charcoal-200 dark:border-charcoal-700 rounded-xl text-sm font-bold text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-800 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-sm font-bold shadow-xl shadow-gold-600/20 transition-all disabled:opacity-50 disabled:scale-95 flex items-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiOutlineCheckCircle className="w-5 h-5" />}
            Publish Artwork
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section: Basic Information */}
          <section className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <HiOutlineInformationCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Artwork Title</label>
                <input 
                  type="text" name="title" required value={formData.title} onChange={handleInputChange}
                  placeholder="e.g., The Starry Night Over the Rhone"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Artist Name</label>
                <input 
                  type="text" name="artistName" required value={formData.artistName} onChange={handleInputChange}
                  placeholder="e.g., Vincent van Gogh"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  name="category" required value={formData.category} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Art Medium / Type</label>
                <div className="flex gap-4">
                  {['painting', 'sketch'].map(type => (
                    <button
                      key={type} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, productType: type }))}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all border ${
                        formData.productType === type 
                          ? 'bg-gold-500 border-gold-600 text-white shadow-lg shadow-gold-500/10' 
                          : 'bg-white dark:bg-charcoal-900 border-charcoal-100 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Tags (Separated by comma)</label>
                <input 
                  type="text" name="tags" value={formData.tags} onChange={handleInputChange}
                  placeholder="e.g., sunrise, oil, landscape"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section: Description */}
          <section className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <HiOutlinePhotograph className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">Narrative & Details</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Brief Narrative (Short Description)</label>
                <textarea 
                  name="shortDescription" required rows="2" value={formData.shortDescription} onChange={handleInputChange}
                  placeholder="A one-sentence impact statement for the artwork..."
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">The Full Story (Detailed Description)</label>
                <textarea 
                  name="description" required rows="5" value={formData.description} onChange={handleInputChange}
                  placeholder="Tell the story behind this piece, the techniques used, and its deeper meaning..."
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Care Instructions</label>
                  <textarea 
                    name="careInstructions" rows="3" value={formData.careInstructions} onChange={handleInputChange}
                    placeholder="Keep away from direct sunlight, wipe with a dry cloth..."
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Shipping Information</label>
                  <textarea 
                    name="shippingInfo" rows="3" value={formData.shippingInfo} onChange={handleInputChange}
                    placeholder="Ships in a reinforced crate, insured global delivery..."
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Art Variants */}
          <section className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                    <HiOutlineTag className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">Dimensions & Variants</h3>
               </div>
               <button 
                type="button" onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 bg-charcoal-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all"
               >
                 <HiOutlinePlus className="w-4 h-4" /> Add Row
               </button>
            </div>
            
            {variants.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-charcoal-100 dark:border-charcoal-700 rounded-3xl">
                <p className="text-charcoal-400 text-sm">No variants added. Use variants for different sizes or framing options.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {variants.map((v, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900/50 flex flex-wrap lg:flex-nowrap items-end gap-4 animate-fade-in group">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] font-bold text-charcoal-400 uppercase mb-1">Size (e.g. 24x36")</label>
                      <input 
                        type="text" value={v.size} onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-charcoal-200 dark:border-charcoal-700 dark:bg-charcoal-800 text-sm focus:border-gold-500 outline-none"
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] font-bold text-charcoal-400 uppercase mb-1">Frame Type</label>
                      <input 
                        type="text" value={v.frame} onChange={(e) => updateVariant(idx, 'frame', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-charcoal-200 dark:border-charcoal-700 dark:bg-charcoal-800 text-sm focus:border-gold-500 outline-none"
                      />
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <label className="block text-[10px] font-bold text-charcoal-400 uppercase mb-1">Extra ₹</label>
                      <input 
                        type="number" value={v.extraPrice} onChange={(e) => updateVariant(idx, 'extraPrice', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-charcoal-200 dark:border-charcoal-700 dark:bg-charcoal-800 text-sm focus:border-gold-500 outline-none"
                      />
                    </div>
                    <div className="flex-1 min-w-[80px]">
                      <label className="block text-[10px] font-bold text-charcoal-400 uppercase mb-1">Stock</label>
                      <input 
                        type="number" value={v.stock} onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-charcoal-200 dark:border-charcoal-700 dark:bg-charcoal-800 text-sm focus:border-gold-500 outline-none"
                      />
                    </div>
                    <button 
                      type="button" onClick={() => removeVariant(idx)}
                      className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all mb-0.5"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Visuals & Logic Flags */}
        <div className="space-y-10">
          
          {/* Section: Image Gallery */}
          <section className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm overflow-hidden">
            <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50 mb-6">Visual Gallery</h3>
            
            <div className="space-y-6">
              {/* Upload Dropzone */}
              <div className="relative group">
                <input 
                  type="file" multiple accept="image/*" onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center gap-4 group-hover:bg-charcoal-50 dark:group-hover:bg-charcoal-900/50 ${uploading ? 'bg-charcoal-50 dark:bg-charcoal-900 border-gold-500' : 'border-charcoal-100 dark:border-charcoal-700'}`}>
                  <div className="w-16 h-16 bg-gold-50 dark:bg-gold-900/10 rounded-full flex items-center justify-center text-gold-600 transition-transform group-hover:scale-110">
                    {uploading ? <div className="w-8 h-8 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin" /> : <HiOutlineCloudUpload className="w-10 h-10" />}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-charcoal-700 dark:text-cream-50">Upload Masterpiece</p>
                    <p className="text-xs text-charcoal-400 mt-1">High-res JPG or PNG allowed</p>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img) => (
                    <div key={img.publicId} className="group relative aspect-square rounded-2xl overflow-hidden border border-charcoal-100 dark:border-charcoal-700 shadow-sm">
                      <img src={img.url} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button 
                          type="button" onClick={() => removeImage(img.publicId)}
                          className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                        {!img.isPrimary && (
                           <button 
                            type="button" onClick={() => setPrimaryImage(img.publicId)}
                            className="px-3 py-1 bg-white text-ink text-[10px] font-extrabold uppercase rounded-full hover:bg-gold-500 hover:text-white transition-all shadow-lg"
                           >
                             Make Primary
                           </button>
                        )}
                      </div>
                      {img.isPrimary && (
                        <div className="absolute top-2 left-2 px-3 py-1 bg-gold-500 text-white text-[9px] font-extrabold uppercase tracking-widest rounded-full shadow-lg">Primary</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section: Pricing & Inventory */}
          <section className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                <HiOutlineCurrencyRupee className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">Value & Inventory</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Base Price (₹)</label>
                  <input 
                    type="number" name="price" required value={formData.price} onChange={handleInputChange}
                    placeholder="e.g. 45000"
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Sale Price (₹)</label>
                  <input 
                    type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange}
                    placeholder="Optional"
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none text-emerald-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Total Units</label>
                  <input 
                    type="number" name="stock" required value={formData.stock} onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none"
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">SKU / ID</label>
                  <input 
                    type="text" name="sku" value={formData.sku} onChange={handleInputChange}
                    placeholder="AG-2024-001"
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest mb-2">Curator's Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['draft', 'active', 'archived'].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                      className={`py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all border ${
                        formData.status === s 
                          ? 'bg-charcoal-900 border-charcoal-900 text-white' 
                          : 'bg-white dark:bg-charcoal-900 border-charcoal-100 dark:border-charcoal-700 text-charcoal-400 hover:border-gold-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-charcoal-50 dark:border-charcoal-700">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-charcoal-200 peer-focus:outline-none dark:bg-charcoal-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500 rounded-full transition-all"></div>
                  </div>
                  <span className="text-sm font-bold text-charcoal-600 dark:text-charcoal-400 group-hover:text-gold-600 transition-colors">Showcase in Featured</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleInputChange}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-charcoal-200 peer-focus:outline-none dark:bg-charcoal-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500 rounded-full transition-all"></div>
                  </div>
                  <span className="text-sm font-bold text-charcoal-600 dark:text-charcoal-400 group-hover:text-gold-600 transition-colors">Mark as Bestseller</span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
