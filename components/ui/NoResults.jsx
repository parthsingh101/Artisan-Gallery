"use client";

/**
 * Reusable No-Results state shown when filters/search return nothing.
 *
 * Props:
 *   searchTerm  — the term that produced no results (optional)
 *   onClear     — callback to clear all filters
 *   className   — additional wrapper class
 */
export default function NoResults({
  searchTerm = "",
  onClear,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-charcoal-50 dark:bg-charcoal-800 rounded-full flex items-center justify-center mb-5 border border-charcoal-100 dark:border-charcoal-700 text-4xl">
        🔍
      </div>
      <h3 className="font-heading text-2xl font-bold text-ink dark:text-cream-50 mb-2">
        No results found
      </h3>
      <p className="text-charcoal-500 dark:text-charcoal-400 max-w-xs leading-relaxed text-sm mb-6">
        {searchTerm
          ? `We couldn't find anything matching "${searchTerm}". Try adjusting your search or filters.`
          : "Your current filters returned no items. Try broadening your search."}
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="text-sm font-bold text-gold-600 hover:text-gold-700 underline underline-offset-4 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
