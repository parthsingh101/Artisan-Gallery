"use client";

export default function Newsletter() {
  return (
    <section className="py-20 bg-gold-500 relative overflow-hidden">
      {/* Abstract Artistic Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-white/50 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-custom relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-md text-ink">
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight mb-4">
            Join the Inner Circle.
          </h2>
          <p className="text-sm font-body font-medium leading-relaxed opacity-80">
            Subscribe to our weekly curation for early access to new collections, exclusive artist interviews, and invitations to private exhibitions.
          </p>
        </div>

        <div className="w-full max-w-md">
          <form className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl shadow-2xl" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="curated@email.com" 
              className="flex-grow px-6 py-4 text-xs font-bold uppercase tracking-widest text-ink focus:outline-none rounded-lg bg-transparent"
            />
            <button className="bg-ink text-white px-8 py-4 rounded-lg text-[10px] uppercase font-black tracking-widest hover:bg-charcoal-800 transition-all active:scale-95 shadow-lg">
               Subscribe
            </button>
          </form>
          <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-ink/60 mt-4 text-center md:text-left">
            Respect for your inbox. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
