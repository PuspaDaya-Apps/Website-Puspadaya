import { ApiResponse } from './common';

export interface AktivitasKaderItem {
  tanggal: string;
  posyandu: string;
  aktivitas: string;
  deskripsi: string;
  kader: string;
}

export interface LogAktivitasKaderData {
  aktivitas: AktivitasKaderItem[];
}

export type LogAktivitasKaderResponse = ApiResponse<LogAktivitasKaderData>;
