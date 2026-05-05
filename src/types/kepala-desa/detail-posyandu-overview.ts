import { ApiResponse, Periode } from './common';

export interface DetailPosyanduTingkatKehadiran {
  persentase: number;
  hadir: number;
  total: number;
}

export interface DetailPosyanduStatusGiziItem {
  status: string;
  jumlah: number;
  persentase: number;
}

export interface DetailPosyanduKasusKritisItem {
  id_balita: number;
  nama: string;
  usia: string;
  status: string;
}

export interface DetailPosyanduOverviewData {
  periode: Periode;
  tingkat_kehadiran: DetailPosyanduTingkatKehadiran;
  status_gizi_balita: DetailPosyanduStatusGiziItem[];
  kasus_kritis: DetailPosyanduKasusKritisItem[];
}

export type DetailPosyanduOverviewResponse = ApiResponse<DetailPosyanduOverviewData>;
