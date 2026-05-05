import { ApiResponse, Periode } from './common';

export interface KinerjaPerPosyanduDurasiItem {
  bulan: string;
  kerja_posyandu: number;
  kunjungan_rumah: number;
}

export interface KinerjaPerPosyanduJarakItem {
  bulan: string;
  km: number;
}

export interface KinerjaPerPosyanduRingkasan {
  kerja_posyandu_jam: number;
  kunjungan_rumah_jam: number;
  jarak_tempuh_km: number;
}

export interface KinerjaPerPosyanduTren {
  durasi_kerja: KinerjaPerPosyanduDurasiItem[];
  jarak_tempuh: KinerjaPerPosyanduJarakItem[];
}

export interface KinerjaPerPosyanduData {
  periode: Periode;
  ringkasan: KinerjaPerPosyanduRingkasan;
  tren: KinerjaPerPosyanduTren;
}

export type KinerjaPerPosyanduResponse = ApiResponse<KinerjaPerPosyanduData>;
