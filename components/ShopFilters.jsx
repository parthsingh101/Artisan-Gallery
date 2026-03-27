"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

export default function ShopFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to update query string
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1"); // Reset pagination on filter change
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name, value) => {
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
  };

  const currentCategory = searchParams.get("category") || "";
  const currentType = searchParams.get("productType") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentCategory || currentType || currentSort !== "newest";

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">Refine Search</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-[10px] uppercase tracking-widest font-bold text-charcoal-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <HiOutlineX className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search title, artist or tags..."
            defaultValue={searchParams.get("search") || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFilterChange("search", e.target.value);
              }
            }}
            className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-100 dark:border-charcoal-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-gold-500/20 outline-none transition-all dark:text-cream-50 placeholder:text-charcoal-300"
          />
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-[10px] font-extrabold text-charcoal-400 uppercase tracking-widest mb-4">Collection</h4>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange("category", "")}
              className={`w-full text-left text-sm font-bold transition-all px-3 py-2 rounded-lg ${
                !currentCategory ? "bg-gold-50 text-gold-600 dark:bg-gold-900/20 dark:text-gold-400" : "text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-900"
              }`}
            >
              All Artworks
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleFilterChange("category", cat._id)}
                className={`w-full text-left text-sm font-bold transition-all px-3 py-2 rounded-lg ${
                  currentCategory === cat._id ? "bg-gold-50 text-gold-600 dark:bg-gold-900/20 dark:text-gold-400" : "text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-900"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Medium / Product Type */}
        <div>
          <h4 className="text-[10px] font-extrabold text-charcoal-400 uppercase tracking-widest mb-4">Medium</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFilterChange("productType", "")}
              className={`text-xs font-bold py-2 rounded-xl border transition-all ${
                !currentType 
                  ? "bg-ink text-white border-ink dark:bg-cream-50 dark:text-ink dark:border-cream-50 shadow-md" 
                  : "bg-transparent text-charcoal-500 border-charcoal-200 dark:border-charcoal-600 hover:border-charcoal-300"
              }`}
            >
              Any
            </button>
            <button
              onClick={() => handleFilterChange("productType", "painting")}
              className={`text-xs font-bold py-2 rounded-xl border transition-all ${
                currentType === "painting"
                  ? "bg-ink text-white border-ink dark:bg-cream-50 dark:text-ink dark:border-cream-50 shadow-md" 
                  : "bg-transparent text-charcoal-500 border-charcoal-200 dark:border-charcoal-600 hover:border-charcoal-300"
              }`}
            >
              Paintings
            </button>
            <button
              onClick={() => handleFilterChange("productType", "sketch")}
              className={`text-xs font-bold py-2 rounded-xl border transition-all col-span-2 ${
                currentType === "sketch"
                  ? "bg-ink text-white border-ink dark:bg-cream-50 dark:text-ink dark:border-cream-50 shadow-md" 
                  : "bg-transparent text-charcoal-500 border-charcoal-200 dark:border-charcoal-600 hover:border-charcoal-300"
              }`}
            >
              Sketches
            </button>
          </div>
        </div>

        {/* Sort */}
        <div>
          <h4 className="text-[10px] font-extrabold text-charcoal-400 uppercase tracking-widest mb-4">Sort By</h4>
          <select
            value={currentSort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="w-full bg-charcoal-50 dark:bg-charcoal-900 border border-charcoal-100 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-300 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gold-500/20"
          >
            <option value="newest">Recently Added</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
