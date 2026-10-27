"use client";
import { useQuery } from '@tanstack/react-query';
import { statistikDashboard } from '@/app/api/statistik/statistik';
import { unwrapFetchResult } from '@/lib/react-query/fetchResult';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { DASHBOARD_STALE_TIME_MS } from '@/lib/react-query/queryClient';

export const getUserRole = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  return sessionStorage.getItem('user_role') ?? '';
};

// statistikDashboard() memilih endpoint berdasarkan role, jadi role ikut masuk
// queryKey supaya data satu role tidak pernah terbaca oleh role lain.
export const useStatistikDashboard = () => {
  const role = getUserRole();

  return useQuery({
    queryKey: queryKeys.statistikDashboard(role),
    queryFn: () => unwrapFetchResult(statistikDashboard()),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });
};
