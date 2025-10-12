"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ClientDTO } from "@/types/client";
import ClientTable from "./ClientTable";
import ClientModal from "./ClientModal";
import TransactionModal from "./TransactionModal";
import { signOut } from "next-auth/react"; // Já estava aqui, o que é ótimo!

type TxKind = "DEPOSIT" | "WITHDRAWAL";

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [txClient, setTxClient] = useState<ClientDTO | null>(null);
  const [txKind, setTxKind] = useState<TxKind | null>(null);

  const {
    data: clients,
    isLoading,
    error,
    refetch,
  } = trpc.client.listForAdmin.useQuery(
    { limit: 20 },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );

  function handleDeposit(c: ClientDTO) {
    setTxClient(c);
    setTxKind("DEPOSIT");
  }

  function handleWithdraw(c: ClientDTO) {
    setTxClient(c);
    setTxKind("WITHDRAWAL");
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-neutral-800 rounded-lg shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-semibold tracking-wide">Clients</h1>

          <div className="flex space-x-4">
            {/* NOVO BOTÃO DE LOGOUT AQUI */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white font-medium"
            >
              Logout
            </button>

            <button
              onClick={() => setIsCreating(true)}
              className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
            >
              New Client
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        {isLoading && <p className="text-gray-400">Loading clients...</p>}
        {error && (
          <p className="text-red-500 font-medium">
            Error loading clients. Try again.
          </p>
        )}

        {clients && clients.length > 0 ? (
          <ClientTable
            clients={clients.map((c) => ({
              id: c.id,
              name: c.name,
              email: c.email ?? "",
              phone: c.phone ?? "",
              cpf: (c as any).cpf ?? "",
              transactionsCount: c._count.transactions,
              hashedPassword: (c as any).hashedPassword ?? "",
              walletRef: (c as any).walletRef,
            }))}
            onSelectClient={(client) => setSelectedClient(client)}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
        ) : (
          !isLoading && (
            <p className="text-center text-gray-400 mt-6">No clients found.</p>
          )
        )}

        {/* Modal de Client */}
        {(selectedClient || isCreating) && (
          <ClientModal
            client={selectedClient as ClientDTO}
            isCreating={isCreating}
            onClose={() => {
              setSelectedClient(null);
              setIsCreating(false);
            }}
            onClientChanged={refetch}
          />
        )}

        {/* Modal de Transação */}
        {txClient && txKind && (
          <TransactionModal
            client={txClient}
            kind={txKind}
            onClose={() => {
              setTxClient(null);
              setTxKind(null);
            }}
            onSuccess={refetch}
          />
        )}
      </div>
    </div>
  );
}
