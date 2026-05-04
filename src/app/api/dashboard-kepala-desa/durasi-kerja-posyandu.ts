import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DurasiKerjaPosyanduData } from '@/types/kepala-desa';
import { FetchResult, getDashboardKepalaDesa } from './client';

export const fetchDurasiKerjaPosyandu = (): Promise<FetchResult<DurasiKerjaPosyanduData>> => {
  return getDashboardKepalaDesa<DurasiKerjaPosyanduData>(APIEndpoints.DURASIKERJAPOSYANDU);
};
