import axios from "axios";
import { CoinHistoryResponse, CoinListApiResponse } from "./types/api";

export const fetchCoinList = async (favourites: string[], pageNumber: number) => {
  try {
    const response = await axios.get<CoinListApiResponse>(
      `https://api.coincap.io/v2/assets`,
      {
        params: (favourites.length > 0)
          ? { ids: favourites.join(",") } : {
            limit: 10,
            offset: (pageNumber - 1) * 10,
          },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};

export const fetchCoinDetails = async (coinId: string) => {
  try {
    const end = Date.now();

    const start = end - 30 * 24 * 60 * 60 * 1000;
    const response = await axios.get<CoinHistoryResponse>(
      `https://api.coincap.io/v2/assets/${coinId}/history`,
      {
        params: {
          interval: 'd1',
          start,
          end,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching coin history data:", error);
    throw error;
  }
};
