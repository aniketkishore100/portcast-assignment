import React from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartData,
  ChartOptions, // Import the TimeScale
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { fetchCoinDetail, fetchCoinHistory } from './services';
import 'chartjs-adapter-date-fns';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const CoinDetails = () => {
  const { coinId } = useParams<{ coinId: string }>();

  const {
    isLoading: coinDetailDataLoading,
    data: coinDetailData,
    // isError: coinListError,
  } = useQuery({
    queryKey: ["coinDetail", coinId],
    queryFn: () => fetchCoinDetail(coinId as string),
  });
  const {
    isLoading: priceHistoryLoading,
    data: priceHistory,
    // isError: coinListError,
  } = useQuery({
    queryKey: ["coinHistory", coinId],
    queryFn: () => fetchCoinHistory(coinId as string),
  });

  const chartData: ChartData<"line"> = {
    labels: (priceHistory || []).map((dataPoint) => new Date(dataPoint.time).toLocaleDateString()),
    datasets: [
      {
        label: "Price (USD)",
        data: (priceHistory || []).map((dataPoint) => parseFloat(dataPoint.priceUsd)),
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
      },
    ],
  };
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="h-screen  w-screen px-4 sm:px-6 lg:px-8">
      <div className="mt-10">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {coinId?.toUpperCase()}({coinDetailData && coinDetailData.symbol})
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A detailed view of {coinDetailData && coinDetailData.name} coin.
          </p>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg px-8 py-4">
                <p className="text-sm font-medium leading-6 text-gray-900">
                  Rank: {coinDetailData && coinDetailData.rank}
                </p>
                <p className="text-sm font-medium leading-6 text-gray-900">
                  Max Supply: {coinDetailData && Number(coinDetailData.maxSupply || 0).toFixed(2) }
                </p>
                <p className="text-sm font-medium leading-6 text-gray-900">
                  Market Cap(USD): {coinDetailData && Number(coinDetailData.marketCapUsd || 0).toFixed(2) }
                </p>
                <p className="text-sm font-medium leading-6 text-gray-900">
                  Price(USD): {coinDetailData && Number(coinDetailData.priceUsd || 0).toFixed(2) }
                </p>
                <div className="flex gap-x-2 text-sm items-center">
                  <p className=" font-medium leading-6 text-gray-900">
                    Official Website :
                  </p>
                  <a className="text-blue-700" href={coinDetailData && coinDetailData.explorer}>{coinDetailData && coinDetailData.explorer}</a>
                </div>
                <p className="text-base font-semibold leading-6 text-gray-900">
                  Price History
                </p>
                {priceHistoryLoading
                  ? <div />
                  : (
                    <div className="w-full h-96">
                      <Line data={chartData} options={chartOptions} />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
