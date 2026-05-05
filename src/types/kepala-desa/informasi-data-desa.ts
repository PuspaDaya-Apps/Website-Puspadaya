import { ApiResponse, Periode } from './common';

export interface InformasiDataDesaRingkasan {
  total_posyandu: number;
  total_kader: number;
  bayi_baru_lahir: number;
  total_balita: number;
}

export interface InformasiDataDesaKasusGizi {
  stunting_pendek: number;
  stunting_sangat_pendek: number;
  wasting: number;
  underweight: number;
}

export interface InformasiDataDesaIbuHamil {
  total: number;
  anemia: number;
}

export interface InformasiDataDesaTrendItemJumlah {
  bulan: string;
  jumlah: number;
}

export interface InformasiDataDesaTrendItemStatusGizi {
  bulan: string;
  sangat_pendek: number;
  stunting_pendek: number;
  wasting: number;
  underweight: number;
}

export interface InformasiDataDesaTrendSection<T> {
  hari_ini: number;
  data: T[];
}

export interface InformasiDataDesaTren {
  kehadiran_balita?: InformasiDataDesaTrendSection<InformasiDataDesaTrendItemJumlah>;
  kehadiran_ibu_hamil?: InformasiDataDesaTrendSection<InformasiDataDesaTrendItemJumlah>;
  status_gizi_balita?: InformasiDataDesaTrendSection<InformasiDataDesaTrendItemStatusGizi>;
  ibu_hamil_kek?: InformasiDataDesaTrendSection<InformasiDataDesaTrendItemJumlah>;
}

export interface InformasiDataDesaData {
  periode: Periode;
  ringkasan: InformasiDataDesaRingkasan;
  kasus_gizi: InformasiDataDesaKasusGizi;
  ibu_hamil: InformasiDataDesaIbuHamil;
  tren?: InformasiDataDesaTren;
}

export type InformasiDataDesaResponse = ApiResponse<InformasiDataDesaData>;
