import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { SkorBebanKerjaTimData } from '@/types/kepala-desa';
import { FetchResult, getDashboardKepalaDesa } from './client';

export const fetchSkorBebanKerjaTim = (): Promise<FetchResult<SkorBebanKerjaTimData>> => {
  return getDashboardKepalaDesa<SkorBebanKerjaTimData>(APIEndpoints.SKORBEBANKERJATIM);
};
