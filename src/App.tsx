import React from "react";
import {
  Route, Routes,
} from 'react-router-dom';
import CoinLisitng from "./CoinListing";
import CoinDetails from "./CoinDetails";

const App: React.FC = () => (
  <div>
    <Routes>
      <Route path="/" element={<CoinLisitng />} />
      <Route path="/coin/:coinId" element={<CoinDetails />} />
    </Routes>
  </div>
);

export default App;
