import { ApiResponse, Periode } from './common';
import { DetailPosyanduPagination } from './detail-posyandu-balita-khusus';

export interface DetailPosyanduIbuHamilIndikatorKek {
  parameter: string;
  ambang_batas: number;
  satuan: string;
  is_kek: boolean;
}

export interface DetailPosyanduIbuHamilItem {
  id_ibu_hamil: string;
  nama: string;
  usia: string;
  usia_kehamilan: string;
  berat_badan: number;
  tinggi_badan: number;
  lila: number;
  indikator_kek: DetailPosyanduIbuHamilIndikatorKek;
  status: string;
}

export interface DetailPosyanduIbuHamilData {
  periode: Periode;
  ibu_hamil: DetailPosyanduIbuHamilItem[];
  pagination: DetailPosyanduPagination;
}

export type DetailPosyanduIbuHamilResponse = ApiResponse<DetailPosyanduIbuHamilData>;
