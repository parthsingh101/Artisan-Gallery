"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Reusable URL-driven sort dropdown.
 *
 * Props:
 *   options    — [{ value, label }]
 *   paramName  — the query param key, default "sort"
 *   defaultVal — which option is "default" (not highlighted)
 *   className  — additional wrapper class
 */
export default function SortDropdown({
  options = [
    { value: "newest", label: "Recently Added" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
  ],
  paramName = "sort",
  defaultVal = "newest",
  className = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramName) || defaultVal;

  const handleChange = useCallback(
    (val) => {
      const params = new URLSearchParams(searchParams);
      if (val === defaultVal) {
        params.delete(paramName);
      } else {
        params.set(paramName, val);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router, paramName, defaultVal]
  );

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className={`bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm font-bold text-charcoal-700 dark:text-charcoal-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all appearance-none cursor-pointer ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
