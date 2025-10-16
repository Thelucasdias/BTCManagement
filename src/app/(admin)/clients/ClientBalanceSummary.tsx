import { TransactionDTO } from "@/types/transaction";
import { trpc } from "@/utils/trpc";
import { useClientBalanceSummary } from "@/hooks/useClientBalance";
import { formatCurrencyBRL } from "@/lib/money";

type Props = {
  transactions: TransactionDTO[];
};

interface LocalTotals {
  depositBRL: number;
  withdrawBRL: number;
  depositBTC: number;
  withdrawBTC: number;
  totalDepositBtcQuote: number;
  depositCount: number;
}

export default function ClientBalanceSummary({ transactions }: Props) {
  const {
    data: btcPriceData,
    isLoading: loadingPrice,
    error,
  } = trpc.public.getBtcPrice.useQuery();

  if (!transactions || transactions.length === 0) {
    return (
      <div className="mb-4 p-3 rounded bg-gray-800 border border-gray-700 text-center text-gray-400">
        No transactions found for this client.
      </div>
    );
  }

  const totals: LocalTotals = transactions.reduce(
    (acc, t) => {
      const amountBRL = Number(t.amount_cents) / 100;
      const amountBTC = Number(t.btc_value);
      const btcQuote = Number(t.price_brl_per_btc);

      if (t.type === "DEPOSIT") {
        acc.depositBRL += amountBRL;
        acc.depositBTC += amountBTC;
        acc.totalDepositBtcQuote += btcQuote;
        acc.depositCount += 1;
      } else if (t.type === "WITHDRAWAL") {
        acc.withdrawBRL += amountBRL;
        acc.withdrawBTC += amountBTC;
      }

      return acc;
    },
    {
      depositBRL: 0,
      withdrawBRL: 0,
      depositBTC: 0,
      withdrawBTC: 0,
      totalDepositBtcQuote: 0,
      depositCount: 0,
    } as LocalTotals
  );

  const balanceBRL = totals.depositBRL - totals.withdrawBRL;
  const btcPriceBRL = btcPriceData ?? 0;

  const summary = useClientBalanceSummary({
    transactions: transactions,
    btcPriceBRL: btcPriceBRL,
  });

  const formatBRLPrice = (value: number) =>
    formatCurrencyBRL(Math.round(value * 100));

  return (
    <div className="mb-4 p-3 rounded bg-gray-800 border border-gray-700 text-white">
      <p>
        <strong>Total Deposits:</strong> {formatBRLPrice(totals.depositBRL)} (
        {totals.depositBTC.toFixed(8)} BTC)
      </p>
      <p>
        <strong>Total Withdrawals:</strong> {formatBRLPrice(totals.withdrawBRL)}
        ({totals.withdrawBTC.toFixed(8)} BTC)
      </p>

      <p className="mt-2 border-t border-gray-700 pt-2">
        <strong>Balance:</strong> {formatBRLPrice(balanceBRL)}(
        {summary.balanceBTCAmount} BTC)
      </p>

      <p className="mt-2 pt-2 text-blue-400">
        <strong>Current Value:</strong>{" "}
        {loadingPrice
          ? "Loading..."
          : formatCurrencyBRL(summary.currentBalanceCents) +
            ` (${summary.balanceBTCAmount} BTC)`}
      </p>

      <p className="text-sm text-gray-400 mt-1">
        {loadingPrice ? "..." : `Current Quote: ${formatBRLPrice(btcPriceBRL)}`}
      </p>
      <p className="mt-2 border-t border-gray-700 pt-2 text-yellow-400">
        <strong>Average Deposit Price:</strong>{" "}
        {formatBRLPrice(summary.avgDepositPrice)}
      </p>

      {error && (
        <p className="text-red-400 text-sm mt-1">Error loading BTC quote.</p>
      )}
    </div>
  );
}
