import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinList } from "./services";
import CoinTable from "./components/CoinTable";

const CoinLisitng: React.FC = () => {
  const {
    // isLoading: isCoinListDataLoading,
    data: coinListData,
    // isError: coinListError,
  } = useQuery({
    queryKey: ["coinList"],
    queryFn: fetchCoinList,
  });

  return (
    <div className="h-screen flex justify-center items-center w-screen">
      {coinListData && <CoinTable coinsList={coinListData.data} />}
    </div>
  );
};

export default CoinLisitng;
