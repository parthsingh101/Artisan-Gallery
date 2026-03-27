"use client";

import Link from "next/link";

const COLOR_MAPS = [
  { color: "bg-amber-100/50 dark:bg-amber-900/10", textColor: "text-amber-800 dark:text-amber-500", label: "Classical & Modern" },
  { color: "bg-slate-100/50 dark:bg-slate-800/20", textColor: "text-slate-700 dark:text-slate-400", label: "The Line Collection" },
  { color: "bg-sky-100/50 dark:bg-sky-900/10", textColor: "text-sky-800 dark:text-sky-500", label: "Ethereal Washes" },
  { color: "bg-purple-100/50 dark:bg-purple-900/10", textColor: "text-purple-800 dark:text-purple-500", label: "Contemporary Media" }
];

export default function CategorySection({ categories = [] }) {
  return (
    <section className="py-24 bg-white dark:bg-charcoal-900/50 border-y border-cream-100 dark:border-charcoal-800">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
             <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gold-600 mb-4 block">Curated Collections</span>
             <h2 className="text-3xl md:text-5xl font-heading font-black text-ink dark:text-white leading-tight">
               Discover by <br /> Medium & Style
             </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-charcoal-900 dark:text-cream-200 border-b border-gold-500 pb-1 hover:text-gold-600 transition-colors">
            View All Series
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.slice(0, 4).map((cat, idx) => {
            const style = COLOR_MAPS[idx % COLOR_MAPS.length];
            return (
              <Link key={cat._id} href={`/category/${cat.slug}`} className="group overflow-hidden rounded-2xl relative h-[400px] border border-cream-100 dark:border-charcoal-800">
                {/* Background Image */}
                {cat.image ? (
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className={`absolute inset-0 ${style.color}`} />
                )}
                
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content Overlay */}
                <div className="relative h-full p-10 flex flex-col justify-between z-10 transition-all duration-700">
                   <div className="space-y-2 drop-shadow-md">
                      <p className={`text-[10px] uppercase font-bold tracking-widest text-gold-500 opacity-100`}>
                        {style.label}
                      </p>
                      <h3 className="text-3xl font-heading font-bold text-white leading-tight drop-shadow-lg">
                        {cat.name}
                      </h3>
                   </div>
                   
                   <div className="flex items-center justify-between mt-auto drop-shadow-md">
                      <span className="text-[10px] font-body text-charcoal-200 font-bold uppercase tracking-widest">
                        Original Series
                      </span>
                      <div className="p-3 rounded-full bg-white/50 dark:bg-charcoal-800/50 backdrop-blur-md transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                         <span className="text-gold-600">→</span>
                      </div>
                   </div>
                   
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/20 dark:bg-white/5 rounded-full blur-2xl group-hover:scale-[2] transition-transform duration-1000" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
