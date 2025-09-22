// src/server/trpc/routers/public.ts

import { createTRPCRouter, publicProcedure } from "../trpc";

export const publicRouter = createTRPCRouter({
  getBtcPrice: publicProcedure.query(async () => {
    // URL da API do CoinGecko para obter o preço do Bitcoin em BRL
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Falha ao obter o preço do Bitcoin.");
      }
      const data = await response.json();
      const btcPrice = data.bitcoin.brl;
      return btcPrice;
    } catch (error) {
      // Se a chamada falhar, retorne um valor padrão ou lance um erro
      console.error("Erro ao buscar preço do BTC:", error);
      throw new Error("Preço indisponível no momento.");
    }
  }),
});
