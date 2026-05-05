import { ApiResponse, Periode } from './common';

export interface DetailPosyanduKinerjaIndikatorItem {
  jumlah_hadir?: number;
  jumlah_diukur?: number;
  total_sasaran: number;
  persentase: number;
}

export interface DetailPosyanduKinerjaTrenItem {
  bulan: string;
  jumlah_hadir: number;
}

export interface DetailPosyanduKinerjaData {
  periode: Periode;
  kinerja: {
    skor: number;
    kategori: string;
    indikator: {
      kehadiran: DetailPosyanduKinerjaIndikatorItem;
      pengukuran_balita: DetailPosyanduKinerjaIndikatorItem;
      pengukuran_ibu_hamil: DetailPosyanduKinerjaIndikatorItem;
    };
    tren_kehadiran_6_bulan: DetailPosyanduKinerjaTrenItem[];
  };
}

export type DetailPosyanduKinerjaResponse = ApiResponse<DetailPosyanduKinerjaData>;
