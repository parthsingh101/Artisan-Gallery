"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineHeart, HiOutlineMenuAlt3, HiOutlineX, HiChevronDown } from "react-icons/hi";
import { RiLogoutBoxLine, RiDashboardLine } from "react-icons/ri";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const { data: session } = useSession();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Navbar category fetch failed:", err);
      }
    };

    window.addEventListener("scroll", handleScroll);
    fetchCategories();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md shadow-sm py-2" 
        : "bg-white dark:bg-charcoal-900 py-4"
    } border-b border-cream-100 dark:border-charcoal-800`}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex flex-col items-center md:items-start" onClick={() => setIsOpen(false)}>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-ink dark:text-cream-50 group-hover:text-gold-600 transition-colors uppercase">
            Artisan
          </h1>
          <p className="hidden md:block text-[9px] uppercase tracking-[0.2em] text-charcoal-400 dark:text-charcoal-500 -mt-1 font-body">
            Original Masterpieces
          </p>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10 font-body text-xs font-bold uppercase tracking-widest text-charcoal-700 dark:text-cream-200">
          <Link href="/" className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors">Shop All</Link>
          
          {/* Categories Dropdown */}
          <div className="relative group/cat">
            <button className="flex items-center gap-1 hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
              Collections <HiChevronDown className="w-3 h-3 transition-transform group-hover/cat:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-4 w-56 bg-white dark:bg-charcoal-800 border border-cream-100 dark:border-charcoal-700 rounded-lg shadow-xl py-3 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 transform translate-y-2 group-hover/cat:translate-y-0 z-[60]">
               {categories.length > 0 ? categories.map((cat) => (
                 <Link 
                   key={cat._id} 
                   href={`/category/${cat.slug}`} 
                   className="block px-6 py-2.5 text-[11px] text-charcoal-600 dark:text-cream-300 hover:bg-cream-50 dark:hover:bg-charcoal-700 hover:text-gold-600 dark:hover:text-gold-400 transition-all font-bold"
                 >
                   {cat.name}
                 </Link>
               )) : (
                 <p className="px-6 py-2.5 text-[10px] text-charcoal-400 italic">No collections yet</p>
               )}
            </div>
          </div>
          
          <Link href="/about" className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors">About</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-5">
          <ThemeToggle />
          
          <Link href="/wishlist" className="hidden sm:flex items-center justify-center w-10 h-10 text-charcoal-600 dark:text-charcoal-300 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/10 rounded-full transition-all p-2" title="Wishlist">
            <HiOutlineHeart className="w-5 h-5" />
          </Link>
          
          <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 text-charcoal-600 dark:text-charcoal-300 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/10 rounded-full transition-all p-2" title="Cart">
            <HiOutlineShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 font-extrabold shadow-md animate-scale-in">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          
          {/* User Account / Login */}
          <div className="relative">
            {session ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onMouseEnter={() => setUserMenuOpen(true)}
                  className="flex items-center gap-2 p-2 text-charcoal-700 dark:text-cream-200 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name} className="w-8 h-8 rounded-full border border-cream-200 dark:border-charcoal-700 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cream-100 dark:bg-charcoal-800 flex items-center justify-center border border-cream-200 dark:border-charcoal-700">
                      <HiOutlineUser className="w-5 h-5 text-gold-600" />
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-charcoal-800 border border-cream-200 dark:border-charcoal-700 rounded-lg shadow-xl py-2 animate-fade-in z-[70] overflow-hidden"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-5 py-4 border-b border-cream-100 dark:border-charcoal-700 mb-1 bg-cream-50/30 dark:bg-charcoal-800/50">
                      <p className="text-xs font-bold text-ink dark:text-cream-50 truncate">{session.user.name}</p>
                      <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400 truncate mt-0.5">{session.user.email}</p>
                      {session.user.role === 'admin' && (
                        <span className="mt-2 inline-block bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter shadow-sm border border-gold-200/50 dark:border-gold-800/50 scale-90 -translate-x-1">Administrator</span>
                      )}
                    </div>

                    {session.user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold text-charcoal-700 dark:text-cream-200 hover:bg-cream-50 dark:hover:bg-charcoal-700 hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                        <RiDashboardLine className="w-4 h-4 text-gold-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link href="/account" className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold text-charcoal-700 dark:text-cream-200 hover:bg-cream-50 dark:hover:bg-charcoal-700 hover:text-gold-600 dark:hover:text-gold-400 transition-colors" onClick={() => setUserMenuOpen(false)}>
                      <HiOutlineUser className="w-4 h-4" />
                      Account Settings
                    </Link>

                    <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <RiLogoutBoxLine className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 bg-ink dark:bg-cream-100 text-white dark:text-charcoal-900 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold-600 dark:hover:bg-gold-400 dark:hover:text-white transition-all duration-200 shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
          
          <button 
            className="lg:hidden text-charcoal-700 dark:text-cream-200 p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-white/98 dark:bg-charcoal-900/98 backdrop-blur-md z-40 p-8 space-y-8 animate-slide-in-left overflow-y-auto border-t border-charcoal-100 dark:border-charcoal-800">
          <div className="space-y-6">
            <Link href="/" className="block text-2xl font-heading font-bold" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/shop" className="block text-2xl font-heading font-bold" onClick={() => setIsOpen(false)}>Art Shop</Link>
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-charcoal-400 font-bold border-b border-cream-100 dark:border-charcoal-800 pb-2">Collections</p>
              {categories.map(cat => (
                <Link key={cat._id} href={`/category/${cat.slug}`} className="block text-lg font-body" onClick={() => setIsOpen(false)}>{cat.name}</Link>
              ))}
            </div>
            <Link href="/about" className="block text-2xl font-heading font-bold" onClick={() => setIsOpen(false)}>Our Story</Link>
          </div>
          
          <hr className="border-cream-100 dark:border-charcoal-800" />
          
          <div className="space-y-4">
            {!session ? (
              <Link href="/login" className="block text-center bg-gold-500 text-white py-4 rounded-lg font-bold tracking-widest uppercase text-sm" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            ) : (
              <div className="space-y-3">
                <Link href="/account" className="block text-lg font-heading" onClick={() => setIsOpen(false)}>My Profile</Link>
                {session.user.role === 'admin' && (
                  <Link href="/admin" className="block text-lg font-heading text-gold-600" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                )}
                <button 
                  onClick={() => signOut()}
                  className="w-full text-left text-lg font-heading text-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
