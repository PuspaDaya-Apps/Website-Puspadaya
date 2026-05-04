import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { ImunisasiKependudukanData } from '@/types/kepala-desa';
import { FetchResult, getDashboardKepalaDesa } from './client';

export const fetchImunisasiKependudukan = (): Promise<FetchResult<ImunisasiKependudukanData>> => {
  return getDashboardKepalaDesa<ImunisasiKependudukanData>(APIEndpoints.IMUNISASIKEPENDUDUKAN);
};
