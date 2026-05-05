import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { AnakCakupanDilayaniData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchAnakCakupanDilayani = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<AnakCakupanDilayaniData>> => {
  return getDashboardKepalaDesa<AnakCakupanDilayaniData>(APIEndpoints.ANAK_CAKUPAN_DILAYANI, params);
};
