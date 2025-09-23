import { trpc } from "@/utils/trpc";
import { ClientDTO } from "@/types/client";
import { TransactionDTO } from "@/types/transaction";

export default function ClientModal({
  client,
  onClose,
}: {
  client: ClientDTO;
  onClose: () => void;
}) {
  const { data: transactions, isLoading } =
    trpc.transaction.listByCustomer.useQuery({ customerId: client.id });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Transactions of {client.name}
        </h2>

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
      </div>
    </div>
  );
}
