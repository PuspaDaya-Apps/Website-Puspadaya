import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DetailPosyanduKinerjaData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchDetailPosyanduKinerja = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<DetailPosyanduKinerjaData>> => {
  return getDetailDashboardKepalaDesa<DetailPosyanduKinerjaData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'kinerja',
    params
  );
};
