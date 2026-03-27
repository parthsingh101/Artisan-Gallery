"use client";

import Link from "next/link";

export default function PromoBanner({ settings = {} }) {
  const {
    promoTitle = "Original Art, No Mass Production.",
    promoSubtitle = "We partner directly with artists to ensure every piece in our gallery is 100% original. No prints, no reproductions—just raw, human expression delivered to your door with a certificate of authenticity.",
    promoImage
  } = settings;

  return (
    <section className="py-24 bg-charcoal-900 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-500/5 -skew-x-12 transform translate-x-1/4" />
      
      <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 aspect-video bg-charcoal-800 rounded-2xl p-1 shadow-2xl overflow-hidden relative group">
           <div className="w-full h-full bg-charcoal-900 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(201,162,39,0.1),_transparent)]" />
              {promoImage ? (
                <img src={promoImage} alt="Premium Banner" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="text-center p-12 space-y-4">
                   <h3 className="text-gold-500 font-heading text-4xl italic">Handcrafted</h3>
                   <p className="text-charcoal-400 text-xs uppercase tracking-widest font-bold">The Artisan Promise</p>
                </div>
              )}
              {/* Dynamic grain overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]" />
           </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-8 animate-fade-in pl-0 lg:pl-10">
          <div className="inline-block px-4 py-1 bg-gold-900/40 border border-gold-800/50 rounded-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">Exclusive Curator's Choice</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight whitespace-pre-line">
            {promoTitle}
          </h2>
          <p className="text-lg text-charcoal-300 font-body leading-relaxed max-w-xl">
            {promoSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 pt-4">
             <div className="space-y-1">
                <p className="text-2xl font-heading font-bold text-white">100%</p>
                <p className="text-[9px] uppercase tracking-widest text-charcoal-500 font-bold">Authentication</p>
             </div>
             <div className="h-12 w-[1px] bg-charcoal-800 hidden sm:block" />
             <div className="space-y-1">
                <p className="text-2xl font-heading font-bold text-white">Global</p>
                <p className="text-[9px] uppercase tracking-widest text-charcoal-500 font-bold">White-Glove Shipping</p>
             </div>
             <div className="h-12 w-[1px] bg-charcoal-800 hidden sm:block" />
             <div className="space-y-1">
                <p className="text-2xl font-heading font-bold text-white">Secure</p>
                <p className="text-[9px] uppercase tracking-widest text-charcoal-500 font-bold">Investment Grade</p>
             </div>
          </div>
          <Link href="/about" className="inline-flex items-center gap-3 text-gold-500 font-bold uppercase tracking-widest text-xs group hover:text-white transition-all">
             Meet Our Artists <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
