import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { ImunisasiKependudukanData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchImunisasiKependudukan = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<ImunisasiKependudukanData>> => {
  return getDashboardKepalaDesa<ImunisasiKependudukanData>(APIEndpoints.IMUNISASI_KEPENDUDUKAN, params);
};
