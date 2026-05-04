import { ApiResponse, Periode } from './common';

export type BebanKerjaKategori = 'tinggi' | 'sedang' | 'rendah';

export interface BebanKerjaDistribusiItem {
  kategori: BebanKerjaKategori;
  jumlah: number;
  persen: number;
}

export interface SkorBebanKerjaTimRingkasan {
  total_kader: number;
  skor_tertinggi: number;
  skor_terendah: number;
  rata_rata_skor: number;
}

export interface SkorBebanKerjaTimDistribusi {
  total_kader: number;
  detail: BebanKerjaDistribusiItem[];
}

export interface SkorBebanKerjaTimData {
  periode: Periode;
  kader: {
    ringkasan: SkorBebanKerjaTimRingkasan;
    distribusi_beban_kerja: SkorBebanKerjaTimDistribusi;
  };
}

export type SkorBebanKerjaTimResponse = ApiResponse<SkorBebanKerjaTimData>;
