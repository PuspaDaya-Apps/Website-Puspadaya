import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DurasiKerjaPosyanduData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchDurasiKerjaPosyandu = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<DurasiKerjaPosyanduData>> => {
  return getDashboardKepalaDesa<DurasiKerjaPosyanduData>(APIEndpoints.DURASIKERJAPOSYANDU, params);
};
