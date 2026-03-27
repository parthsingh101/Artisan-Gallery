"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (status === "authenticated") {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          setWishlist(data.wishlist || []);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    } else if (status === "unauthenticated") {
      setWishlist([]); // Clear if logged out
    }
    setIsLoading(false);
  }, [status]);

  // Sync with DB whenever auth status changes
  useEffect(() => {
    if (status !== "loading") {
      fetchWishlist();
    }
  }, [status, fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (status !== "authenticated") {
      toast.error("Please log in to save masterpieces to your wishlist.");
      // Could redirect to login here
      return;
    }

    const productId = product._id;
    const isCurrentlySaved = wishlist.some((item) => item._id === productId);

    // Optimistic UI update
    if (isCurrentlySaved) {
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } else {
      setWishlist((prev) => [...prev, product]);
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle wishlist");
      }

      if (data.added) {
         toast.success("Saved to your curated wishlist.", { icon: "🖤" });
      } else {
         toast.success("Removed from wishlist.");
      }

    } catch (err) {
      toast.error(err.message);
      // Revert optimistic update on failure
      fetchWishlist();
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
