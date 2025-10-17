"use client";

import { useState } from "react";
// CORREÇÃO: Alterando importação absoluta para relativa
import { trpc } from "../../../utils/trpc";
import { ClientDTO } from "@/types/client";

type Kind = "DEPOSIT" | "WITHDRAWAL";

type Props = {
  client: ClientDTO;
  kind: Kind;
  onClose: () => void;
  onSuccess?: () => void;
};

// Função auxiliar para formatar uma data para o input datetime-local (YYYY-MM-DDTHH:mm)
const formatDateTimeLocal = (date: Date) => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function TransactionModal({
  client,
  kind,
  onClose,
  onSuccess,
}: Props) {
  const [amount, setAmount] = useState("");
  // --- NOVOS CAMPOS PARA ADM ---
  // Inicializa a data/hora com o momento atual (default para o ADM)
  const [dateTime, setDateTime] = useState(formatDateTimeLocal(new Date()));
  const [btcPrice, setBtcPrice] = useState(""); // Preço do BTC no momento da transação agendada
  // --- FIM NOVOS CAMPOS ---
  const [note, setNote] = useState(""); // Mantido se você quiser usar em outra parte

  const createTx = trpc.transaction.create.useMutation({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. Validação do Montante BRL
    const parsedAmount = Number(amount.replace(",", "."));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
    const amountCents = BigInt(Math.round(parsedAmount * 100));

    // 2. Validação e Preparação dos Campos Manuais do ADM
    const parsedBtcPrice = Number(btcPrice.replace(",", "."));
    if (!Number.isFinite(parsedBtcPrice) || parsedBtcPrice <= 0) {
      // Se o preço do BTC for inválido, interrompe. O ADM deve preenchê-lo.
      return;
    }

    // Cria um objeto Date a partir da string datetime-local
    const occurredAtDate = new Date(dateTime);

    // Converte o preço do BTC para string, como esperado pelo schema do tRPC
    const manualBtcPriceString = parsedBtcPrice.toString();

    // 3. Executa a Mutação
    createTx.mutate({
      clientId: client.id,
      type: kind,
      amountCents,

      // Enviando os campos manuais que o backend espera do ADM
      occurredAt: occurredAtDate,
      manualBtcPrice: manualBtcPriceString,
    } as any);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md rounded-xl bg-neutral-800 text-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-700">
          <h3 className="text-lg font-semibold">
            {kind === "DEPOSIT" ? "New Deposit" : "New Withdrawal"} —{" "}
            {client.name}
          </h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Campo de Montante (BRL) - Permanece o mesmo */}
          <div>
            <label className="block text-sm mb-1">Amount (BRL)</label>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000.00"
              className="w-full rounded-lg bg-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* NOVO CAMPO: Data e Hora da Transação (occurredAt) */}
          <div>
            <label className="block text-sm mb-1">
              Transaction Date/Time (ADM Manual)
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full rounded-lg bg-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* NOVO CAMPO: Preço do BTC (manualBtcPrice) */}
          <div>
            <label className="block text-sm mb-1">
              BTC Price (BRL) at Transaction Time (ADM Manual)
            </label>
            <input
              inputMode="decimal"
              value={btcPrice}
              onChange={(e) => setBtcPrice(e.target.value)}
              placeholder="350000.00"
              className="w-full rounded-lg bg-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={createTx.isPending}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 font-medium transition-colors"
          >
            {createTx.isPending ? "Saving..." : "Confirm"}
          </button>

          {createTx.error && (
            <p className="text-red-400 text-sm mt-2">
              {createTx.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
