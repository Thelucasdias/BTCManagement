import { TransactionDTO } from "@/types/transaction";
import { trpc } from "@/utils/trpc";

type Props = {
  transactions: TransactionDTO[];
};

export default function ClientBalanceSummary({ transactions }: Props) {
  const {
    data: btcPriceData,
    isLoading: loadingPrice,
    error,
  } = trpc.public.getBtcPrice.useQuery();

  if (!transactions || transactions.length === 0) {
    return null;
  }

  const totals = transactions.reduce(
    (acc, t) => {
      const amountBRL = Number(t.amount_cents) / 100;
      const amountBTC = Number(t.btc_value);

      // Converte a cotação (string) para número
      const btcQuote = Number(t.price_brl_per_btc);

      if (t.type === "DEPOSIT") {
        acc.depositBRL += amountBRL;
        acc.depositBTC += amountBTC;
        // ✅ ADICIONA O PREÇO DO BTC E CONTA O DEPÓSITO
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
      // ✅ NOVOS ACUMULADORES
      totalDepositBtcQuote: 0,
      depositCount: 0,
    }
  );

  const balanceBRL = totals.depositBRL - totals.withdrawBRL;
  const balanceBTC = totals.depositBTC - totals.withdrawBTC;

  const btcPriceBRL = btcPriceData ?? 0;

  const currentBalanceBRL = balanceBTC * btcPriceBRL;

  // ✅ CÁLCULO DA MÉDIA
  const avgDepositPrice =
    totals.depositCount > 0
      ? totals.totalDepositBtcQuote / totals.depositCount
      : 0;

  // Função auxiliar para formatar o preço do BTC (mantida do exemplo anterior)
  const formatBRLPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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

      {/* Current Balance com cotação atual */}
      <p className="mt-2 pt-2 text-blue-400">
        <strong>Current Balance:</strong>{" "}
        {loadingPrice
          ? "Carregando..."
          : formatBRLPrice(currentBalanceBRL) +
            ` (${balanceBTC.toFixed(8)} BTC)`}
      </p>

      {/* Cotação Atual (para comparação) */}
      <p className="text-sm text-gray-400 mt-1">
        {loadingPrice
          ? "..."
          : `Current BTC Price: ${formatBRLPrice(btcPriceBRL)} BTC`}
      </p>
      {/* ✅ NOVA LINHA PARA A MÉDIA */}
      <p className="mt-2 border-t border-gray-700 pt-2 text-yellow-400">
        <strong>Average Deposit Price:</strong>{" "}
        {formatBRLPrice(avgDepositPrice)} BTC
      </p>

      {error && (
        <p className="text-red-400 text-sm mt-1">
          Erro ao carregar cotação do BTC.
        </p>
      )}
    </div>
  );
}
