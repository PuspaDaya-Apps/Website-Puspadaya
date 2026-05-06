import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import {
  DashboardKepalaDesaQueryParams,
  FetchResult,
  getDashboardKinerjaKepalaDesa,
} from './client';
import { KinerjaPosyanduDetailKasusKritisData } from '@/types/kepala-desa';

export const fetchDetailDataKasusKritis = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<KinerjaPosyanduDetailKasusKritisData>> => {
  return getDashboardKinerjaKepalaDesa<KinerjaPosyanduDetailKasusKritisData>(
    APIEndpoints.DETAIL_DATA_KASUS_KRITIS_KEPALA_DESA,
    params
  );
};
