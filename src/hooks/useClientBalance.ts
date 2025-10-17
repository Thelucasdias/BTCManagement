import { useMemo } from "react";
import { TransactionDTO } from "@/types/transaction";

interface BalanceResult {
  totalFiatBalanceCents: number;
  totalInvestedCents: number;
  balanceBTCAmount: string;
  currentBalanceCents: number;
  profitLossCents: number;
  isPositive: boolean;
  avgDepositPrice: number;
}

const calculateSummary = (
  transactions: TransactionDTO[],
  btcPriceBRL: number
): BalanceResult => {
  const totals = transactions.reduce(
    (acc, t) => {
      const amountCents = t.amount_cents;
      const amountBTC = Number(t.btc_value);
      const btcQuote = Number(t.price_brl_per_btc);

      if (t.type === "DEPOSIT") {
        acc.totalDepositCents += amountCents;
        acc.depositBTC += amountBTC;
        acc.totalDepositBtcQuote += btcQuote;
        acc.depositCount += 1;
      } else if (t.type === "WITHDRAWAL") {
        acc.totalWithdrawCents += amountCents;
        acc.withdrawBTC += amountBTC;
      }

      return acc;
    },
    {
      totalDepositCents: 0,
      totalWithdrawCents: 0,
      depositBTC: 0,
      withdrawBTC: 0,
      totalDepositBtcQuote: 0,
      depositCount: 0,
    }
  );

  const totalFiatBalanceCents = Math.max(
    totals.totalDepositCents - totals.totalWithdrawCents,
    0
  );

  if (totals.totalWithdrawCents > totals.totalDepositCents) {
    totals.totalDepositCents = 0;
    totals.totalWithdrawCents = 0;
  }

  const balanceBTC = totals.depositBTC - totals.withdrawBTC;
  const currentBalanceBRLValue = balanceBTC * btcPriceBRL;
  const currentBalanceCents = Math.round(currentBalanceBRLValue * 100);
  const profitLossCents = currentBalanceCents - totalFiatBalanceCents;

  const avgDepositPrice =
    totals.depositCount > 0
      ? totals.totalDepositBtcQuote / totals.depositCount
      : 0;

  const isPositive = profitLossCents <= 0;
  const finalProfitLossCents = Math.abs(profitLossCents);

  return {
    totalInvestedCents: totalFiatBalanceCents,
    totalFiatBalanceCents: totalFiatBalanceCents,
    currentBalanceCents: currentBalanceCents,
    balanceBTCAmount: balanceBTC.toFixed(8),
    profitLossCents: finalProfitLossCents,
    isPositive: isPositive,
    avgDepositPrice: avgDepositPrice,
  };
};

interface UseClientBalanceProps {
  transactions: TransactionDTO[] | undefined;
  btcPriceBRL: number | undefined;
}

export const useClientBalanceSummary = ({
  transactions,
  btcPriceBRL,
}: UseClientBalanceProps) => {
  const safeTransactions = transactions || [];
  const safeBtcPrice = btcPriceBRL || 0;

  const summary = useMemo(() => {
    if (!safeTransactions.length || !safeBtcPrice) {
      return {
        totalInvestedCents: 0,
        totalFiatBalanceCents: 0,
        currentBalanceCents: 0,
        balanceBTCAmount: "0.00000000",
        profitLossCents: 0,
        isPositive: true,
        avgDepositPrice: 0,
      } as BalanceResult;
    }

    return calculateSummary(safeTransactions, safeBtcPrice);
  }, [safeTransactions, safeBtcPrice]);

  return summary;
};
