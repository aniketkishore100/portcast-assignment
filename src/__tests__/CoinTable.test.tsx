/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CoinTable from '../components/CoinTable';
import { CoinData } from '../types/api';

const mockToggleFavorite = jest.fn();
const mockIsFavourite = jest.fn();

const coinsList: CoinData[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: '45000.00',
    marketCapUsd: '850000000000',
    supply: '18700000',
    maxSupply: '21000000',
    changePercent24Hr: '2.0',
    vwap24Hr: '44000.00',
    volumeUsd24Hr: '1200000000',
    explorer: 'https://blockchain.info',
    rank: ''
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: '3000.00',
    marketCapUsd: '350000000000',
    supply: '114000000',
    maxSupply: null,
    changePercent24Hr: '1.0',
    vwap24Hr: '2950.00',
    volumeUsd24Hr: '800000000',
    explorer: 'https://etherscan.io',
    rank: ''
  },
];

describe('CoinTable', () => {
  beforeEach(() => {
    mockToggleFavorite.mockClear();
    mockIsFavourite.mockClear();
  });

  test('renders CoinTable with coin data', () => {
    render(
      <MemoryRouter>
        <CoinTable
          coinsList={coinsList}
          toggleFavorite={mockToggleFavorite}
          isFavourite={mockIsFavourite}
        />
      </MemoryRouter>
    );

    // Check if the coins are displayed
    expect(screen.getByText(/bitcoin/i)).toBeInTheDocument();
    expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
  });

  test('calls toggleFavorite when favorite button is clicked', () => {
    mockIsFavourite.mockReturnValue(false); // Assume neither coin is a favorite
    render(
      <MemoryRouter>
        <CoinTable
          coinsList={coinsList}
          toggleFavorite={mockToggleFavorite}
          isFavourite={mockIsFavourite}
        />
      </MemoryRouter>
    );

    const favoriteButton = screen.getAllByRole('button')[0];
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith('bitcoin');
  });

  test('displays favorite status correctly', () => {
    mockIsFavourite.mockImplementation((coinId) => coinId === 'bitcoin'); // Mock bitcoin as favorite

    render(
      <MemoryRouter>
        <CoinTable
          coinsList={coinsList}
          toggleFavorite={mockToggleFavorite}
          isFavourite={mockIsFavourite}
        />
      </MemoryRouter>
    );

    // Check if Bitcoin shows as favorite
    const bitcoinFavoriteIcon = screen.getAllByRole('img')[0];
    expect(bitcoinFavoriteIcon).toHaveAttribute('alt', 'selected');

    // Check if Ethereum shows as non-favorite
    const ethereumFavoriteIcon = screen.getAllByRole('img')[1];
    expect(ethereumFavoriteIcon).toHaveAttribute('alt', 'unselected');
  });
});
