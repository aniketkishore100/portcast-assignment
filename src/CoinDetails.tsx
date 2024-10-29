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
import { fetchCoinDetails } from './services';
import 'chartjs-adapter-date-fns';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const CoinDetails = () => {
  const { coinId } = useParams<{ coinId: string }>();

  const {
    isLoading: priceHistoryLoading,
    data: priceHistory,
    // isError: coinListError,
  } = useQuery({
    queryKey: ["coinDetails"],
    queryFn: () => fetchCoinDetails(coinId as string),
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
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold mb-4">Price History for {coinId?.toUpperCase()}</h1>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">

                  {priceHistoryLoading
                    ? <div />
                    : (
                      <div className="w-full h-64 bg-white px-8">
                        <Line data={chartData} options={chartOptions} />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
