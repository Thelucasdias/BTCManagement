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

      {/* HEADER */}
      <header>
        <nav>
          <h1>InvestMax</h1>
          <div>
            <Link href="/login">Login</Link>
            <Link href="/signup">Cadastre-se</Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <main>
        <section>
          <p>Preço Atual do Bitcoin</p>

          <div>
            {isLoading && "Carregando..."}
            {error && "Indisponível"}
            {btcPrice && `R$ ${btcPrice.toFixed(2)}`}
          </div>

          <h2>A maneira mais fácil e segura de investir.</h2>
          <p>
            Somos especialistas em <strong>Bitcoin</strong> e{" "}
            <strong>Dólar</strong>. Aqui você investe sem pagar{" "}
            <strong>taxa de corretagem</strong> e conta com{" "}
            <strong>suporte personalizado</strong> para guiar seus primeiros
            passos no mercado.
          </p>

          <div>
            <Link href="/signup">Começar Agora</Link>
            <Link href="/login">Já tenho conta</Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div>
          <p>
            © {new Date().getFullYear()} InvestMax. Todos os direitos
            reservados.
          </p>
          <div>
            <Link href="/termos">Termos</Link>
            <Link href="/privacidade">Privacidade</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
