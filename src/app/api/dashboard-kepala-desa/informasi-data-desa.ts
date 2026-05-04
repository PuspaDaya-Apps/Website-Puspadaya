import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { InformasiDataDesaData } from '@/types/kepala-desa';
import { FetchResult, getDashboardKepalaDesa } from './client';

export const fetchInformasiDataDesa = (): Promise<FetchResult<InformasiDataDesaData>> => {
  return getDashboardKepalaDesa<InformasiDataDesaData>(APIEndpoints.INFORMASIDATADESA);
};
