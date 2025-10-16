"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { useClientBalanceSummary } from "@/hooks/useClientBalance";
import { formatCurrencyBRL, formatBtcValue } from "@/lib/money";

export default function DashboardPage() {
  const {
    data: transactions,
    isLoading: loadingTransactions,
    error: transactionError,
  } = trpc.client.getTransactions.useQuery();

  const {
    data: btcPriceData,
    isLoading: loadingPrice,
    error: priceError,
  } = trpc.public.getBtcPrice.useQuery();

  const isLoading = loadingTransactions || loadingPrice;
  const error = transactionError || priceError;

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

  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-xl font-bold text-red-600">
          Error loading dashboard: {error.message}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl font-semibold text-blue-600">
          Loading Dashboard... ⏳
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 transform transition-all duration-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-3">
          Bitcoin Easy
        </h1>

        <div className="space-y-6 text-center">
          <div className="text-gray-500">
            <p className="text-sm font-semibold uppercase tracking-wider">
              Total Invested
            </p>
            <p className="text-2xl font-medium text-gray-700">
              {formatCurrencyBRL(totalInvestedCents)}
            </p>
          </div>

          <div className="py-4 border-t border-b border-gray-100">
            <p className="text-lg text-gray-500 uppercase tracking-widest mb-1">
              Current Balance
            </p>
            <p className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-tight transition-all duration-500">
              {formatCurrencyBRL(currentBalanceCents)}
            </p>

            <div
              className={`text-lg font-bold mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {isPositive ? "↑" : "↓"} {formatCurrencyBRL(profitLossCents)} (
              {isPositive ? "Profit" : "Loss"})
            </div>
          </div>

          <div className="text-gray-500">
            <p className="text-sm font-semibold uppercase tracking-wider">
              Bitcoin Balance
            </p>
            <p className="text-2xl font-medium text-gray-700">
              {formatBtcValue(balanceBTCAmount)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button
            onClick={() => {
              setIsDepositing(true);
              console.log("Opening deposit modal...");
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            disabled={isDepositing || isWithdrawing}
          >
            Deposit
          </button>

          <button
            onClick={() => {
              setIsWithdrawing(true);
              console.log("Opening withdrawal modal...");
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-500/50"
            disabled={isDepositing || isWithdrawing}
          >
            Withdraw
          </button>
        </div>

        {(isDepositing || isWithdrawing) && (
          <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-center font-medium">
            {isDepositing
              ? "Deposit modal open..."
              : "Withdrawal modal open..."}
            <button
              onClick={() => {
                setIsDepositing(false);
                setIsWithdrawing(false);
              }}
              className="ml-4 text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        )}
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
