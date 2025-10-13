"use client";

import React, { useMemo, useState } from "react";
import { signOut } from "next-auth/react";

interface DashboardData {
  amountInvestedCents: bigint;
  currentBalanceCents: bigint;
  btcBalance: string;
}

const mockData: DashboardData = {
  amountInvestedCents: BigInt(5000000),
  currentBalanceCents: BigInt(6845255),
  btcBalance: "0.87345678",
};

const formatCurrencyBRL = (cents: bigint): string => {
  const value = Number(cents) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatBtcValue = (btcValue: string): string => {
  const [integerPart, decimalPart] = btcValue.split(".");
  const formattedDecimal = decimalPart
    ? decimalPart.padEnd(8, "0")
    : "00000000";

  const formattedInteger = new Intl.NumberFormat("pt-BR").format(
    parseInt(integerPart, 10)
  );

  return `${formattedInteger}.${formattedDecimal} BTC`;
};

export default function App() {
  const data = mockData;
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const profitLossCents = data.currentBalanceCents - data.amountInvestedCents;
  const isPositive = profitLossCents >= 0;

  const profitLossFormatted = useMemo(() => {
    return formatCurrencyBRL(profitLossCents);
  }, [profitLossCents]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 transform transition-all duration-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-3">
          Bitcoin Fácil
        </h1>

        <div className="space-y-6 text-center">
          <div className="text-gray-500">
            <p className="text-sm font-semibold uppercase tracking-wider">
              Total Investido
            </p>
            <p className="text-2xl font-medium text-gray-700">
              {formatCurrencyBRL(data.amountInvestedCents)}
            </p>
          </div>

          <div className="py-4 border-t border-b border-gray-100">
            <p className="text-lg text-gray-500 uppercase tracking-widest mb-1">
              Saldo Atual
            </p>
            <p className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-tight transition-all duration-500">
              {formatCurrencyBRL(data.currentBalanceCents)}
            </p>

            <div
              className={`text-lg font-bold mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {isPositive ? "↑" : "↓"} {profitLossFormatted} (
              {isPositive ? "Lucro" : "Desvalorização"})
            </div>
          </div>

          <div className="text-gray-500">
            <p className="text-sm font-semibold uppercase tracking-wider">
              Saldo em Bitcoin
            </p>
            <p className="text-2xl font-medium text-gray-700">
              {formatBtcValue(data.btcBalance)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button
            onClick={() => {
              setIsDepositing(true);
              console.log("Abrindo modal de depósito...");
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            disabled={isDepositing || isWithdrawing}
          >
            Depositar
          </button>

          <button
            onClick={() => {
              setIsWithdrawing(true);
              console.log("Abrindo modal de saque...");
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-500/50"
            disabled={isDepositing || isWithdrawing}
          >
            Sacar
          </button>
        </div>

        {(isDepositing || isWithdrawing) && (
          <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-center font-medium">
            {isDepositing
              ? "Modal de Depósito aberto..."
              : "Modal de Saque aberto..."}{" "}
            (A lógica real de modal precisa ser implementada).
            <button
              onClick={() => {
                setIsDepositing(false);
                setIsWithdrawing(false);
              }}
              className="ml-4 text-blue-600 hover:text-blue-800"
            >
              Fechar
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-8 text-center">
          *Dados simulados. Na aplicação real, estas métricas seriam carregadas
          via uma query tRPC.
        </p>
      </div>
      <div>
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
