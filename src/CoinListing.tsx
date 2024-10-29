import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinList } from "./services";
import CoinTable from "./components/CoinTable";

const CoinLisitng: React.FC = () => {
  const [favourites, setFavourites] = useState<string[]>(() => {
    const storedFavourites = localStorage.getItem('favourites');
    return storedFavourites ? (JSON.parse(storedFavourites) as string[]) : [];
  });
  const [showFavourites, setShowFavourites] = useState<boolean>(false);

  const {
    // isLoading: isCoinListDataLoading,
    data: coinListData,
    // isError: coinListError,
  } = useQuery({
    queryKey: ["coinList", showFavourites],
    queryFn: () => fetchCoinList(showFavourites ? favourites : []),
  });

  const toggleFavorite = (coinId: string) => {
    const updatedFavourites = favourites.includes(coinId)
      ? favourites.filter((id) => id !== coinId)
      : [...favourites, coinId];

    setFavourites(updatedFavourites);
    localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  };

  const isFavourite = (coinId: string) => favourites.includes(coinId);

  return (
    <div className="h-screen  w-screen px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mt-10">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {showFavourites && 'Favourite '}Coins
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of popular cryptocurrencies, including their name, symbol,
            market cap, price.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className=" block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setShowFavourites((prevState) => !prevState)}
          >
            {showFavourites ? 'Hide ' : 'Show '}Favourites
          </button>
        </div>
      </div>
      {coinListData && <CoinTable coinsList={coinListData.data} toggleFavorite={toggleFavorite} isFavourite={isFavourite} />}
    </div>
  );
};

export default CoinLisitng;
