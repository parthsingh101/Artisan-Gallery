"use client";

import Link from "next/link";
import { HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi";

export default function ProductCard({ product }) {
  const { id = 1, name = "Original Artwork", artist = "Anonymous Artist", price = 250, image, category = "Painting" } = product || {};

  return (
    <div className="group relative bg-white dark:bg-charcoal-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-cream-100 dark:border-charcoal-700/50">
      {/* Image Area */}
      <div className="aspect-[4/5] relative overflow-hidden bg-cream-50 dark:bg-charcoal-900">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal-200 dark:text-charcoal-700">
             {/* Abstract placeholder pattern */}
             <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 via-transparent to-transparent" />
             <span className="text-[10px] uppercase tracking-widest font-bold">No Image Available</span>
          </div>
        )}

        {/* Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
          <button className="w-12 h-12 rounded-full bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-cream-50 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-all transform hover:scale-110 shadow-lg" title="Add to Wishlist">
            <HiOutlineHeart className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-cream-50 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-all transform hover:scale-110 shadow-lg" title="Add to Cart">
            <HiOutlineShoppingBag className="w-6 h-6" />
          </button>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest text-gold-600 rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/product/${id}`} className="block group-hover:text-gold-600 transition-colors">
            <h3 className="font-heading text-lg font-bold text-ink dark:text-cream-50 leading-tight truncate">
              {name}
            </h3>
          </Link>
          <p className="font-body text-charcoal-900 dark:text-gold-400 font-bold ml-2">
            ${price}
          </p>
        </div>
        <p className="text-xs text-charcoal-500 dark:text-charcoal-400 font-body uppercase tracking-wider font-medium">
          by {artist}
        </p>

        <Link 
          href={`/product/${id}`}
          className="mt-5 block w-full py-3 text-center text-[10px] font-bold uppercase tracking-widest border border-cream-200 dark:border-charcoal-700 text-charcoal-700 dark:text-cream-300 hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all rounded-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
