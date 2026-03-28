"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { HiCheck, HiOutlineReceiptTax, HiOutlineTruck } from "react-icons/hi";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart, isLoaded } = useCart();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (isLoaded && !cleared && orderId) {
      clearCart();
      setCleared(true);
    }
  }, [isLoaded, cleared, orderId, clearCart]);

  if (!orderId) {
    router.push("/shop");
    return null;
  }

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-white dark:bg-charcoal-800 rounded-3xl p-8 md:p-12 shadow-sm border border-charcoal-100 dark:border-charcoal-700 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gold-50 dark:bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-24 h-24 mx-auto bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <HiCheck className="w-12 h-12" />
        </div>

        <h1 className="font-heading text-3xl md:text-5xl font-bold text-ink dark:text-cream-50 mb-4">
          Acquisition Secured
        </h1>
        
        <p className="text-charcoal-500 dark:text-charcoal-400 mb-8 max-w-md mx-auto leading-relaxed text-sm md:text-base">
          Thank you for choosing Artisan Gallery. Your transaction has been securely vaulted. Our curators will begin preparing your masterpiece.
        </p>

        <div className="bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-6 mb-10 text-left border border-charcoal-100 dark:border-charcoal-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-charcoal-400">Ledger Identifier</span>
              <span className="font-mono text-sm font-bold text-ink dark:text-cream-50">{orderId}</span>
            </div>
            <div className="flex flex-col gap-1 md:items-end">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-charcoal-400 w-full md:text-right">Digital Receipt</span>
              <span className="flex items-center gap-1.5 text-sm text-ink dark:text-cream-50 font-medium">
                <HiOutlineReceiptTax className="w-4 h-4 text-gold-600" /> Dispatched to Email
              </span>
            </div>
          </div>
          
          <hr className="my-6 border-charcoal-100 dark:border-charcoal-800" />
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white dark:bg-charcoal-800 rounded-xl shadow-sm text-charcoal-500 shrink-0">
              <HiOutlineTruck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-cream-50 mb-1">Transit Protocol Initiated</h3>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
                You will receive tracking intelligence via email within 2-3 business days once the white-glove packaging is finalized.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link 
            href="/shop" 
            className="bg-gold-600 hover:bg-gold-700 text-white font-bold py-4 px-10 rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl shadow-gold-600/20 inline-block"
          >
            Return to Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
