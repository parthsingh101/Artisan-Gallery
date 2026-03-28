"use client";

import Link from "next/link";

export default function Hero({ settings = {}, stats }) {
  const {
    heroTitle = "Original Art for Soulful Spaces",
    heroSubtitle = "Curated original paintings and sketches from world-renowned and emerging artists. Every piece is an investment in your legacy.",
    heroImage: rawHeroImage,
    heroButtonText = "Explore Gallery",
    heroButtonLink = "/shop"
  } = settings;

  // Use a reliable fallback if heroImage is missing or points to a local /uploads/ path
  const defaultHeroImage = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200";
  const heroImage = (rawHeroImage && !rawHeroImage.startsWith("/uploads/")) ? rawHeroImage : defaultHeroImage;

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-cream-50 dark:bg-charcoal-900 transition-colors duration-500">
      {/* Background Abstract Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[80%] rounded-full bg-gold-400 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-charcoal-300 blur-[150px]" />
      </div>

      <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="space-y-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[1px] bg-gold-600" />
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gold-600">Established 1994</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-ink dark:text-cream-50 leading-[1.1] tracking-tight whitespace-pre-line">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-charcoal-600 dark:text-charcoal-400 max-w-lg font-body leading-relaxed">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <Link href={heroButtonLink} className="px-10 py-4 border border-transparent bg-charcoal-900 dark:bg-cream-100 text-white dark:text-charcoal-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gold-600 dark:hover:bg-gold-400 dark:hover:text-white transition-all transform hover:scale-105 shadow-xl text-center">
              {heroButtonText}
            </Link>
            <Link href="/about" className="px-10 py-4 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-900 dark:text-cream-200 rounded-full font-bold uppercase tracking-widest text-xs hover:border-gold-500 hover:text-gold-600 transition-all transform hover:scale-105 text-center">
              Our Story
            </Link>
          </div>
          
          <div className="flex items-center gap-10 pt-8 border-t border-cream-200 dark:border-charcoal-800">
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold dark:text-cream-50">{stats?.totalArtworks || "1,200+"}</span>
              <span className="text-[9px] uppercase tracking-widest text-charcoal-400">Total Artworks</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold dark:text-cream-50">{stats?.totalArtists || "180+"}</span>
              <span className="text-[9px] uppercase tracking-widest text-charcoal-400">Featured Artists</span>
            </div>
          </div>
        </div>

        {/* Featured Image Placeholder Container */}
        <div className="relative group animate-fade-in hidden lg:block">
           <div className="relative z-10 w-full aspect-[4/5] bg-cream-100 dark:bg-charcoal-800 rounded-2xl shadow-2xl p-4 overflow-hidden group-hover:transform group-hover:scale-[1.02] transition-all duration-700 border border-white dark:border-charcoal-700">
              <div className="w-full h-full bg-cream-200 dark:bg-charcoal-900 rounded-xl flex items-center justify-center text-charcoal-300 dark:text-charcoal-700 overflow-hidden relative">
                 {heroImage ? (
                    <img src={heroImage} alt="Featured Masterpiece" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                 ) : (
                    <>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-gold-400/20 blur-sm scale-[2]" />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Masterpiece Showcase</span>
                    </>
                 )}
                 <div className="absolute top-0 right-0 p-8">
                     <div className="p-4 bg-white/50 dark:bg-charcoal-800/50 backdrop-blur-md rounded-lg text-ink dark:text-cream-50">
                        <p className="text-[8px] uppercase tracking-widest font-bold opacity-60">Featured Piece</p>
                        <p className="text-xs font-heading font-bold">{heroImage ? "Curated Selection" : "Misty Peaks, 2024"}</p>
                     </div>
                 </div>
              </div>
           </div>
           {/* Decorative Frames */}
           <div className="absolute top-10 right-[-40px] z-0 w-3/4 h-3/4 border-2 border-gold-500/20 rounded-2xl -rotate-6 transition-transform group-hover:rotate-0 duration-700" />
           <div className="absolute bottom-10 left-[-40px] z-0 w-3/4 h-3/4 border-2 border-charcoal-900/10 dark:border-white/10 rounded-2xl rotate-12 transition-transform group-hover:rotate-0 duration-700" />
        </div>
      </div>
    </section>
  );
}
