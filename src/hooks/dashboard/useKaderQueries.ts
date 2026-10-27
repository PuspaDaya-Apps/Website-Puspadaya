"use client";
import { useQuery } from '@tanstack/react-query';
import { Databalita } from '@/app/api/dashboatrd-new/databalita';
import { Statistikbebankerja } from '@/app/api/dashboatrd-new/statistikbebankerja';
import { StatistikBulanan } from '@/app/api/dashboatrd-new/statistikbulanan';
import { StatistikJarakTempuh } from '@/app/api/dashboatrd-new/statistikjaraktempuh';
import { StatistikJenisPekerjaan } from '@/app/api/dashboatrd-new/statistikjenispekerjaan';
import { Statistikraportbalita } from '@/app/api/dashboatrd-new/statistikraportbalita';
import { unwrapFetchResult } from '@/lib/react-query/fetchResult';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { DASHBOARD_STALE_TIME_MS } from '@/lib/react-query/queryClient';

// useCache: false — endpoint ini punya cache sessionStorage sendiri dengan TTL
// terpisah. React Query sekarang jadi satu-satunya lapisan cache, jadi lapisan
// lama dilewati agar kedua TTL tidak saling menimpa.
export const useKaderProfil = () =>
  useQuery({
    queryKey: queryKeys.kader.profil(),
    queryFn: () => unwrapFetchResult(StatistikJenisPekerjaan(false)),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });

export const useKaderBebanKerja = () =>
  useQuery({
    queryKey: queryKeys.kader.bebanKerja(),
    queryFn: () => unwrapFetchResult(Statistikbebankerja(false)),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });

export const useKaderStatistikBulanan = () =>
  useQuery({
    queryKey: queryKeys.kader.statistikBulanan(),
    queryFn: () => unwrapFetchResult(StatistikBulanan(false)),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });

export const useKaderJarakTempuh = () =>
  useQuery({
    queryKey: queryKeys.kader.jarakTempuh(),
    queryFn: () => unwrapFetchResult(StatistikJarakTempuh(false)),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });

export const useDaftarBalita = () =>
  useQuery({
    queryKey: queryKeys.kader.daftarBalita(),
    queryFn: () => unwrapFetchResult(Databalita()),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });

export const useRaporBalita = (id: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.kader.raporBalita(id ?? ''),
    queryFn: () => unwrapFetchResult(Statistikraportbalita(id as string)),
    staleTime: DASHBOARD_STALE_TIME_MS,
    enabled: Boolean(id),
  });
