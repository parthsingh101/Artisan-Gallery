"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

export default function CategoryFilters() {
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search");
    handleFilterChange("search", query);
  };

  const currentSearch = searchParams.get("search") || "";
  const currentType = searchParams.get("productType") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentSearch || currentType || currentSort !== "newest";

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-xl font-bold text-ink dark:text-cream-50">Refine Collection</h3>
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
        {/* Localized Search */}
        <div>
          <h4 className="text-[10px] font-extrabold text-charcoal-400 uppercase tracking-widest mb-4">Search Artworks</h4>
          <form onSubmit={handleSearchSubmit} className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
            <input 
              type="text" 
              name="search"
              defaultValue={currentSearch}
              placeholder="Title or artist..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-charcoal-100 dark:border-charcoal-700 dark:bg-charcoal-900 outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-bold text-charcoal-600 dark:text-charcoal-300"
            />
          </form>
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
