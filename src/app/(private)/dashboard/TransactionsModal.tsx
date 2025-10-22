"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { formatCurrencyBRL } from "@/lib/money";

interface TransactionModalProps {
  type: "DEPOSIT" | "WITHDRAWAL";
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

export default function TransactionModal({
  type,
  isOpen,
  onClose,
  clientId,
}: TransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = trpc.useUtils();

  const mutation = trpc.transaction.create.useMutation({
    onSuccess: async () => {
      await utils.clients.getTransactions.invalidate();
      onClose();
      setAmount("");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return alert("Informe um valor válido.");

    setIsSubmitting(true);

    try {
      const amountCents = BigInt(Math.round(parseFloat(amount) * 100));

      await mutation.mutateAsync({
        clientId,
        type,
        amountCents,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDeposit = type === "DEPOSIT";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {isDeposit ? "Fazer Depósito" : "Solicitar Saque"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo comum para ambos */}
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-2">
              Valor (em reais)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 100.00"
            />
          </div>

          {/* Inputs ou informações específicas */}
          {isDeposit ? (
            <div className="text-sm text-gray-500">
              O valor será convertido automaticamente em Bitcoin no momento do
              depósito, com base na cotação atual.
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                O saque será realizado conforme o saldo disponível em BTC.
              </p>
              <p className="text-sm text-gray-500">
                Cotação do Bitcoin será capturada automaticamente no momento da
                solicitação.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold py-3 rounded-lg text-white transition-all duration-300 ${
              isDeposit
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isSubmitting
              ? isDeposit
                ? "Processando depósito..."
                : "Processando saque..."
              : isDeposit
                ? "Confirmar Depósito"
                : "Confirmar Saque"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
