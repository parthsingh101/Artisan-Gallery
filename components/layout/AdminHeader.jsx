"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { HiOutlineBell, HiOutlineChevronDown, HiOutlineSearch, HiMenuAlt1 } from "react-icons/hi";
import Link from "next/link";

export default function AdminHeader({ setIsMobileOpen }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Simple breadcrumb logic
  const pathSegments = pathname.split("/").filter(seg => seg);
  const breadcrumbs = pathSegments.map((seg, idx) => {
    let name = seg.charAt(0).toUpperCase() + seg.slice(1).replace("-", " ");
    if (name === "Admin" && idx === pathSegments.length - 1) name = "Dashboard";
    return {
      name,
      href: "/" + pathSegments.slice(0, idx + 1).join("/")
    };
  });

  return (
    <header className="h-20 bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-md border-b border-charcoal-100 dark:border-charcoal-800 sticky top-0 z-30 flex items-center justify-between px-6 transition-colors duration-300">
      {/* Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-charcoal-600 hover:bg-charcoal-50 transition-colors"
        >
          <HiMenuAlt1 className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center text-sm font-medium tracking-tight">
           <span className="text-charcoal-400">Admin</span>
           {breadcrumbs.map((crumb, idx) => (
             <div key={idx} className="flex items-center">
               <span className="mx-2 text-charcoal-300">/</span>
               <span className={idx === breadcrumbs.length - 1 ? "text-ink dark:text-cream-50 font-bold" : "text-charcoal-500"}>
                 {crumb.name}
               </span>
             </div>
           ))}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-3 bg-charcoal-50 dark:bg-charcoal-800 px-4 py-2 rounded-xl border border-charcoal-100 dark:border-charcoal-700 w-64 group focus-within:ring-2 focus-within:ring-gold-500/20 transition-all">
          <HiOutlineSearch className="text-charcoal-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-transparent border-none text-xs focus:ring-0 w-full font-body dark:text-cream-50"
          />
        </div>

        <button className="relative p-2 rounded-full text-charcoal-500 hover:bg-charcoal-50 dark:hover:bg-charcoal-800 transition-all">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-charcoal-900"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-charcoal-100 dark:border-charcoal-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-ink dark:text-cream-50 leading-tight">{session?.user?.name || "Admin"}</p>
            <p className="text-[9px] uppercase tracking-widest text-gold-600 font-bold">Curator</p>
          </div>
          
          <div className="relative group/profile">
            <button className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gold-100 dark:bg-gold-900/30 rounded-full flex items-center justify-center font-heading text-sm font-bold text-gold-700 border border-gold-200 dark:border-gold-800/50">
                {session?.user?.name?.[0] || 'A'}
              </div>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-charcoal-800 rounded-xl shadow-2xl border border-charcoal-100 dark:border-charcoal-700 py-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all transform origin-top-right group-hover/profile:translate-y-0 translate-y-2 z-50">
               <div className="px-4 py-2 border-b border-charcoal-50 dark:border-charcoal-700 mb-2">
                  <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest">{session?.user?.email}</p>
               </div>
               <Link href="/admin/profile" className="block px-4 py-2 text-xs font-bold text-charcoal-600 dark:text-cream-200 hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors uppercase tracking-widest">
                  Account Settings
               </Link>
               <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors uppercase tracking-widest"
               >
                  Sign Out
               </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
