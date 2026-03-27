"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineCreditCard, HiOutlineCash } from "react-icons/hi";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, isLoaded } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India", // Default MVP
  });

  const [paymentMethod, setPaymentMethod] = useState("Demo Online Payment");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && isLoaded && cart.length === 0) {
      toast.error("Your cart is empty. Please select masterpieces to checkout.");
      router.push("/shop");
    }
  }, [mounted, isLoaded, cart, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Minor client validation (HTML5 required attributes handle most)
    if (!formData.fullName || !formData.email || !formData.addressLine1 || !formData.city || !formData.postalCode) {
      toast.error("Please explicitly fill all required transit details.");
      setIsSubmitting(false);
      return;
    }

    // Format Payload
    const payload = {
      items: cart.map(item => ({
        cartItemId: item.cartItemId,
        productId: item.productId,
        title: item.title,
        artistName: item.artistName,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        variant: item.variant || null
      })),
      shippingAddress: formData,
      paymentMethod,
      taxPrice: 0, 
      shippingPrice: 0, 
      subtotal: cartTotal,
      total: cartTotal, 
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process acquisition.");
      }

      toast.success("Acquisition initiated. Processing secure protocol.", { icon: "🔐" });
      router.push(`/checkout/success?orderId=${data.orderId}`);
      
    } catch (err) {
      toast.error(err.message);
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isLoaded || cart.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pt-32 flex justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent flex flex-col items-center justify-center rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink dark:text-cream-50 mb-4">
          Secure Checkout
        </h1>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal-400 mb-12">
          <HiOutlineShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Transit Protocol</span>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left: Shipping & Payment Intake */}
          <div className="w-full lg:w-2/3 flex flex-col gap-12">
            
            {/* Contact & Shipping Details */}
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 md:p-8 shadow-sm border border-charcoal-100 dark:border-charcoal-700">
              <h2 className="font-heading text-2xl font-bold text-ink dark:text-cream-50 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gold-50 dark:bg-gold-500/10 text-gold-600 flex items-center justify-center text-sm">1</span>
                Transit Destination
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">Recipient Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none" placeholder="First and Last Name" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none" placeholder="For receipt and tracking" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none" placeholder="For courier coordination" />
                </div>

                <div className="md:col-span-2 mt-4 pt-4 border-t border-charcoal-100 dark:border-charcoal-700">
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">Address Line 1</label>
                  <input required name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} type="text" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none" placeholder="Street address, building, company" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">Address Line 2 <span className="text-charcoal-300 dark:text-charcoal-600">(Optional)</span></label>
                  <input name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} type="text" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none" placeholder="Apartment, suite, unit, etc." />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">City</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">State / Province</label>
                  <input required name="state" value={formData.state} onChange={handleInputChange} type="text" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">Postal Code</label>
                  <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-500 tracking-widest uppercase mb-2">Country</label>
                  <select required name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all outline-none appearance-none">
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 md:p-8 shadow-sm border border-charcoal-100 dark:border-charcoal-700">
              <h2 className="font-heading text-2xl font-bold text-ink dark:text-cream-50 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gold-50 dark:bg-gold-500/10 text-gold-600 flex items-center justify-center text-sm">2</span>
                Valuation Settlement
              </h2>

              <div className="flex flex-col gap-4 text-sm mt-4">
                {/* Method 1: Demo Cyber */}
                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Demo Online Payment' ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-500/10 shadow-sm' : 'border-charcoal-100 dark:border-charcoal-700 hover:border-charcoal-300'}`}>
                  <div className="mt-1">
                    <input type="radio" value="Demo Online Payment" checked={paymentMethod === 'Demo Online Payment'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-gold-600 focus:ring-gold-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${paymentMethod === 'Demo Online Payment' ? 'text-ink dark:text-white' : 'text-charcoal-600 dark:text-charcoal-300'}`}>Demo Visa / Mastercard / Cyber</span>
                      <HiOutlineCreditCard className={`w-5 h-5 ${paymentMethod === 'Demo Online Payment' ? 'text-gold-600' : 'text-charcoal-400'}`} />
                    </div>
                    <p className="text-charcoal-500 dark:text-charcoal-400 text-xs leading-relaxed">Simulated premium Stripe routing. Validates instantly as payment successful for MVP demonstration.</p>
                  </div>
                </label>

                {/* Method 2: COD */}
                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-500/10 shadow-sm' : 'border-charcoal-100 dark:border-charcoal-700 hover:border-charcoal-300'}`}>
                  <div className="mt-1">
                    <input type="radio" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-gold-600 focus:ring-gold-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${paymentMethod === 'Cash on Delivery' ? 'text-ink dark:text-white' : 'text-charcoal-600 dark:text-charcoal-300'}`}>White Glove On-Delivery</span>
                      <HiOutlineCash className={`w-5 h-5 ${paymentMethod === 'Cash on Delivery' ? 'text-gold-600' : 'text-charcoal-400'}`} />
                    </div>
                    <p className="text-charcoal-500 dark:text-charcoal-400 text-xs leading-relaxed">Pay via cashier's check or premium electronic transfer ONLY upon strict physical inspection of the curated piece at your estate.</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right: Persisted Cart Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 md:p-8 shadow-sm border border-charcoal-100 dark:border-charcoal-700 sticky top-24">
              <h2 className="font-heading text-2xl font-bold text-ink dark:text-cream-50 mb-6">Acquisition Matrix</h2>
              
              {/* Line Items Miniature */}
              <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="w-16 h-16 bg-charcoal-50 dark:bg-charcoal-900 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 text-sm justify-center">
                      <span className="font-bold text-ink dark:text-cream-50 truncate max-w-[180px]">{item.title}</span>
                      <div className="flex items-center justify-between mt-1 text-charcoal-500 dark:text-charcoal-400 text-xs">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-bold text-gold-600">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 text-sm mb-6 border-y border-charcoal-100 dark:border-charcoal-700 py-6">
                <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoal-600 dark:text-charcoal-300">
                  <span>Secure Artisan Shipping</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-ink dark:text-cream-50">Final Valuation</span>
                <span className="text-3xl font-bold text-ink dark:text-cream-50">₹{cartTotal.toLocaleString()}</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-ink dark:bg-cream-50 text-white dark:text-ink hover:bg-gold-600 dark:hover:bg-gold-500 hover:text-white transition-all font-bold rounded-xl h-14 uppercase tracking-widest text-sm shadow-xl hover:shadow-gold-600/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-ink border-t-white/30 rounded-full animate-spin" />
                ) : (
                  "Finalize Acquisition"
                )}
              </button>

              <div className="mt-6 flex flex-col gap-2 items-center justify-center text-xs text-charcoal-400 text-center">
                 <div className="flex items-center gap-1.5"><HiOutlineShieldCheck className="w-4 h-4" /> 256-Bit Asset Encryption</div>
                 <div className="flex items-center gap-1.5"><HiOutlineTruck className="w-4 h-4" /> Museum Grade Transit Included</div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
