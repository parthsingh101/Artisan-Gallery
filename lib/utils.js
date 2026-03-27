import slugifyLib from "slugify";

/**
 * Format a number as a currency string (INR by default).
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatPrice(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style:    "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate a URL-safe slug from a string.
 * @param {string} text
 * @returns {string}
 */
export function createSlug(text) {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
}

/**
 * Truncate a string to a given length, appending "…" if truncated.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 100) {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}

/**
 * Calculate the discounted price given a percentage.
 * @param {number} price
 * @param {number} discountPercent
 * @returns {number}
 */
export function applyDiscount(price, discountPercent) {
  return Math.round(price - (price * discountPercent) / 100);
}

/**
 * Format a date string to a readable format.
 * @param {string | Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  }).format(new Date(date));
}

/**
 * Check if a value is an empty object or array.
 * @param {any} value
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && value !== null)
    return Object.keys(value).length === 0;
  return !value;
}
