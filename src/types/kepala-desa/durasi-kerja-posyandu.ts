import { ApiResponse, Periode } from './common';

export interface DurasiKerjaItem {
  bulan: string;
  kerja_posyandu: number;
  kunjungan_rumah: number;
}

export interface JarakTempuhItem {
  bulan: string;
  km: number;
}

export interface DurasiKerjaPosyanduRingkasan {
  kerja_posyandu_jam: number;
  kunjungan_rumah_jam: number;
  jarak_tempuh_km: number;
}

export interface DurasiKerjaPosyanduTren {
  durasi_kerja: DurasiKerjaItem[];
  jarak_tempuh: JarakTempuhItem[];
}

export interface DurasiKerjaPosyanduData {
  periode: Periode;
  ringkasan: DurasiKerjaPosyanduRingkasan;
  tren: DurasiKerjaPosyanduTren;
}

export type DurasiKerjaPosyanduResponse = ApiResponse<DurasiKerjaPosyanduData>;
