import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DetailPosyanduIbuHamilData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchDetailPosyanduIbuHamil = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<DetailPosyanduIbuHamilData>> => {
  return getDetailDashboardKepalaDesa<DetailPosyanduIbuHamilData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'ibu-hamil',
    params
  );
};
