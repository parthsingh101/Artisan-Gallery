"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { ProductGridSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    // Determine default primary image
    const primaryImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || "/placeholder-art.jpg";
    
    // Determine base variant
    const activeVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    const variantIdStr = activeVariant 
      ? `-${activeVariant.size || 'std'}-${activeVariant.frame || 'none'}-${activeVariant.material || 'none'}`
      : '-base';
      
    const cartItemId = `${product._id}${variantIdStr}`;
    
    const basePrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    const additionalCost = activeVariant ? (activeVariant.extraPrice || 0) : 0;

    const payload = {
      cartItemId,
      productId: product._id,
      slug: product.slug,
      title: product.title,
      artistName: product.artistName,
      price: basePrice + additionalCost,
      image: primaryImage,
      variant: activeVariant,
    };

    addToCart(payload, 1);
    toggleWishlist(product); // Remove from wishlist since it moved to cart
    toast.success("Masterpiece moved to your cart.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="shimmer h-12 w-72 rounded-xl mb-4" />
          <div className="shimmer h-4 w-40 rounded mb-10" />
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[85vh] bg-charcoal-50 dark:bg-charcoal-900 flex items-center justify-center">
        <EmptyState
          icon={<HiOutlineHeart className="w-10 h-10" />}
          title="Your Favorites are Empty"
          message="You haven't saved any masterpieces yet. Click the heart icon on any artwork to build your personal collection."
          actionLabel="Explore Gallery"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-charcoal-100 dark:border-charcoal-700 pb-6 gap-4">
           <div>
             <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink dark:text-cream-50 mb-2">
               Curated Favorites
             </h1>
             <p className="text-charcoal-500 font-bold uppercase tracking-widest text-xs">
               {wishlist.length} {wishlist.length === 1 ? 'Masterpiece' : 'Masterpieces'} Saved
             </p>
           </div>
           <Link href="/cart" className="text-sm font-bold text-charcoal-500 hover:text-gold-600 transition-colors">
              View Cart &rarr;
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {wishlist.map((product) => (
            <div key={product._id} className="relative group flex flex-col">
              <ProductCard product={product} />
              
              {/* Move to Cart overlay logic */}
              <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 hidden md:block">
                 <button 
                  onClick={() => handleMoveToCart(product)}
                  className="w-full flex items-center justify-center gap-2 bg-ink dark:bg-cream-50 text-white dark:text-ink hover:bg-gold-600 dark:hover:bg-gold-500 hover:text-white transition-all font-bold py-3 rounded-xl shadow-xl hover:shadow-gold-600/20 text-xs uppercase tracking-widest"
                 >
                   <HiOutlineShoppingCart className="w-4 h-4" /> Move to Cart
                 </button>
              </div>
              
              {/* Mobile direct add to cart */}
              <button 
                onClick={() => handleMoveToCart(product)}
                className="md:hidden mt-4 flex items-center justify-center gap-2 border border-charcoal-200 dark:border-charcoal-700 text-ink dark:text-cream-50 font-bold py-3 rounded-xl text-xs uppercase tracking-widest"
               >
                 <HiOutlineShoppingCart className="w-4 h-4" /> Move to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
