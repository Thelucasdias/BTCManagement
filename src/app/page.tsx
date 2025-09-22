"use client";

import Link from "next/link";
import { trpc } from "@/utils/trpc";
import Head from "next/head";

export default function Page() {
  const {
    data: btcPrice,
    isLoading,
    error,
  } = trpc.public.getBtcPrice.useQuery();

  return (
    <>
      <Head>
        <title>Plataforma de Investimento em Bitcoin e Dólar | Taxa Zero</title>
        <meta
          name="description"
          content="A plataforma mais fácil e segura para investir em Bitcoin e Dólar. Taxa de corretagem gratuita e suporte personalizado."
        ></meta>
      </Head>

      <header className="bg-gray-800 text-white p-4">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">InvestMax</h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 border rounded hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Cadastre-se
            </Link>
          </div>
        </nav>
      </header>

      <main className="text-center py-20 bg-gray-900 text-white">
        <section className="max-w-4xl mx-auto px-4">
          <p className="text-2xl mb-4 font-light">Preço do Bitcoin (BTC)</p>
          <div className="text-6xl font-bold text-green-500 mb-6">
            {isLoading && "Carregando..."}
            {error && "Indisponível"}
            {btcPrice && `R$ ${btcPrice.toFixed(2)}`}
          </div>

          <div className="mt-12">
            <h2 className="text-4xl font-semibold mb-4">
              A maneira mais fácil e segura de investir.
            </h2>
            <p className="text-xl font-light leading-relaxed">
              Totalmente focados em **Bitcoin** e **Dólar**, somos a única
              plataforma com **taxa de corretagem gratuita** e **suporte
              personalizado**. Sua jornada de investimento começa aqui.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
