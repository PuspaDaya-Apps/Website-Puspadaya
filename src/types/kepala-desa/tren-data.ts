import { ApiResponse, Periode } from './common';

export interface TrenDataPosyanduItem {
  id?: string;
  nama: string;
  dusun: string;
  balita: number;
  ibu_hamil: number;
  kader: number;
  kehadiran: number;
  skor?: number;
  kategori?: string;
  ranking?: number;
}

export interface TrenDataPosyanduData {
  periode: Periode;
  posyandu: TrenDataPosyanduItem[];
}

export type TrenDataPosyanduResponse = ApiResponse<TrenDataPosyanduData>;
