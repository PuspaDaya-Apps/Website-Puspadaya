import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { DetailPosyanduRingkasanData } from '@/types/kepala-desa';
import { DetailDashboardKepalaDesaQueryParams, FetchResult, getDetailDashboardKepalaDesa } from './client';

export const fetchDetailPosyanduRingkasan = (
  idPosyandu: string,
  params: DetailDashboardKepalaDesaQueryParams
): Promise<FetchResult<DetailPosyanduRingkasanData>> => {
  return getDetailDashboardKepalaDesa<DetailPosyanduRingkasanData>(
    APIEndpoints.DETAIL_POSYANDU_KEPALA_DESA,
    idPosyandu,
    'ringkasan',
    params
  );
};
