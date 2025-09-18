"use client";

import { trpc } from "@/trpc/provider";

export default function Page() {
  const { data, isLoading, error } = trpc.transaction.listByCustomer.useQuery({
    customerId: "algum-id-aqui",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h1>Transactions</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
