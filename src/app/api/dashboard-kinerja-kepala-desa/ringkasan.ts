import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import {
  DashboardKepalaDesaQueryParams,
  FetchResult,
  getDashboardKinerjaKepalaDesa,
} from './client';
import { KinerjaPosyanduRingkasanData } from '@/types/kepala-desa';

export const fetchKinerjaRingkasan = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<KinerjaPosyanduRingkasanData>> => {
  return getDashboardKinerjaKepalaDesa<KinerjaPosyanduRingkasanData>(
    APIEndpoints.KINERJA_KEPALA_DESA_RINGKASAN,
    params
  );
};
