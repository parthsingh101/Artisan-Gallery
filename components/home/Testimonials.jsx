"use client";

export default function Testimonials() {
  const reviews = [
    {
      text: "The texture of the oil painting I received is breathtaking. You can truly see the artist's emotion in every stroke. A masterpiece for my living room.",
      author: "Julian Thorne",
      title: "Art Collector, London"
    },
    {
      text: "Artisan Gallery provides a level of curation I haven't seen elsewhere. The digital certificate of authenticity and the white-glove delivery were impeccable.",
      author: "Elena Rossi",
      title: "Interior Designer"
    },
    {
      text: "I commissioned a custom sketch for our anniversary, and the process was seamless. The communication with the artist was personal and professional.",
      author: "Marcus Chen",
      title: "Private Client"
    }
  ];

  return (
    <section className="py-24 bg-cream-50 dark:bg-charcoal-900/80 transition-colors duration-500">
      <div className="container-custom">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gold-600">The Collector's Voice</span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-ink dark:text-white">Galleries & Homes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-white dark:bg-charcoal-800 p-10 rounded-2xl shadow-sm border border-cream-100 dark:border-charcoal-700/50 flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] dark:opacity-[0.1] group-hover:scale-125 transition-transform duration-700">
                <span className="text-8xl font-heading text-gold-500">"</span>
              </div>
              <p className="text-lg font-body italic text-charcoal-700 dark:text-cream-200 leading-relaxed relative z-10 mb-8">
                "{rev.text}"
              </p>
              <div className="mt-auto space-y-1 relative z-10">
                <p className="text-sm font-bold text-ink dark:text-gold-500 uppercase tracking-widest">{rev.author}</p>
                <p className="text-[10px] text-charcoal-400 dark:text-charcoal-500 uppercase font-black">{rev.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
