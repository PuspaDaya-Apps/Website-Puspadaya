import { ApiResponse, Periode } from './common';

export interface StatistikDataDesaTrendItemJumlah {
  bulan: string;
  jumlah: number;
}

export interface StatistikDataDesaTrendItemStatusGizi {
  bulan: string;
  sangat_pendek: number;
  stunting_pendek: number;
  wasting: number;
  underweight: number;
}

export interface StatistikDataDesaTrendSection<T> {
  hari_ini: number;
  data: T[];
}

export interface StatistikDataDesaTren {
  kehadiran_balita?: StatistikDataDesaTrendSection<StatistikDataDesaTrendItemJumlah>;
  kehadiran_ibu_hamil?: StatistikDataDesaTrendSection<StatistikDataDesaTrendItemJumlah>;
  status_gizi_balita?: StatistikDataDesaTrendSection<StatistikDataDesaTrendItemStatusGizi>;
  ibu_hamil_kek?: StatistikDataDesaTrendSection<StatistikDataDesaTrendItemJumlah>;
}

export interface StatistikDataDesaData {
  periode: Periode;
  tren?: StatistikDataDesaTren;
}

export type StatistikDataDesaResponse = ApiResponse<StatistikDataDesaData>;
