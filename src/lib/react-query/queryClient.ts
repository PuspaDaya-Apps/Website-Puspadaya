import { QueryClient } from '@tanstack/react-query';

// Dashboard dipakai sebagai halaman kerja harian: datanya cukup diambil sekali
// lalu dibaca dari cache, bukan di-fetch ulang setiap komponen mount atau
// setiap user pindah halaman.
export const DASHBOARD_STALE_TIME_MS = 30 * 60 * 1000;
export const DASHBOARD_GC_TIME_MS = 60 * 60 * 1000;

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DASHBOARD_STALE_TIME_MS,
        gcTime: DASHBOARD_GC_TIME_MS,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
      },
    },
  });

let browserQueryClient: QueryClient | null = null;

// Satu instance per tab, supaya prefetch saat login, hook di dashboard, dan
// pembersihan cache saat logout berbicara dengan cache yang sama. Di server
// selalu instance baru agar cache tidak bocor antar request.
export const getQueryClient = (): QueryClient => {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
};
