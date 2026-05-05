import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DetailPosyanduKaderData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchDetailPosyanduKader = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<DetailPosyanduKaderData>> => {
  return getDetailDashboardKepalaDesa<DetailPosyanduKaderData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'kader',
    params
  );
};
