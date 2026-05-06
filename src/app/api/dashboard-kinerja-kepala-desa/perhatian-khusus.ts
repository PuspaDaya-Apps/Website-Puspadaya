import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import {
  DashboardKepalaDesaQueryParams,
  FetchResult,
  getDashboardKinerjaKepalaDesa,
} from './client';
import { KinerjaPosyanduPerhatianKhususData } from '@/types/kepala-desa';

export const fetchKinerjaPerhatianKhusus = (
  params: DashboardKepalaDesaQueryParams
): Promise<FetchResult<KinerjaPosyanduPerhatianKhususData>> => {
  return getDashboardKinerjaKepalaDesa<KinerjaPosyanduPerhatianKhususData>(
    APIEndpoints.KINERJA_KEPALA_DESA_PERHATIAN_KHUSUS,
    params
  );
};
