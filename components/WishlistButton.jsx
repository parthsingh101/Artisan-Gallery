"use client";

import { useWishlist } from "@/context/WishlistContext";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";

export default function WishlistButton({ product, className = "" }) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();
  const isSaved = isInWishlist(product._id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center transition-all duration-200 group ${className} ${
        isSaved
          ? "text-red-500 bg-red-50 dark:bg-red-500/10"
          : "text-charcoal-400 dark:text-charcoal-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
      }`}
      aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {isSaved ? (
        <HiHeart className="w-full h-full transition-transform duration-200 group-hover:scale-110 drop-shadow-sm" />
      ) : (
        <HiOutlineHeart className="w-full h-full transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
      )}
    </button>
  );
}
