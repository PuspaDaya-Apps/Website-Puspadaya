import { ApiResponse, Periode } from './common';

export interface StatistikSkdnIndikator {
  kenaikan_bb_persen: number;
  kenaikan_bb_sesuai_kbm_persen: number;
}

export interface StatistikSkdnJumlah {
  sasaran_balita: number;
  kunjungan: number;
  ditimbang: number;
  naik_bb: number;
}

export interface StatistikSkdnCakupan {
  d_per_s_persen: number;
  k_per_s_persen: number;
}

export interface StatistikSkdnDetail {
  indikator: StatistikSkdnIndikator;
  jumlah: StatistikSkdnJumlah;
  cakupan: StatistikSkdnCakupan;
}

export interface StatistikSkdnData {
  periode: Periode;
  skdn: StatistikSkdnDetail;
}

export type StatistikSkdnResponse = ApiResponse<StatistikSkdnData>;
