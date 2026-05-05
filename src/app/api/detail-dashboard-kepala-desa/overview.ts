import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DetailPosyanduOverviewData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchDetailPosyanduOverview = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<DetailPosyanduOverviewData>> => {
  return getDetailDashboardKepalaDesa<DetailPosyanduOverviewData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'overview',
    params
  );
};
