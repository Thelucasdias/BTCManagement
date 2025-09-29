import { trpc } from "@/utils/trpc";
import { ClientDTO } from "@/types/client";
import { TransactionDTO } from "@/types/transaction";
import { useState } from "react";

export type ClientModalProps = {
  client?: ClientDTO;
  onClose: () => void;
  isCreating: boolean;
  onClientChanged?: () => void;
};

export default function ClientModal({
  client,
  isCreating = false,
  onClose,
  onClientChanged,
}: ClientModalProps) {
  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [cpf, setCpf] = useState((client as any)?.cpf ?? "");

  const createClient = trpc.client.create.useMutation({
    onSuccess: () => {
      onClientChanged?.();
      onClose();
    },
  });

  const updateClient = trpc.client.update.useMutation({
    onSuccess: () => {
      onClientChanged?.();
      onClose();
    },
  });

  const deleteClient = trpc.client.delete.useMutation({
    onSuccess: () => {
      onClientChanged?.();
      onClose();
    },
  });

  function handleSave() {
    if (isCreating) {
      createClient.mutate({ name, email, phone, cpf });
    } else if (client) {
      updateClient.mutate({ id: client.id, name, email, phone, cpf });
    }
  }

  function handleDelete() {
    if (client && confirm("Are you sure you want to delete this client?")) {
      deleteClient.mutate({ id: client.id });
    }
  }

  const { data: transactions, isLoading } =
    client && !isCreating
      ? trpc.transaction.listByClient.useQuery({ clientId: client.id })
      : { data: [], isLoading: false };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-900 text-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white transition"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
          {isCreating ? "Create New Client" : `Edit Client: ${client?.name}`}
        </h2>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="CPF"
            className="w-full bg-gray-800 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {!isCreating && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white font-medium"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition text-white font-medium"
          >
            {isCreating ? "Create" : "Save"}
          </button>
        </div>

        {/* Transactions */}
        {!isCreating && client && (
          <div className="mt-6">
            {isLoading && <p className="text-gray-400">Loading...</p>}
            {transactions && transactions.length > 0 ? (
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {transactions.map((t: TransactionDTO) => (
                  <li
                    key={t.id}
                    className="bg-gray-800 p-3 rounded border border-gray-700"
                  >
                    <p>
                      <strong>Type:</strong> {t.type}
                    </p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      {(t.amount_cents / 100).toFixed(2)} BRL
                    </p>
                    <p>
                      <strong>BTC:</strong> {t.btc_sats} sats
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(t.date).toLocaleString("pt-BR")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No transactions found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
