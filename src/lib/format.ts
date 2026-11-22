const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const usdFixed = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat("ar-SY-u-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFmt = new Intl.DateTimeFormat("ar-SY-u-nu-latn", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export const formatUSD = (n: number) => usd.format(n);
export const formatUSDFixed = (n: number) => usdFixed.format(n);
export const formatPercent = (rate: number) => `${+(rate * 100).toFixed(2)}%`;
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
export const formatShortDate = (iso: string) => shortDateFmt.format(new Date(iso));
export const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

/** Adds whole months to an ISO date (UTC), returns ISO date string. */
export function addMonthsISO(iso: string, months: number): string {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}
