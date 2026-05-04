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

export interface InformasiDataDesaData {
  periode: Periode;
  ringkasan: InformasiDataDesaRingkasan;
  kasus_gizi: InformasiDataDesaKasusGizi;
  ibu_hamil: InformasiDataDesaIbuHamil;
}

export type InformasiDataDesaResponse = ApiResponse<InformasiDataDesaData>;
