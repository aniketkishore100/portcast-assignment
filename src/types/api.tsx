export interface CoinData {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

export interface CoinListApiResponse {
  data: CoinData[];
}

export interface CoinDetailApiResponse {
  data: CoinData;
  timestamp: number;
}

export interface CoinHistoryData {
  time: number;
  priceUsd: string;
}

export interface CoinHistoryResponse {
  data: CoinHistoryData[];
}
