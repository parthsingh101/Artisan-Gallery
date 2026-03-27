"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineShoppingCart, HiOutlineShieldCheck, HiOutlineTruck } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";

export default function ProductForm({ product }) {
  const router = useRouter();
  // If undefined variants, default to an empty array
  const variants = product.variants || [];
  const { addToCart } = useCart();
  
  // State for variant selection if forms exist
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(variants.length > 0 ? 0 : null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Derived active variant
  const activeVariant = selectedVariantIdx !== null ? variants[selectedVariantIdx] : null;

  // Calculate dynamic price based on base price + variant extraPrice
  const basePrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const originalPrice = product.price;
  
  const additionalCost = activeVariant ? (activeVariant.extraPrice || 0) : 0;
  
  const finalPrice = basePrice + additionalCost;
  const displayOriginalPrice = originalPrice + additionalCost;
  
  const isSale = product.salePrice && product.salePrice < product.price;
  
  // Max available stock (considering variant stock if applicable)
  const availableStock = activeVariant 
    ? (activeVariant.stock !== undefined ? activeVariant.stock : product.stock)
    : product.stock;

  const getPayload = () => {
    const variantIdStr = activeVariant 
      ? `-${activeVariant.size || 'std'}-${activeVariant.frame || 'none'}-${activeVariant.material || 'none'}`
      : '-base';
    const cartItemId = `${product._id}${variantIdStr}`;
    const primaryImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || "/placeholder-art.jpg";

    return {
      cartItemId,
      productId: product._id,
      slug: product.slug,
      title: product.title,
      artistName: product.artistName,
      price: finalPrice,
      image: primaryImage,
      variant: activeVariant,
    };
  };

  const handleAddToCart = async () => {
    if (availableStock < 1) {
      toast.error("This masterpiece is currently out of stock.");
      return;
    }
    
    setIsAdding(true);
    addToCart(getPayload(), quantity);
    
    setTimeout(() => {
      toast.success("Masterpiece added to your curated cart.");
      setIsAdding(false);
    }, 400);
  };

  const handleBuyNow = () => {
    if (availableStock < 1) {
      toast.error("This masterpiece is currently out of stock.");
      return;
    }
    
    addToCart(getPayload(), quantity);
    router.push("/checkout");
  };

  const increaseQuantity = () => {
    if (quantity < availableStock) setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-charcoal-800 p-8 rounded-3xl shadow-sm border border-charcoal-100 dark:border-charcoal-700">
      
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
           <p className="text-[10px] font-extrabold text-gold-600 uppercase tracking-widest">
             {product.artistName}
           </p>
           {/* Dynamic Stock Indicator */}
           {availableStock > 0 ? (
             <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
               {availableStock} Available
             </span>
           ) : (
             <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
               Out of Stock
             </span>
           )}
        </div>
        <h1 className="font-heading text-4xl font-bold text-ink dark:text-cream-50 leading-tight mb-4">
          {product.title}
        </h1>
        
        {/* Dynamic Pricing Engine */}
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-ink dark:text-cream-50">₹{finalPrice.toLocaleString()}</span>
          {isSale && (
            <span className="text-lg font-bold text-charcoal-400 line-through mb-1">₹{displayOriginalPrice.toLocaleString()}</span>
          )}
        </div>
        
        <p className="text-charcoal-400 text-xs mt-2 italic">Taxes and shipping calculated at checkout.</p>
      </div>

      <hr className="border-charcoal-100 dark:border-charcoal-700 mb-8" />

      {/* Dynamic Variant Matrix Selection */}
      {variants.length > 0 && (
        <div className="mb-8 space-y-6">
          <h3 className="text-sm font-bold text-ink dark:text-cream-50 flex items-center justify-between">
            <span>Select Edition Specification</span>
          </h3>
          <div className="flex flex-col gap-3">
            {variants.map((variant, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedVariantIdx(idx)}
                className={`flex flex-col sm:flex-row sm:items-center justify-between text-left px-5 py-4 rounded-xl border transition-all ${
                  selectedVariantIdx === idx 
                    ? "border-gold-500 bg-gold-50/50 dark:bg-gold-500/10 shadow-md" 
                    : "border-charcoal-100 dark:border-charcoal-700 hover:border-gold-300"
                }`}
              >
                <div className="flex flex-col">
                  <span className={`font-bold ${selectedVariantIdx === idx ? 'text-ink dark:text-white' : 'text-charcoal-600 dark:text-charcoal-300'}`}>
                    {variant.size || "Standard Size"}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {variant.material && <span className="text-xs text-charcoal-500 uppercase tracking-wider">{variant.material}</span>}
                    {variant.material && variant.frame && <span className="text-charcoal-300">&bull;</span>}
                    {variant.frame && <span className="text-xs text-charcoal-500 uppercase tracking-wider">{variant.frame} Frame</span>}
                  </div>
                </div>
                {variant.extraPrice > 0 && (
                  <span className={`text-sm font-bold mt-2 sm:mt-0 ${selectedVariantIdx === idx ? 'text-gold-600' : 'text-charcoal-400'}`}>
                    +₹{variant.extraPrice.toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="mt-auto space-y-4">
        <div className="flex gap-4">
           {/* Quantity Selector */}
           <div className="flex items-center bg-charcoal-50 dark:bg-charcoal-900 rounded-xl p-1 h-14">
             <button onClick={decreaseQuantity} disabled={quantity <= 1} className="w-10 h-full flex items-center justify-center text-charcoal-500 hover:text-ink hover:bg-white dark:hover:bg-charcoal-800 rounded-lg transition-all disabled:opacity-30">-</button>
             <span className="w-10 h-full flex items-center justify-center font-bold text-ink dark:text-cream-50">{quantity}</span>
             <button onClick={increaseQuantity} disabled={quantity >= availableStock} className="w-10 h-full flex items-center justify-center text-charcoal-500 hover:text-ink hover:bg-white dark:hover:bg-charcoal-800 rounded-lg transition-all disabled:opacity-30">+</button>
           </div>
           
           {/* Add to Cart */}
           <button 
            onClick={handleAddToCart}
            disabled={isAdding || availableStock < 1}
            className="flex-1 flex items-center justify-center gap-2 bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-100 dark:border-charcoal-700 text-ink dark:text-cream-50 font-bold rounded-xl h-14 hover:bg-charcoal-100 transition-all shadow-sm disabled:opacity-50"
           >
             {isAdding ? <div className="w-5 h-5 border-2 border-charcoal-500 border-t-charcoal-800 rounded-full animate-spin" /> : (
               <>
                 <HiOutlineShoppingCart className="w-5 h-5" />
                 Add to Cart
               </>
             )}
           </button>
           
           {/* Wishlist Integration */}
           <WishlistButton 
             product={product} 
             className="w-14 h-14 bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-100 dark:border-charcoal-700 rounded-xl shadow-sm p-3.5"
           />
        </div>

        {/* Buy Now Pipeline */}
        <button 
          onClick={handleBuyNow}
          disabled={availableStock < 1}
          className="w-full h-14 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-xl shadow-xl shadow-gold-600/20 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
        >
          Acquire Masterpiece
        </button>
      </div>

      {/* Trust & Shipping Logic */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-charcoal-50 dark:border-charcoal-700">
        <div className="flex items-center gap-2 text-charcoal-500 text-xs font-bold uppercase tracking-widest">
          <HiOutlineShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Authenticity Guaranteed</span>
        </div>
        <div className="flex items-center gap-2 text-charcoal-500 text-xs font-bold uppercase tracking-widest">
          <HiOutlineTruck className="w-5 h-5 text-gold-500" />
          <span>Secure Shipping</span>
        </div>
      </div>
    </div>
  );
}
