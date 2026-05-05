import { ApiResponse, Periode } from './common';

export interface DetailPosyanduBalitaKhususItem {
  id_balita: number;
  nama: string;
  usia: string;
  ibu: string;
  berat_badan: number;
  tinggi_badan: number;
  status: string;
}

export interface DetailPosyanduPagination {
  page: number;
  limit: number;
  total_data: number;
  total_page: number;
}

export interface DetailPosyanduBalitaKhususData {
  periode: Periode;
  balita: DetailPosyanduBalitaKhususItem[];
  pagination: DetailPosyanduPagination;
}

export type DetailPosyanduBalitaKhususResponse = ApiResponse<DetailPosyanduBalitaKhususData>;
