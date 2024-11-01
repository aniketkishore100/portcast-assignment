import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { classNames } from "../helpers";
import { CoinData } from "../types/api";

type CoinTableProps = {
  coinsList: CoinData[];
  toggleFavorite: (coinId: string) => void;
  isFavourite: (coinId: string) => boolean;
};

const CoinTable: React.FC<CoinTableProps> = ({ coinsList, toggleFavorite, isFavourite }) => {
  const [realTimePrices, setRealTimePrices] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (coinsList.length === 0) return () => null;

    const ids = coinsList.map((coin) => coin.id).join(",");
    const socket = new WebSocket(
      `wss://ws.coincap.io/prices?assets=${ids}`
    );

    socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as { [symbol: string]: string };
        setRealTimePrices((prevPrices) => ({
          ...prevPrices,
          ...data,
        }));
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    return () => {
      socket.close();
    };
  }, [coinsList]);

  return (
    <div className="w-full">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8 w-[25%]"
                    >
                      Symbol
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell w-[25%]"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell w-[25%]"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter w-[25%]"
                    >
                      Market Cap(USD)
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8 w-[10%]"
                    >
                      Favourites
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coinsList.map((coin, coinIdx) => (
                    <tr
                      key={coin.id}
                      className="even:bg-gray-50 hover:bg-slate-100 cursor-pointer"
                    >

                      <td
                        className={classNames(
                          coinIdx !== coinsList.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                        )}
                      >
                        {coin.symbol}
                      </td>
                      <td
                        className={classNames(
                          coinIdx !== coinsList.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell hover:underline"
                        )}
                      >
                        <Link to={`/coin/${coin.id}`}>{coin.name}</Link>
                      </td>
                      <td
                        className={classNames(
                          coinIdx !== coinsList.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {(realTimePrices[coin.id] && Number(realTimePrices[coin.id]).toFixed(2))
                        || (coin.priceUsd && Number(coin.priceUsd).toFixed(2))}
                      </td>
                      <td
                        className={classNames(
                          coinIdx !== coinsList.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        )}
                      >
                        {coin.marketCapUsd && Number(coin.marketCapUsd).toFixed(2)}
                      </td>
                      <td
                        className={classNames(
                          coinIdx !== coinsList.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm items-center font-medium text-gray-900 sm:pl-6 lg:pl-8"
                        )}
                      >
                        <button type="button" onClick={() => toggleFavorite(coin.id)}>
                          {isFavourite(coin.id)
                            ? <img src="/star-golden.png" alt="selected" className="w-4 h-4" />
                            : <img src="/star-outline.png" alt="unselected" className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinTable;
