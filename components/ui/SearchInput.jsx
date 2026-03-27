"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

/**
 * Reusable URL-driven search input.
 *
 * Props:
 *   paramName  — the query param key, default "search"
 *   placeholder — input placeholder text
 *   debounce   — ms debounce delay, default 400
 *   className  — additional wrapper class
 */
export default function SearchInput({
  paramName = "search",
  placeholder = "Search…",
  debounce = 400,
  className = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get(paramName) || "";
  const [value, setValue] = useState(initial);

  // Sync local state if the URL changes externally (back/forward nav)
  useEffect(() => {
    setValue(searchParams.get(paramName) || "");
  }, [searchParams, paramName]);

  // Debounced URL push
  const push = useCallback(
    (val) => {
      const params = new URLSearchParams(searchParams);
      if (val) {
        params.set(paramName, val);
      } else {
        params.delete(paramName);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router, paramName]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      push(value);
    }, debounce);
    return () => clearTimeout(timer);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`relative ${className}`}>
      <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-xl text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all placeholder:text-charcoal-400"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-charcoal-200 transition-colors"
          aria-label="Clear search"
        >
          <HiOutlineX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
