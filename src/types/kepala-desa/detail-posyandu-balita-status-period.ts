import { ApiResponse } from './common';

export interface BalitaStatusPeriodItem {
  total_stunting: number;
  total_wasting: number;
  total_underweight: number;
  total_normal: number;
}

// Key-nya nama bulan dalam bahasa Inggris huruf kecil ("january", "february",
// ...). Bukan daftar tetap: backend hanya mengirim bulan yang sudah terjadi,
// jadi jumlah key bisa kurang dari 12.
export type BalitaStatusPeriodData = Record<string, BalitaStatusPeriodItem>;

export type BalitaStatusPeriodResponse = ApiResponse<BalitaStatusPeriodData>;
