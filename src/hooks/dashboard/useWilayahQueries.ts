"use client";
import { useQuery } from '@tanstack/react-query';
import { Desakelurahanwilayah } from '@/app/api/lokasi-kabupaten/desa';
import { Kabupatenwilayah } from '@/app/api/lokasi-kabupaten/kabupaten';
import { Kecamatanwilayah } from '@/app/api/lokasi-kabupaten/kecamatan';
import { trendPersebaranPosyandu } from '@/app/api/statistik/persebaranposyandu';
import { unwrapFetchResult } from '@/lib/react-query/fetchResult';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { DASHBOARD_STALE_TIME_MS } from '@/lib/react-query/queryClient';

interface QueryOptions {
  enabled?: boolean;
}

// Data wilayah adalah master data yang hampir tidak berubah, jadi paling
// banyak diuntungkan oleh cache: dropdown tidak lagi fetch tiap kali dibuka.
export const useKabupatenWilayah = (options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.wilayah.kabupaten(),
    queryFn: () => unwrapFetchResult(Kabupatenwilayah()),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useKecamatanWilayah = (options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.wilayah.kecamatan(),
    queryFn: () => unwrapFetchResult(Kecamatanwilayah()),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useDesaKelurahanWilayah = (options?: QueryOptions) =>
  useQuery({
    queryKey: queryKeys.wilayah.desa(),
    queryFn: () => unwrapFetchResult(Desakelurahanwilayah()),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: options?.enabled ?? true,
  });

export const useTrendPersebaranPosyandu = (desaKelurahan: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.wilayah.trendPersebaranPosyandu(desaKelurahan ?? ''),
    queryFn: () => unwrapFetchResult(trendPersebaranPosyandu(desaKelurahan as string)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: Boolean(desaKelurahan),
  });
