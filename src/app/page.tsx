"use client";

import Link from "next/link";
import Head from "next/head";
import { trpc } from "@/utils/trpc";

export default function HomePage() {
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
        />
      </Head>

      {/* HEADER (white background, logo left, buttons right) */}
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-[#02020A]">
            Bitcoin <span className="text-[#ECA400]">Fácil</span>
          </h1>

          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-[#ECA400] text-white font-medium hover:bg-[#d49400] transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-4 py-2 rounded-md border border-[#ECA400] text-[#ECA400] font-medium hover:bg-[#ECA400] hover:text-white transition"
            >
              Cadastre-se
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO (all centered) */}
      <main className="bg-white">
        <section className="w-full max-w-4xl mx-auto py-16 px-4 grid place-items-center text-center">
          <p className="text-lg font-medium text-[#02020A]">
            Preço Atual do <span className="text-[#ECA400]">Bitcoin</span>
          </p>

          <div className="my-4 text-3xl font-semibold text-[#ECA400]">
            {isLoading && "Carregando..."}
            {error && "Indisponível"}
            {btcPrice && `R$ ${btcPrice.toFixed(2)}`}
          </div>

          <h2 className="text-3xl font-bold text-[#02020A] mb-4">
            A maneira mais fácil e segura de investir.
          </h2>

          <p className="text-[#02020A] text-lg leading-relaxed mb-8 max-w-2xl">
            Somos especialistas em{" "}
            <strong className="text-[#ECA400]">Bitcoin</strong> e{" "}
            <strong className="text-[#ECA400]">Dólar</strong>. Aqui você investe
            sem pagar{" "}
            <strong className="text-[#ECA400]">taxa de corretagem</strong> e
            conta com{" "}
            <strong className="text-[#ECA400]">suporte personalizado</strong>{" "}
            para guiar seus primeiros passos no mercado.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-6 w-full">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-md bg-[#ECA400] text-white font-semibold shadow hover:bg-[#d49400] transition"
            >
              Começar Agora
            </Link>

            <Link
              href="/login"
              className="px-6 py-3 rounded-md border border-[#ECA400] text-[#ECA400] font-semibold hover:bg-[#ECA400] hover:text-white transition"
            >
              Já tenho conta
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER (centered content) */}
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-6 text-[#02020A]">
          <div className="flex flex-col items-center gap-4 text-center">
            <p>
              © {new Date().getFullYear()} BitFácil. Todos os direitos
              reservados.
            </p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-[#ECA400] transition">
                Termos
              </Link>
              <Link href="/privacy" className="hover:text-[#ECA400] transition">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
