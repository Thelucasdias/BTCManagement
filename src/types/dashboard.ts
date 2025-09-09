export type DashboardStats = {
  totals: {
    totalContributions: number;
    totalWithdrawals: number;
    balanceBRL: number;
  };

  btc: {
    totalBtc: number;
  };
  market: {
    pricePerBtc: number;
    appreciationBRL: number;
    fundTotalBRL: number;
  };
};

export type TransactionDTO = {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  amount_cents: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  btc_sats: string;
};
