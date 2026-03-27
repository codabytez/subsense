const SYMBOL_MAP: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$",
  CHF: "Fr",
  NGN: "₦",
  INR: "₹",
  CNY: "¥",
};

/** Currencies that use 0 decimal places */
const ZERO_DECIMAL = new Set(["JPY"]);

/**
 * Returns the currency symbol for a given currency code e.g. "USD" → "$".
 */
export function getCurrencySymbol(code: string | undefined | null): string {
  if (!code) return "$";
  return SYMBOL_MAP[code] ?? code;
}

/**
 * Formats an amount as a display string with symbol, thousands separators,
 * and correct decimal places.
 *
 * @example
 * formatAmount(1500, "NGN")       // "₦1,500.00"
 * formatAmount(9.99, "USD")       // "$9.99"
 * formatAmount(1500, "JPY")       // "¥1,500"
 * formatAmount(9.99, "USD", true) // "~$9.99"
 */
export function formatAmount(
  amount: number,
  currency: string | undefined | null,
  approx?: boolean
): string {
  const code = currency ?? "USD";
  const decimals = ZERO_DECIMAL.has(code) ? 0 : 2;
  const symbol = getCurrencySymbol(code);

  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${approx ? "~" : ""}${symbol}${formatted}`;
}
