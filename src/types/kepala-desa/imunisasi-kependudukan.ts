import { ApiResponse, Periode } from './common';
import { ImunisasiDetail } from './anak-cakupan-dilayani';

export interface KependudukanAnak {
  baduta_0_23_bulan: number;
  balita_24_59_bulan: number;
  pra_sekolah_60_72_bulan: number;
}

export interface KependudukanBayi {
  bayi_baru_lahir: number;
  bayi_0_12_bulan_asuransi: number;
}

export interface KependudukanIbu {
  wanita_pasca_subur: number;
  ibu_hamil_kek: number;
  ibu_hamil_risiko_tinggi: number;
  ibu_menyusui: number;
  ibu_hamil_asuransi: number;
}

export interface KependudukanKesehatanReproduksi {
  akseptor_kb: number;
}

export interface KependudukanBalitaAsuransi {
  balita_0_59_bulan_asuransi: number;
}

export interface ImunisasiKependudukanData {
  periode: Periode;
  imunisasi: {
    cakupan_persen: number;
    total_imunisasi: number;
    detail: ImunisasiDetail;
  };
  kependudukan: {
    anak: KependudukanAnak;
    bayi: KependudukanBayi;
    ibu: KependudukanIbu;
    kesehatan_reproduksi: KependudukanKesehatanReproduksi;
    balita_asuransi: KependudukanBalitaAsuransi;
  };
}

export type ImunisasiKependudukanResponse = ApiResponse<ImunisasiKependudukanData>;
