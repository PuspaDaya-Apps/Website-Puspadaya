import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { AnakCakupanDilayaniData } from '@/types/kepala-desa';
import { FetchResult, getDashboardKepalaDesa } from './client';

export const fetchAnakCakupanDilayani = (): Promise<FetchResult<AnakCakupanDilayaniData>> => {
  return getDashboardKepalaDesa<AnakCakupanDilayaniData>(APIEndpoints.ANAKCAKUPANDILAYANI);
};
