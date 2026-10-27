"use client";
import { useQueries } from '@tanstack/react-query';
import { fetchDetailPosyanduKader } from '@/app/api/detail-dashboard-kepala-desa';
import { DetailPosyanduKaderItem } from '@/types/kepala-desa';
import { unwrapFetchResult } from '@/lib/react-query/fetchResult';
import { DashboardPeriod, queryKeys } from '@/lib/react-query/queryKeys';
import { DASHBOARD_STALE_TIME_MS } from '@/lib/react-query/queryClient';

export interface PosyanduRef {
  id: string;
  nama: string;
}

export interface KaderDesaItem extends DetailPosyanduKaderItem {
  posyandu_nama: string;
}

interface UseAllKaderDesaResult {
  data: KaderDesaItem[];
  isLoading: boolean;
  isError: boolean;
}

// Belum ada endpoint kader tingkat desa, jadi daftar kader dirakit dari
// endpoint per posyandu: satu request per posyandu, dijalankan paralel lewat
// useQueries, lalu hasilnya digabung jadi satu array.
//
// Catatan: array yang dikembalikan dibuat baru setiap render, jadi jangan
// dipakai sebagai dependency useEffect.
export const useAllKaderDesa = (
  posyanduList: PosyanduRef[],
  params: DashboardPeriod,
  options?: { enabled?: boolean }
): UseAllKaderDesaResult => {
  const enabled = (options?.enabled ?? true) && posyanduList.length > 0;

  const results = useQueries({
    queries: posyanduList.map((posyandu) => ({
      queryKey: queryKeys.kader.perPosyandu(posyandu.id, params),
      queryFn: () => unwrapFetchResult(fetchDetailPosyanduKader(posyandu.id, params)),
      staleTime: DASHBOARD_STALE_TIME_MS,
      enabled,
    })),
  });

  const data = results.flatMap((result, index) =>
    (result.data?.kader ?? []).map((kader) => ({
      ...kader,
      posyandu_nama: posyanduList[index]?.nama ?? '-',
    })),
  );

  return {
    data,
    // Tanpa posyandu tidak ada query yang jalan, jadi jangan loading selamanya.
    isLoading: enabled && results.some((result) => result.isPending),
    isError: results.some((result) => result.isError),
  };
};
