export const toCents = (value: number) => Math.round(value * 100);

export const fromCents = (cents: number) => (cents ?? 0) / 100;

export const formatCurrencyBRL = (cents: bigint | number): string => {
  const numericCents = typeof cents === "bigint" ? Number(cents) : cents;
  const value = numericCents / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatBtcValue = (btcValue: string): string => {
  const btcString = String(btcValue);

  const parts = btcString.split(".");
  const integerPart = parts[0];
  const rawDecimalPart = parts[1] || "";

  const formattedDecimal = rawDecimalPart.padEnd(8, "0").substring(0, 8);

  const formattedInteger = new Intl.NumberFormat("pt-BR").format(
    parseInt(integerPart, 10)
  );

  return `${formattedInteger}.${formattedDecimal} BTC`;
};
