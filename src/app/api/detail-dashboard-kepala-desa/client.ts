import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import axios from 'axios';

export interface FetchResult<T> {
  successCode: number;
  data: T | null;
}

export interface DetailDashboardKepalaDesaQueryParams {
  bulan: string | number;
  tahun: number | string;
  page?: number;
  limit?: number;
}

const normalizeBulan = (bulan: string | number): string => {
  if (typeof bulan === 'number') {
    return String(bulan);
  }

  return bulan.trim();
};

const buildDetailDashboardKepalaDesaUrl = (
  endpoint: string,
  idPosyandu: string,
  routePath: string,
  params: DetailDashboardKepalaDesaQueryParams
): string => {
  const query = new URLSearchParams();
  query.set('bulan', normalizeBulan(params.bulan));
  query.set('tahun', String(params.tahun));
  if (params.page != null) {
    query.set('page', String(params.page));
  }
  if (params.limit != null) {
    query.set('limit', String(params.limit));
  }

  const resolvedEndpoint = endpoint.replace('{id_posyandu}', idPosyandu);

  return `${resolvedEndpoint}/${routePath}?${query.toString()}`;
};

async function fetchDetailDashboardKepalaDesa<T>(
  endpoint: string,
  idPosyandu: string,
  routePath: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<T>> {
  if (typeof window === 'undefined') {
    return { successCode: 500, data: null };
  }

  try {
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken) {
      return { successCode: 401, data: null };
    }

    const response = await axios.get(buildDetailDashboardKepalaDesaUrl(endpoint, idPosyandu, routePath, params), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    sessionStorage.removeItem(Messages.ERROR);

    return {
      successCode: response.status,
      data: (response.data?.data ?? response.data ?? null) as T | null,
    };
  } catch (err: any) {
    const { status, message } = handleError(err);
    console.error('Error fetching detail dashboard kepala desa:', message);
    return { successCode: status, data: null };
  }
}

export function getDetailDashboardKepalaDesa<T>(
  endpoint: string,
  idPosyandu: string,
  routePath: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<T>> {
  return fetchDetailDashboardKepalaDesa<T>(endpoint, idPosyandu, routePath, params);
}

export { APIEndpoints };
