"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineRefresh,
} from "react-icons/hi";
import { ProductGridSkeleton } from "@/components/ui/Skeletons";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, cartTotal, isLoaded } = useCart();

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="shimmer h-12 w-64 rounded-xl mb-12" />
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-2/3 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-700 flex gap-6">
                  <div className="shimmer w-28 h-28 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="shimmer h-3 w-1/4 rounded" />
                    <div className="shimmer h-5 w-2/3 rounded" />
                    <div className="shimmer h-4 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-1/3">
              <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-8 border border-charcoal-100 dark:border-charcoal-700 space-y-4">
                <div className="shimmer h-7 w-48 rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-2/3 rounded" />
                <div className="shimmer h-14 w-full rounded-xl mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-[85vh] bg-charcoal-50 dark:bg-charcoal-900 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-32 h-32 bg-white dark:bg-charcoal-800 rounded-full flex items-center justify-center shadow-inner mb-8 border border-charcoal-100 dark:border-charcoal-700">
          <HiOutlineShoppingBag className="w-14 h-14 text-charcoal-300 dark:text-charcoal-600" />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink dark:text-cream-50 mb-4">
          Your Collection is Empty
        </h1>
        <p className="text-charcoal-400 dark:text-charcoal-500 max-w-md mb-10 text-base leading-relaxed">
          You haven't added any masterpieces yet. Browse our galleries to find the perfect addition to your space.
        </p>
        <Link href="/shop" className="btn-dark">
          Explore Gallery
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-24 pt-24 md:pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Page header */}
        <div className="mb-10">
          <p className="label-caps text-gold-600 mb-1">Review</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink dark:text-cream-50">
            Curated Cart
            <span className="text-charcoal-300 dark:text-charcoal-600 ml-3 text-2xl font-medium">({itemCount})</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">

          {/* ── Left: Line Items ──────────────────────────────────────────────── */}
          <div className="w-full lg:w-[60%] flex flex-col gap-4">
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 overflow-hidden shadow-sm divide-y divide-charcoal-50 dark:divide-charcoal-700">

              {/* Column headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-charcoal-50 dark:bg-charcoal-900/50 label-caps">
                <div className="col-span-6">Masterpiece</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1" />
              </div>

              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 px-6 md:px-8 py-6 items-center hover:bg-charcoal-50/50 dark:hover:bg-charcoal-900/30 transition-colors"
                >
                  {/* Product info */}
                  <div className="col-span-1 md:col-span-6 flex gap-5 items-start">
                    <Link href={`/product/${item.slug}`} className="shrink-0">
                      <div className="w-24 h-24 md:w-20 md:h-20 bg-charcoal-100 dark:bg-charcoal-900 rounded-xl overflow-hidden shadow-sm ring-1 ring-charcoal-100 dark:ring-charcoal-700 hover:ring-gold-300 transition-all">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div>
                      <p className="label-caps text-gold-600 mb-0.5">{item.artistName}</p>
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-heading font-bold text-ink dark:text-cream-50 leading-snug hover:text-gold-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      {item.variant ? (
                        <p className="text-xs text-charcoal-400 mt-1">
                          {[item.variant.size, item.variant.frame, item.variant.material]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : (
                        <p className="text-xs text-charcoal-400 mt-1">Standard Edition</p>
                      )}
                      {/* Unit price */}
                      <p className="text-xs text-charcoal-400 mt-1 font-medium">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>

                  {/* Quantity stepper */}
                  <div className="col-span-1 md:col-span-3 flex md:justify-center">
                    <div className="flex items-center bg-charcoal-50 dark:bg-charcoal-900 rounded-xl p-1 h-10 w-fit border border-charcoal-100 dark:border-charcoal-700">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center text-charcoal-500 hover:text-ink dark:hover:text-white hover:bg-white dark:hover:bg-charcoal-800 rounded-lg transition-all font-bold text-lg"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-ink dark:text-cream-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center text-charcoal-500 hover:text-ink dark:hover:text-white hover:bg-white dark:hover:bg-charcoal-800 rounded-lg transition-all font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="col-span-1 md:col-span-2 flex items-center md:justify-end font-bold text-ink dark:text-cream-50">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 md:col-span-1 flex items-center md:justify-end">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-charcoal-300 dark:text-charcoal-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                      title="Remove"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm font-bold text-charcoal-400 hover:text-gold-600 transition-colors w-fit mt-2"
            >
              ← Resume Browsing
            </Link>
          </div>

          {/* ── Right: Order Summary (sticky) ────────────────────────────────── */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-28">
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-7 shadow-sm border border-charcoal-100 dark:border-charcoal-700">
              <h2 className="font-heading text-2xl font-bold text-ink dark:text-cream-50 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-charcoal-600 dark:text-charcoal-300 mb-6 pb-6 border-b border-charcoal-100 dark:border-charcoal-700">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                  <span className="font-bold text-ink dark:text-cream-50">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-charcoal-400 italic text-xs">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST)</span>
                  <span className="text-charcoal-400 italic text-xs">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-charcoal-700 dark:text-charcoal-200">Estimated Total</span>
                <span className="text-3xl font-bold text-ink dark:text-cream-50">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full btn-dark text-base py-4 rounded-xl"
              >
                Proceed to Checkout
                <HiOutlineArrowRight className="w-5 h-5" />
              </button>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-charcoal-100 dark:border-charcoal-700 grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: HiOutlineLockClosed, label: "Secure Checkout" },
                  { icon: HiOutlineShieldCheck, label: "Buyer Protection" },
                  { icon: HiOutlineTruck, label: "Safe Delivery" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Icon className="w-5 h-5 text-charcoal-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-charcoal-400 leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
