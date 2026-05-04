import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { LogAktivitasKaderData } from '@/types/kepala-desa';
import { FetchResult, getDashboardKepalaDesa } from './client';

export const fetchLogAktivitasKader = (): Promise<FetchResult<LogAktivitasKaderData>> => {
  return getDashboardKepalaDesa<LogAktivitasKaderData>(APIEndpoints.LOGACTIVITYKADER);
};
