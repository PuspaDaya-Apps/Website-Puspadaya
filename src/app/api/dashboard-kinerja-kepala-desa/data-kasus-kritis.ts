import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import {
  DashboardKepalaDesaQueryParams,
  FetchResult,
  getDashboardKinerjaKepalaDesa,
} from './client';
import { KinerjaPosyanduKasusKritisData } from '@/types/kepala-desa';

export const fetchDataKasusKritis = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<KinerjaPosyanduKasusKritisData>> => {
  return getDashboardKinerjaKepalaDesa<KinerjaPosyanduKasusKritisData>(
    APIEndpoints.DATA_KASUS_KRITIS_KEPALA_DESA,
    params
  );
};
