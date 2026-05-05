import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { InformasiDataDesaData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchInformasiDataDesa = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<InformasiDataDesaData>> => {
  return getDashboardKepalaDesa<InformasiDataDesaData>(APIEndpoints.INFORMASI_DATA_DESA, params);
};
