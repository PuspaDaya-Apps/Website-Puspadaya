import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { buildApiCacheKey, isApiCacheFresh, readApiCache, writeApiCache } from '@/app/api/cache';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import axios from 'axios';

export interface FetchResult<T> {
  successCode: number;
  data: T | null;
}

export interface DashboardKepalaDesaQueryParams {
  bulan: string | number;
  tahun: number | string;
  kabupatenKota?: string;
  desa?: string;
  extraParams?: Record<string, string>;
}

interface CurrentUserLocation {
  kabupaten_kota?: {
    nama_kabupaten_kota?: string;
  };
  desa_kelurahan?: {
    nama_desa_kelurahan?: string;
  };
}

const CACHE_NAMESPACE = 'dashboard-kinerja-kepala-desa';
const CACHE_MAX_AGE_MS = 5000;
const inFlightRequests = new Map<string, Promise<FetchResult<unknown>>>();

const normalizeBulan = (bulan: string | number): string => {
  if (typeof bulan === 'number') {
    return String(bulan);
  }

  return bulan.trim();
};

const getCurrentUserLocation = (): Pick<DashboardKepalaDesaQueryParams, 'kabupatenKota' | 'desa'> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawCurrentUser = localStorage.getItem('current_user');

    if (!rawCurrentUser) {
      return {};
    }

    const currentUser = JSON.parse(rawCurrentUser) as CurrentUserLocation;

    return {
      kabupatenKota: currentUser?.kabupaten_kota?.nama_kabupaten_kota,
      desa: currentUser?.desa_kelurahan?.nama_desa_kelurahan,
    };
  } catch (error) {
    console.warn('Gagal membaca current_user dari localStorage:', error);
    return {};
  }
};

const buildDashboardKinerjaKepalaDesaUrl = (endpoint: string, params: DashboardKepalaDesaQueryParams): string => {
  const resolvedLocation = getCurrentUserLocation();
  const query = new URLSearchParams();

  const kabupatenKota = params.kabupatenKota ?? resolvedLocation.kabupatenKota;
  const desa = params.desa ?? resolvedLocation.desa;

  if (kabupatenKota) {
    query.set('kabupaten_kota', kabupatenKota);
  }

  if (desa) {
    query.set('desa', desa);
  }

  query.set('bulan', normalizeBulan(params.bulan));
  query.set('tahun', String(params.tahun));

  if (params.extraParams) {
    Object.entries(params.extraParams).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
  }

  return `${endpoint}?${query.toString()}`;
};

async function fetchDashboardKinerjaKepalaDesa<T>(
  endpoint: string,
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<T>> {
  if (typeof window === 'undefined') {
    return { successCode: 500, data: null };
  }

  const cacheKey = buildApiCacheKey(CACHE_NAMESPACE, endpoint, params);
  const cached = readApiCache<T>(cacheKey);

  if (cached && isApiCacheFresh(cached.cachedAt, CACHE_MAX_AGE_MS)) {
    return { successCode: 200, data: cached.data };
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
          return { successCode: 200, data: cached.data };
        }

        return { successCode: 401, data: null };
      }

      const response = await axios.get(buildDashboardKinerjaKepalaDesaUrl(endpoint, params), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      sessionStorage.removeItem(Messages.ERROR);

      const data = (response.data?.data ?? response.data ?? null) as T | null;
      if (data !== null) {
        writeApiCache(cacheKey, data);
      }

      return {
        successCode: response.status,
        data,
      };
    } catch (err: any) {
      const { status, message } = handleError(err);
      console.error('Error fetching data:', message);

      if (cached?.data) {
        return { successCode: 200, data: cached.data };
      }

      return { successCode: status, data: null };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise as Promise<FetchResult<unknown>>);
  return requestPromise;
}

export function getDashboardKinerjaKepalaDesa<T>(
  endpoint: string,
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<T>> {
  return fetchDashboardKinerjaKepalaDesa<T>(endpoint, params);
}

export { APIEndpoints };
