"use client";
import { useQuery } from '@tanstack/react-query';
import {
  fetchDataKasusKritis,
  fetchKinerjaPerhatianKhusus,
  fetchKinerjaRingkasan,
} from '@/app/api/dashboard-kinerja-kepala-desa';
import { unwrapFetchResult } from '@/lib/react-query/fetchResult';
import { DashboardPeriod, queryKeys } from '@/lib/react-query/queryKeys';
import { DASHBOARD_STALE_TIME_MS } from '@/lib/react-query/queryClient';

interface QueryOptions {
  enabled?: boolean;
}

export const useKinerjaRingkasan = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kinerja.ringkasan(params),
    queryFn: () => unwrapFetchResult(fetchKinerjaRingkasan(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useKinerjaPerhatianKhusus = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kinerja.perhatianKhusus(params),
    queryFn: () => unwrapFetchResult(fetchKinerjaPerhatianKhusus(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useDataKasusKritis = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kinerja.dataKasusKritis(params),
    queryFn: () => unwrapFetchResult(fetchDataKasusKritis(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });
