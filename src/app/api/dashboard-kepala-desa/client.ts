import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import axios from 'axios';

export interface FetchResult<T> {
  successCode: number;
  data: T | null;
}

async function fetchDashboardKepalaDesa<T>(endpoint: string): Promise<FetchResult<T>> {
  if (typeof window === 'undefined') {
    return { successCode: 500, data: null };
  }

  try {
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken) {
      return { successCode: 401, data: null };
    }

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    sessionStorage.removeItem(Messages.ERROR);

    return {
      successCode: response.status,
      data: (response.data?.data ?? response.data ?? null) as T | null,
    };
  } catch (err: any) {
    const { status, message } = handleError(err);
    console.error('Error fetching data:', message);
    return { successCode: status, data: null };
  }
}

export function getDashboardKepalaDesa<T>(endpoint: string): Promise<FetchResult<T>> {
  return fetchDashboardKepalaDesa<T>(endpoint);
}

export { APIEndpoints };
