import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { KinerjaPerPosyanduData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchKinerjaPerPosyandu = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<KinerjaPerPosyanduData>> => {
  return getDetailDashboardKepalaDesa<KinerjaPerPosyanduData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'kinerja-per-posyandu',
    params
  );
};
