"use client";

import Link from "next/link";

/**
 * Reusable Empty State component.
 *
 * Props:
 *   icon       — React node (icon JSX)
 *   title      — Primary heading
 *   message    — Secondary text
 *   actionLabel — CTA button text
 *   actionHref  — CTA link href
 *   className  — additional wrapper class
 */
export default function EmptyState({
  icon,
  title = "Nothing here yet",
  message = "Get started by adding your first item.",
  actionLabel,
  actionHref,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-24 px-6 text-center ${className}`}
    >
      {icon && (
        <div className="w-24 h-24 bg-charcoal-50 dark:bg-charcoal-800 rounded-full flex items-center justify-center mb-6 text-charcoal-300 dark:text-charcoal-600 border border-charcoal-100 dark:border-charcoal-700">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-2xl font-bold text-ink dark:text-cream-50 mb-2">
        {title}
      </h3>
      <p className="text-charcoal-500 dark:text-charcoal-400 max-w-xs leading-relaxed mb-8 text-sm">
        {message}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-gold-600 hover:bg-gold-700 text-white font-bold py-3 px-8 rounded-xl transition-all uppercase tracking-widest text-xs shadow-md shadow-gold-600/20"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
