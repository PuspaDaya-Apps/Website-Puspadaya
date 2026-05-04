import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { TrenDataPosyanduData } from '@/types/kepala-desa';
import { FetchResult, getDashboardKepalaDesa } from './client';

export const fetchTrenDataPosyandu = (): Promise<FetchResult<TrenDataPosyanduData>> => {
  return getDashboardKepalaDesa<TrenDataPosyanduData>(APIEndpoints.TRENDATAPOSYNADU);
};
