import { TransactionDTO } from "@/types/transaction";

type Props = {
  transactions: TransactionDTO[];
};

export default function ClientBalanceSummary({ transactions }: Props) {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  const totals = transactions.reduce(
    (acc, t) => {
      const amountBRL = Number(t.amount_cents) / 100;
      const amountBTC = Number(t.btc_value);

      if (t.type === "DEPOSIT") {
        acc.depositBRL += amountBRL;
        acc.depositBTC += amountBTC;
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
    }
  );

  const balanceBRL = totals.depositBRL - totals.withdrawBRL;
  const balanceBTC = totals.depositBTC - totals.withdrawBTC;

  return (
    <div className="mb-4 p-3 rounded bg-gray-800 border border-gray-700">
      <p>
        <strong>Total Deposits:</strong> {totals.depositBRL.toFixed(2)} BRL (
        {totals.depositBTC.toFixed(8)} BTC)
      </p>
      <p>
        <strong>Total Withdrawals:</strong> {totals.withdrawBRL.toFixed(2)} BRL
        ({totals.withdrawBTC.toFixed(8)} BTC)
      </p>
      <p className="mt-2 border-t border-gray-700 pt-2">
        <strong>Balance:</strong> {balanceBRL.toFixed(2)} BRL (
        {balanceBTC.toFixed(8)} BTC)
      </p>
    </div>
  );
}
