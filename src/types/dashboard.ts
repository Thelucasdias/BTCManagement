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
