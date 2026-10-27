"use client";
import { useQuery } from '@tanstack/react-query';
import { mapPersebaranAnak } from '@/app/api/statistik-maps/mapPersebaranAnak';
import { mapPersebaranKader } from '@/app/api/statistik-maps/mapPersebaranKader';
import { mapPersebaranMCK } from '@/app/api/statistik-maps/mapPersebaranMCK';
import { mapStunting } from '@/app/api/statistik-maps/mapStunting';
import { ApiFetchError, unwrapFetchResult } from '@/lib/react-query/fetchResult';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { DASHBOARD_STALE_TIME_MS } from '@/lib/react-query/queryClient';

export const useMapStunting = () =>
  useQuery({
    queryKey: queryKeys.maps.stunting(),
    queryFn: () => unwrapFetchResult(mapStunting()),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });

export const useMapPersebaranAnak = () =>
  useQuery({
    queryKey: queryKeys.maps.persebaranAnak(),
    queryFn: () => unwrapFetchResult(mapPersebaranAnak()),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });

export const useMapPersebaranMck = () =>
  useQuery({
    queryKey: queryKeys.maps.persebaranMck(),
    queryFn: () => unwrapFetchResult(mapPersebaranMCK()),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });

// mapPersebaranKader punya field `error` sendiri; pesannya diteruskan apa adanya
// supaya peta tetap menampilkan alasan kegagalan seperti sebelumnya.
export const useMapPersebaranKader = () =>
  useQuery({
    queryKey: queryKeys.maps.persebaranKader(),
    queryFn: async () => {
      const result = await mapPersebaranKader();

      if (!result.data) {
        throw new ApiFetchError(result.successCode, result.error || 'Failed to fetch data');
      }

      const rows = result.data.data?.data;

      if (!Array.isArray(rows)) {
        throw new ApiFetchError(result.successCode, 'Invalid data structure received from API');
      }

      return rows;
    },
    staleTime: DASHBOARD_STALE_TIME_MS,
  });
