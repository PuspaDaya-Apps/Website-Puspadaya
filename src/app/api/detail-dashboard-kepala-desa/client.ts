import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { buildApiCacheKey, isApiCacheFresh, readApiCache, writeApiCache } from '@/app/api/cache';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { normalizePosyanduNames } from '@/utils/posyanduName';
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

const CACHE_NAMESPACE = 'detail-dashboard-kepala-desa';
const CACHE_MAX_AGE_MS = 5000;
const inFlightRequests = new Map<string, Promise<FetchResult<unknown>>>();

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

  const cacheKey = buildApiCacheKey(CACHE_NAMESPACE, endpoint, { idPosyandu, routePath, params });
  const cached = readApiCache<T>(cacheKey);
  const extraPosyanduNameKeys = routePath === 'ringkasan' ? ['nama'] : [];
  const normalizeCachedData = (data: T | null): T | null =>
    data === null ? null : normalizePosyanduNames(data, extraPosyanduNameKeys);

  if (cached && isApiCacheFresh(cached.cachedAt, CACHE_MAX_AGE_MS)) {
    return { successCode: 200, data: normalizeCachedData(cached.data) };
  }

  const existingRequest = inFlightRequests.get(cacheKey);
  if (existingRequest) {
    return existingRequest as Promise<FetchResult<T>>;
  }

  const requestPromise = (async (): Promise<FetchResult<T>> => {
    try {
      const accessToken = sessionStorage.getItem('access_token');

      if (!accessToken) {
        if (cached?.data) {
          return { successCode: 200, data: normalizeCachedData(cached.data) };
        }

        return { successCode: 401, data: null };
      }

      const response = await axios.get(buildDetailDashboardKepalaDesaUrl(endpoint, idPosyandu, routePath, params), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      sessionStorage.removeItem(Messages.ERROR);

      const data = normalizePosyanduNames(
        (response.data?.data ?? response.data ?? null) as T | null,
        extraPosyanduNameKeys
      );
      if (data !== null) {
        writeApiCache(cacheKey, data);
      }

      return {
        successCode: response.status,
        data,
      };
    } catch (err: any) {
      const { status, message } = handleError(err);
      console.error('Error fetching detail dashboard kepala desa:', message);

      if (cached?.data) {
        return { successCode: 200, data: normalizeCachedData(cached.data) };
      }

      return { successCode: status, data: null };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise as Promise<FetchResult<unknown>>);
  return requestPromise;
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
