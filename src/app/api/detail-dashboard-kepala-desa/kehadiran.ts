import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DetailPosyanduKehadiranData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchDetailPosyanduKehadiran = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<DetailPosyanduKehadiranData>> => {
  return getDetailDashboardKepalaDesa<DetailPosyanduKehadiranData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'kehadiran',
    params
  );
};
