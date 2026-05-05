import { ApiResponse, Periode } from './common';

export interface DetailPosyanduAlamat {
  dusun: string;
  kecamatan: string;
}

export interface DetailPosyanduInfo {
  id: number;
  nama: string;
  alamat: DetailPosyanduAlamat;
}

export interface DetailPosyanduRingkasan {
  total_balita: number;
  total_ibu_hamil: number;
  total_kader: number;
  hadir_balita: number;
  hadir_ibu_hamil: number;
  stunting: number;
  gizi_buruk: number;
  normal: number;
}

export interface DetailPosyanduRingkasanData {
  periode: Periode;
  posyandu: DetailPosyanduInfo;
  ringkasan: DetailPosyanduRingkasan;
}

export type DetailPosyanduRingkasanResponse = ApiResponse<DetailPosyanduRingkasanData>;
