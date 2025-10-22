"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { useClientBalanceSummary } from "@/hooks/useClientBalance";
import { formatCurrencyBRL, formatBtcValue } from "@/lib/money";
import TransactionsModal from "./TransactionsModal";

export default function DashboardPage() {
  // Busca transações do cliente logado
  const {
    data: transactions,
    isLoading: loadingTransactions,
    error: transactionError,
  } = trpc.clients.getTransactions.useQuery();

  // Busca cotação atual do BTC
  const {
    data: btcPriceData,
    isLoading: loadingPrice,
    error: priceError,
  } = trpc.public.getBtcPrice.useQuery();

  const isLoading = loadingTransactions || loadingPrice;
  const error = transactionError || priceError;

  // Resumo de saldo e lucro/prejuízo
  const summary = useClientBalanceSummary({
    transactions: transactions,
    btcPriceBRL: btcPriceData,
  });

  const {
    totalInvestedCents,
    currentBalanceCents,
    balanceBTCAmount,
    profitLossCents,
    isPositive,
  } = summary;

  const isProfit = !isPositive;
  const profitLossLabel = isProfit ? "Lucro" : "Desvalorização";

  // Estado para o modal
  const [modalType, setModalType] = useState<"DEPOSIT" | "WITHDRAWAL" | null>(
    null
  );

  // Tratamento de erros e carregamento
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-xl font-bold text-red-600">
          Erro ao carregar o dashboard: {error.message}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl font-semibold text-blue-600">
          Carregando Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 sm:p-8">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 transition-all duration-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-3">
          Bitcoin fácil
        </h1>

        {/* RESUMO */}
        <div className="space-y-6 text-center">
          <div className="text-gray-500">
            <p className="text-sm font-semibold uppercase tracking-wider">
              Total investido
            </p>
            <p className="text-2xl font-medium text-gray-700">
              {formatCurrencyBRL(totalInvestedCents)}
            </p>
          </div>

          <div className="py-4 border-t border-b border-gray-100">
            <p className="text-lg text-gray-500 uppercase tracking-widest mb-1">
              Saldo atual
            </p>
            <p className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-tight transition-all duration-500">
              {formatCurrencyBRL(currentBalanceCents)}
            </p>

            <div
              className={`text-lg font-bold mt-2 ${
                isProfit ? "text-green-600" : "text-red-600"
              }`}
            >
              {isProfit ? "↑" : "↓"} {formatCurrencyBRL(profitLossCents)} (
              {profitLossLabel})
            </div>
          </div>

          <div className="text-gray-500">
            <p className="text-sm font-semibold uppercase tracking-wider">
              Saldo em Bitcoin
            </p>
            <p className="text-2xl font-medium text-gray-700">
              {formatBtcValue(balanceBTCAmount)}
            </p>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button
            onClick={() => setModalType("DEPOSIT")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            disabled={modalType !== null}
          >
            Depositar
          </button>

          <button
            onClick={() => setModalType("WITHDRAWAL")}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-500/50"
            disabled={modalType !== null}
          >
            Sacar
          </button>
        </div>

        {/* MODAL DE TRANSAÇÕES */}
        {modalType && (
          <TransactionsModal
            isOpen={true}
            clientId={transactions?.[0]?.customerId ?? ""}
            type={modalType}
            onClose={() => setModalType(null)}
          />
        )}
      </div>

      {/* LOGOUT */}
      <div className="mt-6">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
