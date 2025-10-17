"use client";

import React, { useState, useCallback } from "react";

const COMPANY_PIX_KEY = "COMPANY_PIX_KEY_HERE@EXAMPLE.COM";
const MIN_DEPOSIT_CENTS = 1000;
const MIN_WITHDRAW_CENTS = 1000;

const parseAmountToCents = (amountString: string): number => {
  const cleanString = amountString.replace(",", ".");
  const amount = parseFloat(cleanString);
  if (isNaN(amount) || amount <= 0) return 0;
  return Math.round(amount * 100);
};

type TransferType = "deposit" | "withdraw";

interface TransferModalProps {
  type: TransferType;
  currentBtcPrice: number;
  currentBalanceCents: number;
  onClose: () => void;
  formatCurrencyBRL: (cents: number) => string;
  formatBtcValue: (satoshis: number) => string;
}

export default function TransferModal({
  type,
  currentBtcPrice,
  currentBalanceCents,
  onClose,
  formatCurrencyBRL,
  formatBtcValue,
}: TransferModalProps) {
  const isDeposit = type === "deposit";
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [clientPixKey, setClientPixKey] = useState("");
  const [transferCents, setTransferCents] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [depositTimestamp, setDepositTimestamp] = useState<string | null>(null);
  const [capturedBtcPrice, setCapturedBtcPrice] = useState(0);

  const title = isDeposit ? "New Deposit (BRL)" : "Withdrawal Request (BRL)";
  const mainActionLabel = isDeposit ? "Confirm Deposit" : "Confirm Withdrawal";

  const handleConfirmAmount = useCallback(() => {
    setError(null);
    const amountCents = parseAmountToCents(inputValue);

    if (amountCents === 0) {
      setError("Please enter a valid amount (greater than zero).");
      return;
    }

    if (isDeposit) {
      if (amountCents < MIN_DEPOSIT_CENTS) {
        setError(`Minimum deposit is ${formatCurrencyBRL(MIN_DEPOSIT_CENTS)}.`);
        return;
      }
      setTransferCents(amountCents);
      setCapturedBtcPrice(currentBtcPrice);
      setDepositTimestamp(new Date().toISOString());
      setStep(1);
    } else {
      if (amountCents < MIN_WITHDRAW_CENTS) {
        setError(
          `Minimum withdrawal is ${formatCurrencyBRL(MIN_WITHDRAW_CENTS)}.`
        );
        return;
      }
      if (amountCents > currentBalanceCents) {
        setTransferCents(amountCents);
        setStep(2);
        return;
      }
      setTransferCents(amountCents);
      setStep(1);
    }
  }, [
    inputValue,
    isDeposit,
    currentBalanceCents,
    currentBtcPrice,
    formatCurrencyBRL,
  ]);

  const handleProcessTransfer = useCallback(() => {
    if (!isDeposit && !clientPixKey) {
      setError("Please enter your PIX key to receive the amount.");
      return;
    }

    console.log(
      `[MOCK] ${type} transaction requested: ${formatCurrencyBRL(transferCents)}.`
    );
    if (!isDeposit) {
      console.log(`[MOCK] Client PIX key: ${clientPixKey}`);
    } else {
      console.log(
        `[MOCK] BTC price at confirmation: ${formatCurrencyBRL(capturedBtcPrice * 100)}.`
      );
    }

    setStep(3);
  }, [
    isDeposit,
    transferCents,
    clientPixKey,
    type,
    capturedBtcPrice,
    formatCurrencyBRL,
  ]);

  const handleCancel = useCallback(() => {
    setStep(0);
    setInputValue("");
    setTransferCents(0);
    setClientPixKey("");
    setError(null);
    setDepositTimestamp(null);
    setCapturedBtcPrice(0);
    onClose();
  }, [onClose]);

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <>
          <p className="text-gray-600 mb-4">
            {isDeposit
              ? "How much in Brazilian Reais (BRL) would you like to deposit?"
              : `Your available balance: ${formatCurrencyBRL(currentBalanceCents)}.`}
          </p>
          <div className="mb-2">
            <label
              htmlFor="transfer-amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount (R$):
            </label>
            <input
              id="transfer-amount"
              type="text"
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.target.value.replace(/[^0-9,.]/g, ""))
              }
              placeholder={isDeposit ? "Ex: 50,00" : "Ex: 200,00"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center font-medium">
              {error}
            </p>
          )}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleConfirmAmount}
              className={`flex-1 font-bold py-3 rounded-xl shadow-md transition-all duration-200 ${isDeposit ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
            >
              {mainActionLabel}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </>
      );
    }

    if (step === 1 && isDeposit) {
      return (
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Transfer the exact amount of:
          </p>
          <p className="text-4xl font-extrabold text-blue-600 mb-6 p-3 bg-blue-50 rounded-lg text-center">
            {formatCurrencyBRL(transferCents)}
          </p>

          <div className="space-y-4 p-4 bg-gray-100 rounded-lg mb-6">
            <h3 className="text-md font-semibold text-gray-700">
              PIX Key (Email):
            </h3>
            <p className="text-xl font-mono text-gray-900 break-all p-2 bg-white rounded border border-dashed border-gray-400">
              {COMPANY_PIX_KEY}
            </p>
          </div>

          <div className="text-sm text-gray-600 border-t pt-4 space-y-2">
            <p>
              <span className="font-semibold">Captured BTC Price:</span>{" "}
              {formatCurrencyBRL(capturedBtcPrice * 100)} / BTC
            </p>
            <p>
              <span className="font-semibold">Reservation Date/Time:</span>{" "}
              {new Date(depositTimestamp!).toLocaleString()}
            </p>
          </div>

          <button
            onClick={handleCancel}
            className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200"
          >
            Complete and Close
          </button>
        </div>
      );
    }

    if (step === 1 && !isDeposit) {
      return (
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Amount to withdraw:{" "}
            <span className="font-bold text-red-600">
              {formatCurrencyBRL(transferCents)}
            </span>
          </p>

          <div className="mb-2">
            <label
              htmlFor="client-pix"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your PIX key for receipt:
            </label>
            <input
              id="client-pix"
              type="text"
              value={clientPixKey}
              onChange={(e) => setClientPixKey(e.target.value)}
              placeholder="Ex: 11999999999 or email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-lg"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center font-medium">
              {error}
            </p>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleProcessTransfer}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200"
            >
              Request Withdrawal
            </button>
            <button
              onClick={() => setStep(0)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition-all duration-200"
            >
              Back
            </button>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="text-center">
          <p className="text-2xl text-red-700 font-bold mb-4">
            ❌ Insufficient Balance!
          </p>
          <p className="text-gray-700 mb-6">
            The requested amount ({formatCurrencyBRL(transferCents)}) exceeds
            your current balance of{" "}
            <span className="font-bold">
              {formatCurrencyBRL(currentBalanceCents)}
            </span>
            .
          </p>
          <button
            onClick={() => setStep(0)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="text-center">
          <p className="text-2xl text-green-700 font-bold mb-4">
            {isDeposit
              ? "✅ Deposit Request Created!"
              : "✅ Withdrawal Requested!"}
          </p>
          <p className="text-gray-700 mb-6">
            {isDeposit
              ? "Awaiting PIX confirmation to process your BTC purchase."
              : `The amount of ${formatCurrencyBRL(transferCents)} has been sent for processing.`}
          </p>
          <button
            onClick={handleCancel}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200"
          >
            Close
          </button>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all p-6 sm:p-8 ${isDeposit ? "border-t-4 border-blue-600" : "border-t-4 border-red-600"}`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          {title}
        </h2>
        {renderStepContent()}
      </div>
    </div>
  );
}
