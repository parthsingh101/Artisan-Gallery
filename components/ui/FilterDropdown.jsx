"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Reusable URL-driven filter dropdown / pill group.
 *
 * Props:
 *   paramName  — the query param key
 *   label      — header label shown above the control
 *   options    — [{ value, label }]  (include { value: "", label: "All" } for 'unset' state)
 *   variant    — "select" | "pills"  (default "select")
 *   className  — additional wrapper class
 */
export default function FilterDropdown({
  paramName,
  label,
  options = [],
  variant = "select",
  className = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramName) || "";

  const handleChange = useCallback(
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

  if (variant === "pills") {
    return (
      <div className={className}>
        {label && (
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-3">
            {label}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleChange(opt.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                current === opt.value
                  ? "bg-ink text-white border-ink dark:bg-cream-50 dark:text-ink dark:border-cream-50 shadow-md"
                  : "bg-white dark:bg-charcoal-800 text-charcoal-500 border-charcoal-200 dark:border-charcoal-600 hover:border-charcoal-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default: select
  return (
    <div className={className}>
      {label && (
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-2">
          {label}
        </p>
      )}
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-white dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700 rounded-xl px-4 py-3 text-sm font-bold text-charcoal-700 dark:text-charcoal-200 focus:border-gold-500 outline-none transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
