/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from 'react'; // Import from 'react'
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

global.ResizeObserver = class {
  observe() {}

  unobserve() {}

  disconnect() {}
};

// QueryClient setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

test('renders learn react link', async () => {
  await act(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  const linkElement = screen.getByText(/Coins/i);
  expect(linkElement).toBeInTheDocument();
});
