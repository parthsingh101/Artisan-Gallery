import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ title, subtitle, products = [], limit = 4, columns = 4 }) {
  // If no products, return null or empty state if desired, 
  // but HomePage fetch should usually provide data.
  if (products.length === 0) return null;

  const displayProducts = products.slice(0, limit);

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="py-24 bg-transparent">
      <div className="container-custom">
        {title && (
          <div className="mb-16 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold-600 font-bold mb-3">{subtitle}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink dark:text-cream-50">{title}</h2>
            <div className="h-1 w-20 bg-gold-500 mt-6 rounded-full opacity-30" />
          </div>
        )}
        
        <div className={`grid ${gridCols} gap-8 md:gap-10`}>
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
