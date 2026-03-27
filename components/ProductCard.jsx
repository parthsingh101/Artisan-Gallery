import Link from "next/link";
import { HiOutlineHeart, HiOutlineEye } from "react-icons/hi";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ product }) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/placeholder-art.jpg";
  const isSale = product.salePrice && product.salePrice < product.price;
  const savings = isSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-white dark:bg-charcoal-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-charcoal-900/10 dark:hover:shadow-charcoal-900/40 hover:-translate-y-1.5 transition-all duration-300 border border-charcoal-100 dark:border-charcoal-700 hover:border-gold-200/60 dark:hover:border-gold-600/20">
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-100 dark:bg-charcoal-900">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {Boolean(isSale) && (
            <span className="bg-red-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md animate-fade-in">
              -{savings}% OFF
            </span>
          )}
          {Boolean(product.bestseller) && (
            <span className="bg-gold-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md animate-fade-in">
              Bestseller
            </span>
          )}
          {Boolean(product.featured && !product.bestseller) && (
            <span className="bg-ink/80 dark:bg-cream-50/90 text-white dark:text-ink text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md animate-fade-in">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist — top right, visible on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <WishlistButton
            product={product}
            className="w-9 h-9 p-2 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
          />
        </div>

        {/* Bottom CTA on hover */}
        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-sm text-ink dark:text-cream-50 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-600 hover:text-white dark:hover:bg-gold-500 transition-all shadow-lg"
          >
            <HiOutlineEye className="w-4 h-4" />
            View Masterpiece
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="label-caps text-gold-600 dark:text-gold-400 mb-1.5">
          {product.category?.name || "Art"} · {product.productType}
        </p>
        
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-heading text-lg font-bold text-ink dark:text-cream-50 leading-snug group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <p className="text-charcoal-500 dark:text-charcoal-400 text-xs mt-1 font-medium">
          {product.artistName}
        </p>

        {/* Price Row */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {isSale ? (
              <>
                <span className="text-xl font-bold text-ink dark:text-cream-50">
                  ₹{product.salePrice.toLocaleString()}
                </span>
                <span className="text-sm text-charcoal-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-ink dark:text-cream-50">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock dot */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest">
              {product.stock > 0 ? "Available" : "Sold"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
