import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";

export const publicRouter = createTRPCRouter({
  getBtcPrice: publicProcedure.query(async () => {
    try {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: { ids: "bitcoin", vs_currencies: "brl" },
          timeout: 5000,
        }
      );

      return data.bitcoin.brl as number;
    } catch (error) {
      console.error("Erro ao buscar preço do BTC:", error);
      throw new Error("Preço indisponível no momento.");
    }
  }),
});
