import { ApiResponse, Periode } from './common';

export interface DetailPosyanduBalitaKhususItem {
  id_balita: string;
  nama: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  usia_bulan: number;
  usia: string;
  prioritas: string;
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
