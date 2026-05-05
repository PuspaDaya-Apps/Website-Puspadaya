import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { LogAktivitasKaderData } from '@/types/kepala-desa';
import { DashboardKepalaDesaQueryParams, FetchResult, getDashboardKepalaDesa } from './client';

export const fetchLogAktivitasKader = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<LogAktivitasKaderData>> => {
  return getDashboardKepalaDesa<LogAktivitasKaderData>(APIEndpoints.LOG_AKTIVITAS_KADER, params);
};
