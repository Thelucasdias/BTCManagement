// src/app/(admin)/clients/ClientTable.tsx
import { ClientDTO } from "@/types/client";

type Props = {
  clients: ClientDTO[];
  onSelectClient: (client: ClientDTO) => void;
  onDeposit: (client: ClientDTO) => void;
  onWithdraw: (client: ClientDTO) => void;
};

export default function ClientTable({
  clients,
  onSelectClient,
  onDeposit,
  onWithdraw,
}: Props) {
  return (
    <table className="w-full border-collapse rounded-lg overflow-hidden text-white">
      <thead className="bg-neutral-800 text-white">
        <tr>
          <th className="p-3 text-left font-semibold">Name</th>
          <th className="p-3 text-left font-semibold">Email</th>
          <th className="p-3 text-left font-semibold">Phone</th>
          <th className="p-3 text-left font-semibold">CPF</th>
          <th className="p-3 text-center font-semibold">Transactions</th>
          <th className="p-3 text-center font-semibold">Actions</th>
        </tr>
      </thead>

      <tbody>
        {clients.map((c) => (
          <tr
            key={c.id}
            className="border-t border-gray-700 hover:bg-neutral-700 transition-colors"
          >
            <td className="p-3">{c.name}</td>
            <td className="p-3">{c.email}</td>
            <td className="p-3">{c.phone}</td>
            <td className="p-3">{c.cpf}</td>
            <td className="p-3 text-center">{c.transactionsCount}</td>
            <td className="p-3">
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => onSelectClient(c)}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
                >
                  View
                </button>
                <button
                  onClick={() => onDeposit(c)}
                  className="px-4 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors shadow-sm"
                >
                  Deposit
                </button>
                <button
                  onClick={() => onWithdraw(c)}
                  className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-sm"
                >
                  Withdraw
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
