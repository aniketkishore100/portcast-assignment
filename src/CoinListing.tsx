import React, {
  useCallback, useEffect, useMemo, useState
} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinList } from "./services";
import CoinTable from "./components/CoinTable";
import SortingDropdown from "./components/SortingDropdown";
import Loader from "./components/Loader";

const LISTING_PAGE_NUMBER = 'page';
const totalCount = 100;

const CoinLisitng: React.FC = () => {
  const [favourites, setFavourites] = useState<string[]>(() => {
    const storedFavourites = localStorage.getItem('favourites');
    return storedFavourites ? (JSON.parse(storedFavourites) as string[]) : [];
  });
  const [selectedSortingOption, setSelectedSortingOption] = useState(localStorage.getItem('sorting') || 'None');
  const [showFavourites, setShowFavourites] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState(parseInt(localStorage.getItem(LISTING_PAGE_NUMBER) || '1', 10),);

  useEffect(() => {
    localStorage.setItem(LISTING_PAGE_NUMBER, String(pageNumber));
  }, [pageNumber]);

  const goToNextPage = useCallback(() => {
    const numberOfPages = Math.ceil(totalCount / 10);
    if (pageNumber === numberOfPages) {
      return;
    }
    setPageNumber((prev) => prev + 1);
  }, [pageNumber]);

  const goToPreviousPage = useCallback(() => {
    if (pageNumber === 1) {
      return;
    }
    setPageNumber((prev) => prev - 1);
  }, [pageNumber]);

  const {
    isLoading: isCoinListDataLoading,
    data: coinListData,
  } = useQuery({
    queryKey: ["coinList", showFavourites, pageNumber],
    queryFn: () => fetchCoinList(showFavourites ? favourites : [], pageNumber),
  });

  const sortedCoinsList = useMemo(() => {
    if (!coinListData?.data) return [];

    if (selectedSortingOption === 'Symbol') {
      return [...coinListData.data].sort((a, b) => {
        const symbolA = a.symbol.toUpperCase();
        const symbolB = b.symbol.toUpperCase();
        return symbolA < symbolB ? -1 : symbolA > symbolB ? 1 : 0;
      });
    }
    if (selectedSortingOption === 'Name') {
      return [...coinListData.data].sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      });
    }
    return coinListData?.data;
  }, [coinListData, selectedSortingOption]);

  const toggleFavorite = (coinId: string) => {
    const updatedFavourites = favourites.includes(coinId)
      ? favourites.filter((id) => id !== coinId)
      : [...favourites, coinId];

    setFavourites(updatedFavourites);
    localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  };

  const isFavourite = (coinId: string) => favourites.includes(coinId);

  const handleSortingOption = (option: string) => {
    localStorage.setItem('sorting', option);
    setSelectedSortingOption(option);
  };

  return (
    <div className="h-screen  w-screen px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mt-10">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {showFavourites && 'Favourite '}Coins
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of {showFavourites ? 'your favourite' : 'popular'} cryptocurrencies, including their name, symbol,
            market cap, price.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <SortingDropdown selectedSortingOption={selectedSortingOption} handleSortingOption={handleSortingOption} />
        </div>
        <div className="mt-4 sm:ml-8 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className=" block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setShowFavourites((prevState) => !prevState)}
          >
            {showFavourites ? 'Hide ' : 'Show '}Favourites
          </button>
        </div>
      </div>
      {
      isCoinListDataLoading
        ? <div className="w-full flex justify-center h-52 items-center"><Loader /></div>
        : (
          <div>
            {showFavourites && favourites.length === 0
              ? (
                <div className="w-full flex justify-center h-52 items-center">
                  <p className="text-base font-semibold">
                    No Data Found!
                  </p>
                </div>
              )
              : (
                <div>
                  {coinListData && <CoinTable coinsList={sortedCoinsList} toggleFavorite={toggleFavorite} isFavourite={isFavourite} />}
                </div>
              )}
            {!showFavourites && (
            <nav
              aria-label="Pagination"
              className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pageNumber - 1) * 10 + 1}</span> to <span className="font-medium">{(pageNumber - 1) * 10 + 10}</span> of{' '}
                  <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goToNextPage}
                  className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                  Next
                </button>
              </div>
            </nav>
            )}
          </div>
        )
      }

    </div>
  );
};

export default CoinLisitng;
