import axios from "axios";
import { CoinListApiResponse } from "./types/api";

export const fetchCoinList = async () => {
  try {
    const response = await axios.get<CoinListApiResponse>(
      "https://api.coincap.io/v2/assets?limit=10&offset=0"
    );
    return response.data; // Returns both data and timestamp, correctly typed
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};
