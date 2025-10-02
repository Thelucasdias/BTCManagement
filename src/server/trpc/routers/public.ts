import { createTRPCRouter, publicProcedure } from "../trpc";

export const publicRouter = createTRPCRouter({
  getBtcPrice: publicProcedure.query(async () => {
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
      console.error("Erro ao buscar preço do BTC:", error);
      throw new Error("Preço indisponível no momento.");
    }
  }),
});
