import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { StatistikSkdnData } from '@/types/kepala-desa';
import { FetchResult, getDashboardKepalaDesa } from './client';

export const fetchStatistikSkdn = (): Promise<FetchResult<StatistikSkdnData>> => {
  return getDashboardKepalaDesa<StatistikSkdnData>(APIEndpoints.DASHBOARDSKDN);
};
