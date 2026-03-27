"use client";

// ─── Primitive UI Components ──────────────────────────────────────────────────

export function Button({
  children, variant = "primary", size = "md",
  className = "", disabled = false, onClick, type = "button"
}) {
  const variants = { primary: "btn-primary", outline: "btn-outline", ghost: "btn-ghost" };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-6 py-3 text-sm", lg: "px-8 py-4 text-base" };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

export function Badge({ children, variant = "gold", className = "" }) {
  const variants = { gold: "badge-gold", green: "badge-green", red: "badge-red" };
  return <span className={`${variants[variant]} ${className}`}>{children}</span>;
}

export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300">{label}</label>}
      <input className={`input-field ${error ? "border-red-500 focus:ring-red-200" : ""} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function Spinner({ size = "md", light = false }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${light ? "border-white" : "border-gold-500"} ${sizes[size]}`} />
  );
}

// ─── Listing & Data UI Components ─────────────────────────────────────────────
export { default as SearchInput }    from "./SearchInput";
export { default as SortDropdown }   from "./SortDropdown";
export { default as FilterDropdown } from "./FilterDropdown";
export { default as Pagination }     from "./Pagination";
export { default as EmptyState }     from "./EmptyState";
export { default as NoResults }      from "./NoResults";
export { default as ErrorState }     from "./ErrorState";

export {
  ProductCardSkeleton,
  ProductGridSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  OrderCardSkeleton,
  OrderListSkeleton,
  GenericListSkeleton,
} from "./Skeletons";
