"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const syncTimeoutRef = useRef(null);

  // ── Sync Cart to DB ────────────────────────────────────────────────────────
  const syncCartToDB = useCallback(async (currentCart) => {
    if (status !== "authenticated") return;

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: currentCart }),
      });
    } catch (err) {
      console.error("Failed to sync cart to DB:", err);
    }
  }, [status]);

  // Debounced Sync
  const debouncedSync = useCallback((currentCart) => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncCartToDB(currentCart);
    }, 1000); // 1s debounce
  }, [syncCartToDB]);

  // ── Initial Load & Auth Change ─────────────────────────────────────────────
  useEffect(() => {
    const initCart = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            setCart(data.cart || []);
          }
        } catch (err) {
          console.error("Error fetching cart from DB:", err);
        }
      } else if (status === "unauthenticated") {
        setCart([]); // Reset for guests (no localStorage persistence)
      }
      setIsLoaded(true);
    };

    if (status !== "loading") {
      initCart();
    }
  }, [status]);

  // ── Cart Actions ────────────────────────────────────────────────────────────
  const addToCart = (productPayload, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.cartItemId === productPayload.cartItemId);
      let newCart;
      if (existingItem) {
        newCart = prev.map((item) =>
          item.cartItemId === productPayload.cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev, { ...productPayload, quantity }];
      }
      
      if (status === "authenticated") debouncedSync(newCart);
      return newCart;
    });
    toast.success("Added to your collection");
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.cartItemId !== cartItemId);
      if (status === "authenticated") syncCartToDB(newCart);
      return newCart;
    });
    toast.success("Removed from cart");
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return removeFromCart(cartItemId);
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
      if (status === "authenticated") debouncedSync(newCart);
      return newCart;
    });
  };

  const clearCart = async () => {
    setCart([]);
    if (status === "authenticated") {
      await syncCartToDB([]);
    }
  };

  // ── Calculations ────────────────────────────────────────────────────────────
  const cartTotal = cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const cartCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
