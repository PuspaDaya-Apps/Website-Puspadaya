import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { StatistikDataDesaData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchStatistikDataDesa = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<StatistikDataDesaData>> => {
  return getDashboardKepalaDesa<StatistikDataDesaData>(APIEndpoints.STATISTIK_DATA_DESA, params);
};
