export type TransactionDTO = {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  amount_cents: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  btc_value: string;
  price_brl_per_btc: string;
};
