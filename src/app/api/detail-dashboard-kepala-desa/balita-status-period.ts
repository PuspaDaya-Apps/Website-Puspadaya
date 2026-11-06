import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { BalitaStatusPeriodData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchDetailPosyanduBalitaStatusPeriod = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<BalitaStatusPeriodData>> => {
  return getDetailDashboardKepalaDesa<BalitaStatusPeriodData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'balita-status-period',
    params
  );
};
