"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ClientDTO } from "@/types/client";
import ClientTable from "./ClientTable";
import ClientModal from "./ClientModal";

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const {
    data: clients,
    isLoading,
    error,
    refetch,
  } = trpc.client.listForAdmin.useQuery({ limit: 20 });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl p-6 bg-white rounded shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Novo Cliente
          </button>
        </div>

        {/* Conteúdo */}
        {isLoading && <p>Loading clients...</p>}
        {error && <p className="text-red-600">Error loading clients</p>}

        {clients && clients.length > 0 ? (
          <ClientTable
            clients={clients.map((c) => ({
              id: c.id,
              name: c.name,
              email: c.email ?? "",
              phone: c.phone ?? "",
              cpf: (c as any).cpf ?? "",
              transactionsCount: c._count.transactions,
            }))}
            onSelectClient={(client) => setSelectedClient(client)}
          />
        ) : (
          !isLoading && <p className="text-center">No clients found</p>
        )}

        {/* Modal para criar/editar/deletar */}
        {(selectedClient || isCreating) && (
          <ClientModal
            client={selectedClient ?? undefined}
            isCreating={isCreating}
            onClose={() => {
              setSelectedClient(null);
              setIsCreating(false);
            }}
            onClientChanged={refetch}
          />
        )}
      </div>
    </div>
  );
}
