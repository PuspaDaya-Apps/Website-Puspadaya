import { APIEndpoints } from '@/app/config/route/apiEndpoints';
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
}

interface CurrentUserLocation {
  kabupaten_kota?: {
    nama_kabupaten_kota?: string;
  };
  desa_kelurahan?: {
    nama_desa_kelurahan?: string;
  };
}

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

  return `${endpoint}?${query.toString()}`;
};

async function fetchDashboardKinerjaKepalaDesa<T>(
  endpoint: string,
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<T>> {
  if (typeof window === 'undefined') {
    return { successCode: 500, data: null };
  }

  try {
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken) {
      return { successCode: 401, data: null };
    }

    const response = await axios.get(buildDashboardKinerjaKepalaDesaUrl(endpoint, params), {
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

export function getDashboardKinerjaKepalaDesa<T>(
  endpoint: string,
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<T>> {
  return fetchDashboardKinerjaKepalaDesa<T>(endpoint, params);
}

export { APIEndpoints };
