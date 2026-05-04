import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { StatistikSkdnData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchStatistikSkdn = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<StatistikSkdnData>> => {
  return getDashboardKepalaDesa<StatistikSkdnData>(APIEndpoints.DASHBOARDSKDN, params);
};
