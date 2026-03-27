"use client";

import Link from "next/link";

/**
 * Reusable Error State for failed data fetches or unexpected errors.
 *
 * Props:
 *   title      — Main heading
 *   message    — Description
 *   onRetry    — Optional retry callback. If provided, shows a Retry button.
 *   actionLabel — Custom CTA label (defaults to "Try Again")
 *   className  — Additional wrapper class
 */
export default function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  onRetry,
  actionLabel = "Try Again",
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-24 px-6 text-center ${className}`}>
      <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-6 border border-red-100 dark:border-red-900/30 text-4xl select-none">
        ⚠️
      </div>
      <h3 className="font-heading text-2xl font-bold text-ink dark:text-cream-50 mb-2">
        {title}
      </h3>
      <p className="text-charcoal-500 dark:text-charcoal-400 max-w-xs leading-relaxed mb-8 text-sm">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-outline text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
