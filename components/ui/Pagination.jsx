"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

/**
 * Reusable URL-driven Pagination.
 *
 * Props:
 *   total     — total number of records
 *   page      — current page number (int)
 *   limit     — items per page
 *   paramName — page param key, default "page"
 *   className — additional wrapper class
 *
 * Renders page buttons with smart ellipsis for large page counts.
 */
export default function Pagination({
  total = 0,
  page = 1,
  limit = 12,
  paramName = "page",
  className = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pages = Math.ceil(total / limit);

  const goTo = useCallback(
    (p) => {
      const params = new URLSearchParams(searchParams);
      params.set(paramName, String(p));
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [searchParams, pathname, router, paramName]
  );

  if (pages <= 1) return null;

  // Build smart page number list with ellipsis
  const getPageNumbers = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const pages_arr = [1];
    if (page > 3) pages_arr.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
      pages_arr.push(i);
    }
    if (page < pages - 2) pages_arr.push("…");
    pages_arr.push(pages);
    return pages_arr;
  };

  return (
    <div className={`flex items-center justify-center gap-2 mt-12 ${className}`}>
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-100 dark:border-charcoal-700 text-charcoal-500 hover:border-gold-400 hover:text-gold-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
        aria-label="Previous page"
      >
        <HiOutlineChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-10 h-10 flex items-center justify-center text-charcoal-400 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shadow-sm ${
                page === p
                  ? "bg-ink text-white dark:bg-cream-50 dark:text-ink shadow-md scale-110"
                  : "bg-white dark:bg-charcoal-800 border border-charcoal-100 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-400 hover:border-gold-400 hover:text-gold-600"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => goTo(page + 1)}
        disabled={page === pages}
        className="p-3 bg-white dark:bg-charcoal-800 rounded-xl border border-charcoal-100 dark:border-charcoal-700 text-charcoal-500 hover:border-gold-400 hover:text-gold-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
        aria-label="Next page"
      >
        <HiOutlineChevronRight className="w-5 h-5" />
      </button>

      <span className="text-xs text-charcoal-400 ml-4 hidden md:block">
        Page {page} of {pages} &bull; {total} results
      </span>
    </div>
  );
}
