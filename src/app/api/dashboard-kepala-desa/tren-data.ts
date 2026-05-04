import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { TrenDataPosyanduData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchTrenDataPosyandu = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<TrenDataPosyanduData>> => {
  return getDashboardKepalaDesa<TrenDataPosyanduData>(APIEndpoints.TRENDATAPOSYNADU, params);
};
