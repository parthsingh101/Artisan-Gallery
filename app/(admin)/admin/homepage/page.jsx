"use client";

import { useState, useEffect } from "react";
import { HiOutlineSave, HiOutlinePhotograph, HiOutlineSparkles, HiOutlineChevronRight } from "react-icons/hi";
import { toast } from "react-hot-toast";

export default function HomepageManager() {
  const [settings, setSettings] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    heroButtonText: "",
    heroButtonLink: "",
    featuredTitle: "",
    featuredSubtitle: "",
    bestsellerTitle: "",
    bestsellerSubtitle: "",
    promoTitle: "",
    promoSubtitle: "",
    promoImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/homepage");
        const data = await res.json();
        if (res.ok) setSettings(data);
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Homepage successfully refined!");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="animate-pulse space-y-8 p-8"><div className="h-64 bg-charcoal-100 dark:bg-charcoal-800 rounded-3xl" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-12 animate-fade-in no-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cream-100 dark:border-charcoal-800 pb-10">
        <div>
           <div className="flex items-center gap-3 text-gold-600 mb-2">
             <HiOutlineSparkles className="w-6 h-6" />
             <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Curation Suite</span>
           </div>
           <h1 className="font-heading text-4xl font-bold text-ink dark:text-cream-50">Studio Appearance</h1>
           <p className="text-charcoal-500 dark:text-charcoal-400 text-sm mt-2 max-w-xl">
             Shape the visual narrative of your digital gallery. Control headers, featured sections, and marquee imagery from one central command.
           </p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-ink dark:bg-cream-50 text-white dark:text-ink rounded-2xl text-sm font-bold shadow-2xl transition-all hover:scale-105 disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <HiOutlineSave className="w-5 h-5" />}
          {saving ? "Refining..." : "Preserve Signature"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Sections */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Hero Marquee */}
          <section className="bg-white dark:bg-charcoal-800/50 p-10 rounded-[2.5rem] border border-cream-100 dark:border-charcoal-700 shadow-sm space-y-8">
             <div className="flex items-center gap-4 border-b border-cream-50 dark:border-charcoal-700 pb-6">
                <div className="w-10 h-10 rounded-full bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center">
                  <span className="text-gold-600 font-bold">1</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-ink dark:text-cream-50">Hero Marquee</h2>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Main Headline</label>
                  <input 
                    name="heroTitle" value={settings.heroTitle} onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Secondary Verse</label>
                  <input 
                    name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">CTA Text</label>
                    <input name="heroButtonText" value={settings.heroButtonText} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">CTA Destination</label>
                    <input name="heroButtonLink" value={settings.heroButtonLink} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all font-bold" />
                  </div>
                </div>
             </div>
          </section>

          {/* Collection Headers */}
          <section className="bg-white dark:bg-charcoal-800/50 p-10 rounded-[2.5rem] border border-cream-100 dark:border-charcoal-700 shadow-sm space-y-8">
             <div className="flex items-center gap-4 border-b border-cream-50 dark:border-charcoal-700 pb-6">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900/20 flex items-center justify-center">
                  <span className="text-slate-600 font-bold">2</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-ink dark:text-cream-50">Collection Headers</h2>
             </div>

             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-ink dark:text-cream-200 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                        Featured Grid
                      </h4>
                      <input name="featuredTitle" value={settings.featuredTitle} onChange={handleChange} placeholder="Grid Title" className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all font-bold" />
                      <input name="featuredSubtitle" value={settings.featuredSubtitle} onChange={handleChange} placeholder="Grid Subtitle" className="w-full px-6 py-3 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all text-xs" />
                   </div>
                   <div className="space-y-4 text-left">
                      <h4 className="text-xs font-bold text-ink dark:text-cream-200 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                        Bestseller Grid
                      </h4>
                      <input name="bestsellerTitle" value={settings.bestsellerTitle} onChange={handleChange} placeholder="Grid Title" className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all font-bold" />
                      <input name="bestsellerSubtitle" value={settings.bestsellerSubtitle} onChange={handleChange} placeholder="Grid Subtitle" className="w-full px-6 py-3 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all text-xs" />
                   </div>
                </div>
             </div>
          </section>

          {/* Marquee Banner */}
          <section className="bg-white dark:bg-charcoal-800/50 p-10 rounded-[2.5rem] border border-cream-100 dark:border-charcoal-700 shadow-sm space-y-8">
             <div className="flex items-center gap-4 border-b border-cream-50 dark:border-charcoal-700 pb-6">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <span className="text-amber-600 font-bold">3</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-ink dark:text-cream-50">Marquee Banner</h2>
             </div>
             
             <div className="grid grid-cols-1 gap-6">
                <input name="promoTitle" value={settings.promoTitle} onChange={handleChange} placeholder="Main Headline" className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all font-bold" />
                <textarea name="promoSubtitle" value={settings.promoSubtitle} onChange={handleChange} placeholder="Promo Narrative" rows="3" className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 dark:bg-charcoal-900 border border-transparent focus:border-gold-500 outline-none transition-all text-sm resize-none" />
             </div>
          </section>

        </div>

        {/* Media Sidebar */}
        <div className="space-y-10">
           
           {/* Visual Assets Card */}
           <div className="bg-ink dark:bg-charcoal-900/50 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
              <h3 className="font-heading text-xl font-bold mb-8 flex items-center gap-3">
                <HiOutlinePhotograph className="text-gold-500" />
                Feature Media
              </h3>

              <div className="space-y-8">
                 <div className="group">
                    <label className="block text-[8px] uppercase tracking-[0.3em] text-charcoal-400 font-bold mb-4">Hero Exhibition Image</label>
                    <div className="aspect-[3/4] rounded-2xl bg-charcoal-800/50 border-2 border-dashed border-charcoal-700 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all group-hover:border-gold-500/50">
                       {settings.heroImage ? (
                         <>
                           <img src={settings.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                           <div className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setSettings(p => ({...p, heroImage: ""}))} className="bg-red-500 text-white p-2 rounded-lg text-[10px] font-bold uppercase tracking-widest">Remove</button>
                           </div>
                         </>
                       ) : (
                         <>
                           <HiOutlinePhotograph className="w-8 h-8 text-charcoal-600 mb-2" />
                           <p className="text-[10px] text-charcoal-500 font-bold">No Artwork Assigned</p>
                         </>
                       )}
                    </div>
                    <input 
                      name="heroImage" value={settings.heroImage} onChange={handleChange} 
                      placeholder="Image URL or Path (/uploads/hero.jpg)" 
                      className="mt-4 w-full bg-charcoal-800 border-none rounded-xl px-4 py-2 text-[10px] text-charcoal-300 font-mono outline-none focus:ring-1 focus:ring-gold-500"
                    />
                 </div>

                 <div className="group">
                    <label className="block text-[8px] uppercase tracking-[0.3em] text-charcoal-400 font-bold mb-4">Marquee Background</label>
                    <div className="aspect-video rounded-2xl bg-charcoal-800/50 border-2 border-dashed border-charcoal-700 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all group-hover:border-gold-500/50">
                       {settings.promoImage ? (
                         <img src={settings.promoImage} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                       ) : (
                         <HiOutlinePhotograph className="w-8 h-8 text-charcoal-600 mb-2" />
                       )}
                    </div>
                    <input 
                      name="promoImage" value={settings.promoImage} onChange={handleChange} 
                      placeholder="Image URL or Path" 
                      className="mt-4 w-full bg-charcoal-800 border-none rounded-xl px-4 py-2 text-[10px] text-charcoal-300 font-mono outline-none focus:ring-1 focus:ring-gold-500"
                    />
                 </div>
              </div>
           </div>

           {/* Quick Guide */}
           <div className="p-8 rounded-[2.5rem] bg-gold-50/50 dark:bg-gold-500/5 border border-gold-100 dark:border-gold-900/20">
              <h4 className="text-xs font-bold text-gold-700 dark:text-gold-400 uppercase tracking-widest mb-4">Curation Tips</h4>
              <ul className="space-y-4">
                 {[
                   "Use high-resolution vertical images for the Hero (3:4 aspect ratio recommended).",
                   "Keep headlines concise to maintain the premium gallery aesthetic.",
                   "Custom banners work best with darker abstract backgrounds."
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 text-sm text-charcoal-600 dark:text-charcoal-400 leading-relaxed font-body">
                      <span className="text-gold-500 mt-1.5"><HiOutlineChevronRight className="w-3 h-3" /></span>
                      {tip}
                   </li>
                 ))}
              </ul>
           </div>

        </div>

      </form>
    </div>
  );
}
