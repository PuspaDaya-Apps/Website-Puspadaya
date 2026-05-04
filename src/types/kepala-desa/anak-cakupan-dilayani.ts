import { ApiResponse, Periode } from './common';

export interface AnakBerdasarkanUsia {
  baduta: number;
  balita: number;
  pra_sekolah: number;
}

export interface KesehatanIbuBayi {
  ibu_hamil_kek: number;
  ibu_hamil_risiko_tinggi: number;
  ibu_menyusui: number;
  bayi_baru_lahir: number;
}

export interface KeluargaBerencana {
  wanita_pasca_subur: number;
  akseptor_kb: number;
  ibu_hamil_asuransi: number;
}

export interface ImunisasiDetail {
  bcg: number;
  dpt_1: number;
  dpt_2: number;
  dpt_3: number;
  polio_1: number;
  polio_2: number;
  polio_3: number;
  polio_4: number;
  hepatitis: number;
  campak: number;
}

export interface ImunisasiCakupan {
  total: number;
  cakupan_persen: number;
  detail: ImunisasiDetail;
}

export interface AnakCakupanDilayaniData {
  periode: Periode;
  anak_berdasarkan_usia: AnakBerdasarkanUsia;
  kesehatan_ibu_bayi: KesehatanIbuBayi;
  keluarga_berencana: KeluargaBerencana;
  imunisasi: ImunisasiCakupan;
}

export type AnakCakupanDilayaniResponse = ApiResponse<AnakCakupanDilayaniData>;
