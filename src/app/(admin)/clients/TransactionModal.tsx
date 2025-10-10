"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ClientDTO } from "@/types/client";

type Kind = "DEPOSIT" | "WITHDRAWAL";

type Props = {
  client: ClientDTO;
  kind: Kind;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function TransactionModal({
  client,
  kind,
  onClose,
  onSuccess,
}: Props) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const createTx = trpc.transaction.create.useMutation({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(amount.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    const amountCents = BigInt(Math.round(parsed * 100));

    createTx.mutate({
      clientId: client.id,
      type: kind, // back-end espera 'type'
      amountCents, // back-end espera valor em centavos
      btcValue: BigInt(0), // placeholder por enquanto
      price_brl_per_btc: "0", // placeholder por enquanto
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

          <div>
            <label className="block text-sm mb-1">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Short note"
              className="w-full rounded-lg bg-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={createTx.isPending}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 font-medium"
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
