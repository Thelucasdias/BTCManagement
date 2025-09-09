export const toCents = (value: number) => Math.round(value * 100);
export const fromCents = (cents: number) => (cents ?? 0) / 100;
