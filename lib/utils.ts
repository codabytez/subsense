import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeDecimalInput(value: string) {
  const sanitized = value.replace(/[^\d.]/g, "");
  const [whole = "", ...fractionParts] = sanitized.split(".");

  if (fractionParts.length === 0) {
    return whole;
  }

  const fraction = fractionParts.join("");
  return `${whole || "0"}.${fraction}`;
}
