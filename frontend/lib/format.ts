import { formatEther } from "viem";

export function shortAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function sameAddress(a?: string | null, b?: string | null): boolean {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}

/** Formats wei as ETH, trimming to at most `decimals` places. */
export function formatEth(wei: bigint, decimals = 4): string {
  const [whole, frac = ""] = formatEther(wei).split(".");
  const trimmed = frac.slice(0, decimals).replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole;
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function formatDate(timestamp: bigint | number): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Human relative time to a unix timestamp: "in 3 days", "5 hours ago".
 */
export function formatRelative(timestamp: bigint | number, now = nowSeconds()): string {
  const diff = Number(timestamp) - now;
  const abs = Math.abs(diff);
  const units: [number, string][] = [
    [86_400, "day"],
    [3_600, "hour"],
    [60, "minute"],
  ];
  for (const [size, unit] of units) {
    if (abs >= size) {
      const n = Math.floor(abs / size);
      const label = `${n} ${unit}${n === 1 ? "" : "s"}`;
      return diff >= 0 ? `in ${label}` : `${label} ago`;
    }
  }
  return diff >= 0 ? "in under a minute" : "just now";
}

/** Converts a `yyyy-mm-dd` input value to a unix timestamp at 23:59:59 local time. */
export function endOfDayTimestamp(dateInput: string): bigint {
  const [y, m, d] = dateInput.split("-").map(Number);
  return BigInt(Math.floor(new Date(y, m - 1, d, 23, 59, 59).getTime() / 1000));
}

/** `yyyy-mm-dd` for today + `days`, in local time — for date input min/defaults. */
export function dateInputValue(daysFromToday = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Pulls the most useful message out of a viem / wallet error. */
export function errorMessage(error: unknown): string {
  if (!error) return "";
  const e = error as { shortMessage?: string; message?: string; cause?: unknown };
  const raw = e.shortMessage || e.message || String(error);
  if (/user (rejected|denied)/i.test(raw)) return "Transaction rejected in wallet.";
  const revert = raw.match(/reverted with the following reason:\s*\n?(.+)/i);
  if (revert) return revert[1].replace(/^CoSigned:\s*/, "").trim();
  return raw.split("\n")[0];
}
