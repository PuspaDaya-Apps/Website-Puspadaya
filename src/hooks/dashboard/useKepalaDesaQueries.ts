"use client";
import { useQuery } from '@tanstack/react-query';
import {
  fetchAnakCakupanDilayani,
  fetchDurasiKerjaPosyandu,
  fetchImunisasiKependudukan,
  fetchInformasiDataDesa,
  fetchLogAktivitasKader,
  fetchSkorBebanKerjaTim,
  fetchStatistikDataDesa,
  fetchStatistikSkdn,
  fetchTrenDataPosyandu,
} from '@/app/api/dashboard-kepala-desa';
import { fetchDetailPosyanduBalitaStatusPeriod } from '@/app/api/detail-dashboard-kepala-desa';
import { unwrapFetchResult } from '@/lib/react-query/fetchResult';
import { BalitaStatusPeriodFilter, DashboardPeriod, queryKeys } from '@/lib/react-query/queryKeys';
import { DASHBOARD_STALE_TIME_MS } from '@/lib/react-query/queryClient';

interface QueryOptions {
  enabled?: boolean;
}

export const useInformasiDataDesa = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.informasiDataDesa(params),
    queryFn: () => unwrapFetchResult(fetchInformasiDataDesa(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useStatistikDataDesa = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.statistikDataDesa(params),
    queryFn: () => unwrapFetchResult(fetchStatistikDataDesa(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useTrenDataPosyandu = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.trenDataPosyandu(params),
    queryFn: () => unwrapFetchResult(fetchTrenDataPosyandu(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useAnakCakupanDilayani = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.anakCakupanDilayani(params),
    queryFn: () => unwrapFetchResult(fetchAnakCakupanDilayani(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useStatistikSkdn = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.statistikSkdn(params),
    queryFn: () => unwrapFetchResult(fetchStatistikSkdn(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useDurasiKerjaPosyandu = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.durasiKerjaPosyandu(params),
    queryFn: () => unwrapFetchResult(fetchDurasiKerjaPosyandu(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useSkorBebanKerjaTim = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.skorBebanKerjaTim(params),
    queryFn: () => unwrapFetchResult(fetchSkorBebanKerjaTim(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useImunisasiKependudukan = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.imunisasiKependudukan(params),
    queryFn: () => unwrapFetchResult(fetchImunisasiKependudukan(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

// Tren status gizi 12 bulan untuk satu posyandu. Query dimatikan selama
// idPosyandu kosong supaya tidak menembak endpoint dengan path param kosong.
export const useBalitaStatusPeriod = (
  idPosyandu: string,
  params: DashboardPeriod,
  filter?: BalitaStatusPeriodFilter,
  options?: QueryOptions
) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.balitaStatusPeriod(idPosyandu, params, filter),
    queryFn: () =>
      unwrapFetchResult(
        fetchDetailPosyanduBalitaStatusPeriod(idPosyandu, {
          ...params,
          jenisKelamin: filter?.jenisKelamin,
          statusKemiskinan: filter?.statusKemiskinan,
        })
      ),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: (options?.enabled ?? true) && idPosyandu.length > 0,
  });

export const useLogAktivitasKader = (params: DashboardPeriod, options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.kepalaDesa.logAktivitasKader(params),
    queryFn: () => unwrapFetchResult(fetchLogAktivitasKader(params)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });
