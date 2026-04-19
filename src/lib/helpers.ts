export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

export async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function mockBlockchainTx(hash: string): string {
  return "0x" + hash.slice(0, 56);
}

export function calcMpg(miles: number, gallons: number): number {
  if (gallons <= 0) return 0;
  return Math.round((miles / gallons) * 10) / 10;
}
