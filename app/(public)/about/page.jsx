import Link from "next/link";
import { HiOutlineLightBulb, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi";

export default function AboutPage() {
  const values = [
    {
      title: "Authentic Expression",
      description: "We believe original art is the purest form of human communication. Every piece in our gallery is a direct window into the artist's soul.",
      icon: HiOutlineLightBulb,
    },
    {
      title: "Curation Excellence",
      description: "Our curators hand-select every masterpiece, ensuring a standard of quality and emotional depth that generic prints can never match.",
      icon: HiOutlineSparkles,
    },
    {
      title: "Direct Support",
      description: "By removing middle-men, we ensure that the majority of every acquisition goes directly to the creators, sustaining global artistic communities.",
      icon: HiOutlineUserGroup,
    },
    {
      title: "Lifetime Integrity",
      description: "We provide provenance and care guidance for every acquisition, ensuring your masterpiece remains a treasure for generations.",
      icon: HiOutlineShieldCheck,
    }
  ];

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Elite Header */}
        <div className="max-w-4xl mb-24">
          <p className="text-gold-600 font-extrabold text-[10px] uppercase tracking-[0.4em] mb-4">Our Narrative</p>
          <h1 className="font-heading text-5xl md:text-8xl font-bold text-ink dark:text-cream-50 leading-[0.9] tracking-tighter mb-8">
            Elevating the <span className="text-gold-500 italic font-serif">Human Canvas.</span>
          </h1>
          <p className="text-charcoal-500 dark:text-charcoal-400 text-lg md:text-2xl leading-relaxed font-light">
            Artisan Gallery was founded on a simple, radical premise: that original art shouldn't be a luxury reserved for the few, but a vital connection accessible to the curious.
          </p>
        </div>

        {/* Visual Break / Mission Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-huge">
            <img 
              src="https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&q=80&w=1200" 
              alt="Artisan at work" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-serif italic text-xl">"Every brushstroke is a decision made by a human heart."</p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="font-heading text-4xl font-bold text-ink dark:text-cream-50 italic">Bridging the Studio and the Sanctum</h2>
            <p className="text-charcoal-600 dark:text-charcoal-400 leading-relaxed text-lg">
              We started in a small atelier in Varanasi, witnessing the struggle of master painters to find global collectors who valued depth over speed. Today, we are a global bridge, connecting visionary creators from remote studios to the halls of discerning collectors.
            </p>
            <p className="text-charcoal-600 dark:text-charcoal-400 leading-relaxed text-lg">
              Our platform isn't just a store; it's a testament to the enduring power of manual craft in a digital age. We value the texture of oil, the bleed of watercolor, and the scratch of charcoal.
            </p>
            <div className="pt-8">
              <Link href="/shop" className="btn-dark px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-xl">Explore Open Gallery</Link>
            </div>
          </div>
        </div>

        {/* Core Philosophy Grid */}
        <div className="mb-32">
          <h2 className="font-heading text-3xl font-bold text-ink dark:text-cream-50 text-center mb-16 underline decoration-gold-500/30 underline-offset-8">Our Core Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-white dark:bg-charcoal-800 p-8 rounded-[2rem] border border-charcoal-100 dark:border-charcoal-700 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-gold-50 dark:bg-gold-900/20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <v.icon className="w-7 h-7 text-gold-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50 mb-3">{v.title}</h3>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join the Narrative CTA */}
        <div className="bg-ink dark:bg-black p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-600 via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-cream-50 mb-8 leading-tight">Be part of the <span className="text-gold-500">artistic legacy.</span></h2>
            <p className="text-charcoal-400 text-lg mb-12 leading-relaxed">Whether you are an established collector or acquiring your first original, we are here to guide your journey into the world of authentic expression.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/register" className="bg-gold-600 hover:bg-gold-700 text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all">Join the Collector's Circle</Link>
               <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all backdrop-blur-sm border border-white/20">Contact Curator</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
