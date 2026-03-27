"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiOutlineViewGrid, 
  HiOutlineCube, 
  HiOutlineCollection, 
  HiOutlineClipboardList, 
  HiOutlinePlus, 
  HiOutlineHome,
  HiOutlineSparkles,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiX
} from "react-icons/hi";

export default function AdminSidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard",   href: "/admin",              icon: HiOutlineViewGrid },
    { name: "Products",    href: "/admin/products",     icon: HiOutlineCube },
    { name: "Add Product", href: "/admin/products/new", icon: HiOutlinePlus },
    { name: "Categories",  href: "/admin/categories",   icon: HiOutlineCollection },
    { name: "Appearance",  href: "/admin/homepage",     icon: HiOutlineSparkles },
    { name: "Orders",      href: "/admin/orders",       icon: HiOutlineClipboardList },
  ];

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-charcoal-950 border-r border-charcoal-800 z-50 transition-all duration-300 ease-in-out flex flex-col
          ${isCollapsed ? "w-[72px]" : "w-64"}
          ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Brand area */}
        <div className={`px-4 py-5 border-b border-charcoal-800 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/" className="group flex items-center gap-3 overflow-hidden" onClick={() => setIsMobileOpen(false)}>
            <div className="min-w-[36px] w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-gold-600/30 text-sm flex-shrink-0">
              A
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in overflow-hidden">
                <h2 className="font-heading text-lg font-bold tracking-tight text-white whitespace-nowrap leading-none">ARTISAN</h2>
                <p className="text-[9px] text-charcoal-500 uppercase tracking-[0.15em] mt-0.5">Admin Portal</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-charcoal-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-charcoal-800"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto no-scrollbar">
          {!isCollapsed && (
            <p className="label-caps text-charcoal-600 px-3 pb-3">Navigation</p>
          )}
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                  active
                    ? "bg-gold-500/15 text-gold-400 border border-gold-500/20"
                    : "text-charcoal-400 hover:bg-charcoal-800 hover:text-white border border-transparent"
                }`}
              >
                {/* Active left indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold-500 rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 min-w-[20px] transition-colors ${active ? "text-gold-400" : "text-charcoal-500 group-hover:text-gold-400"}`} />
                {!isCollapsed && (
                  <span className="whitespace-nowrap animate-fade-in font-bold">{link.name}</span>
                )}

                {/* Collapsed tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-charcoal-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-charcoal-700 translate-x-1 group-hover:translate-x-0">
                    {link.name}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-charcoal-800" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className={`px-3 py-4 border-t border-charcoal-800 space-y-1`}>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-charcoal-500 hover:text-white hover:bg-charcoal-800 transition-all rounded-xl group border border-transparent"
          >
            <HiOutlineHome className="w-5 h-5 min-w-[20px] group-hover:text-gold-400 transition-colors" />
            {!isCollapsed && <span className="whitespace-nowrap animate-fade-in font-medium text-xs">Back to Gallery</span>}
          </Link>

          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center gap-3 w-full px-3 py-2.5 text-sm text-charcoal-600 hover:text-white hover:bg-charcoal-800 transition-all rounded-xl border border-transparent"
          >
            {isCollapsed ? (
              <HiChevronDoubleRight className="w-5 h-5 min-w-[20px]" />
            ) : (
              <>
                <HiChevronDoubleLeft className="w-5 h-5 min-w-[20px]" />
                <span className="whitespace-nowrap animate-fade-in text-xs font-bold uppercase tracking-widest">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

