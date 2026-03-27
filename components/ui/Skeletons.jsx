"use client";

/**
 * Loading skeleton components for different listing layouts.
 *
 * Named exports:
 *   ProductCardSkeleton  — Matches the ProductCard UI
 *   TableRowSkeleton     — Matches admin table rows
 *   OrderCardSkeleton    — Matches /account/orders cards
 *   GenericListSkeleton  — Generic list of text lines
 *
 * Usage:
 *   <ProductGridSkeleton count={8} />
 *   <TableSkeleton rows={10} cols={6} />
 */

// Shimmer pulse animation wrapper
function Pulse({ className = "" }) {
  return (
    <div className={`shimmer rounded-lg ${className}`} />
  );
}

// ─── Product card skeleton ───────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-2xl overflow-hidden border border-charcoal-100 dark:border-charcoal-700">
      <Pulse className="w-full aspect-[4/5] rounded-b-none" />
      <div className="p-4 space-y-3">
        <Pulse className="h-3 w-1/3" />
        <Pulse className="h-5 w-3/4" />
        <Pulse className="h-4 w-1/4" />
      </div>
    </div>
  );
}

/** Grid of ProductCardSkeleton */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Admin table row skeleton ─────────────────────────────────────────────────
export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Pulse className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/** Full table body skeleton */
export function TableSkeleton({ rows = 8, cols = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </>
  );
}

// ─── Order card skeleton (for /account/orders) ────────────────────────────────
export function OrderCardSkeleton() {
  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 border border-charcoal-100 dark:border-charcoal-700 space-y-4">
      <div className="flex justify-between">
        <Pulse className="h-4 w-48" />
        <Pulse className="h-4 w-24" />
      </div>
      <div className="flex gap-8">
        <Pulse className="h-4 w-32" />
        <Pulse className="h-4 w-20" />
        <Pulse className="h-4 w-20" />
      </div>
    </div>
  );
}

/** Stack of OrderCardSkeleton */
export function OrderListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Generic multi-line text skeleton ────────────────────────────────────────
export function GenericListSkeleton({ rows = 5, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <Pulse key={i} className={`h-5 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}
