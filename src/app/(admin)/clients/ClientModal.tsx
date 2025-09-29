import { trpc } from "@/utils/trpc";
import { ClientDTO } from "@/types/client";
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
<<<<<<< HEAD
  onClientChanged,
}: {
  client?: ClientDTO; // agora é opcional
  isCreating?: boolean; // se true = modo criar
  onClose: () => void;
  onClientChanged: () => void; // callback para refetch
}) {
  // form state
  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [cpf, setCpf] = useState((client as any)?.cpf ?? "");

  // mutations
  const createClient = trpc.client.create.useMutation({
    onSuccess: () => {
      onClientChanged();
      onClose();
    },
  });

  const updateClient = trpc.client.update.useMutation({
    onSuccess: () => {
      onClientChanged();
      onClose();
    },
  });

  const deleteClient = trpc.client.delete.useMutation({
    onSuccess: () => {
      onClientChanged();
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
=======
  isCreating,
  onClientChanged,
}: ClientModalProps) {
  if (isCreating) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-[600px] relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600"
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold mb-4">Create New Client</h2>
          <p>Formulário de cadastro vai aqui...</p>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const { data: transactions, isLoading } =
    trpc.transaction.listByClient.useQuery({ clientId: client.id });
>>>>>>> a5d3e45c331e9ad5a982c5c4135f5be06fbd398e

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {isCreating ? "New Client" : `Edit Client: ${client?.name}`}
        </h2>
<<<<<<< HEAD

        {/* Form */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full border p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="CPF"
            className="w-full border p-2 rounded"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4">
          {!isCreating && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {isCreating ? "Create" : "Save"}
          </button>
        </div>
=======
        {isLoading && <p>Loading...</p>}
        {transactions && transactions.length > 0 ? (
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {transactions.map((t: TransactionDTO) => (
              <li key={t.id} className="border p-2 rounded">
                <p>
                  <strong>Type:</strong> {t.type}
                </p>
                <p>
                  <strong>Amount:</strong> {(t.amount_cents / 100).toFixed(2)}{" "}
                  BRL
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
          <p>No transactions found</p>
        )}
>>>>>>> a5d3e45c331e9ad5a982c5c4135f5be06fbd398e
      </div>
    </div>
  );
}
