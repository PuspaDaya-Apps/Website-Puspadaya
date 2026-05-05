import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DetailPosyanduBalitaKhususData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchDetailPosyanduBalitaAll = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<DetailPosyanduBalitaKhususData>> => {
  return getDetailDashboardKepalaDesa<DetailPosyanduBalitaKhususData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'balita-all',
    params
  );
};
