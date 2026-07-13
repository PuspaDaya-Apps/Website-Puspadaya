import { ApiResponse, Periode } from './common';

export interface DetailPosyanduKehadiranKemiskinanItem {
  kategori: string;
  total: number;
  hadir: number;
  persentase: number;
}

export type BulanKehadiran = 'jan' | 'feb' | 'mar' | 'apr' | 'mei' | 'jun' | 'jul' | 'agt' | 'sep' | 'okt' | 'nov' | 'des';

export interface DetailPosyanduAnakKehadiranItem {
  id: number;
  nama: string;
  nik: string;
  ibu: string;
  kategori_kemiskinan: string;
  absensi: Record<BulanKehadiran, boolean>;
}

export interface DetailPosyanduKehadiranData {
  periode: Pick<Periode, 'tahun'>;
  ringkasan_kehadiran: DetailPosyanduKehadiranKemiskinanItem[];
  daftar_anak: DetailPosyanduAnakKehadiranItem[];
}

export type DetailPosyanduKehadiranResponse = ApiResponse<DetailPosyanduKehadiranData>;
