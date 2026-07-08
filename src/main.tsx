import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { router } from './utils/router.tsx';
import axios from 'axios';
import './styles/index.css';

axios.defaults.baseURL =
  import.meta.env.VITE_API || 'https://admin.nouh-agency.com/api/';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 10,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
