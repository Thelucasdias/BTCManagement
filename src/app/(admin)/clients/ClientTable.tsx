import { ClientDTO } from "@/types/client";

export default function ClientTable({
  clients,
  onSelectClient,
}: {
  clients: ClientDTO[];
  onSelectClient: (client: ClientDTO) => void;
}) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Phone</th>
          <th className="p-2">CPF</th>
          <th className="p-2">Transactions</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((c) => (
          <tr key={c.id} className="border-t">
            <td className="p-2">{c.name}</td>
            <td className="p-2">{c.email}</td>
            <td className="p-2">{c.phone}</td>
            <td className="p-2">{c.cpf}</td>
            <td className="p-2 text-center">{c.transactionsCount}</td>
            <td className="p-2 space-x-2">
              <button
                className="text-blue-600 underline"
                onClick={() => onSelectClient(c)}
              >
                View
              </button>
              <button className="text-green-600 underline">Deposit</button>
              <button className="text-red-600 underline">Withdraw</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
