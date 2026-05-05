import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { SkorBebanKerjaTimData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchSkorBebanKerjaTim = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<SkorBebanKerjaTimData>> => {
  return getDashboardKepalaDesa<SkorBebanKerjaTimData>(APIEndpoints.SKOR_BEBAN_KERJA_TIM, params);
};
