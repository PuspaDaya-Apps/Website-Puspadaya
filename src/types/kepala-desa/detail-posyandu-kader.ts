import { ApiResponse, Periode } from './common';

export interface DetailPosyanduKategoriKinerjaRange {
  min: number;
  max: number;
}

export interface DetailPosyanduTotalSasaran {
  total_balita_sasaran: number;
  total_ibu_hamil_sasaran: number;
}

export interface DetailPosyanduKehadiranKader {
  jumlah_hadir: number;
  total_kegiatan: number;
  persentase: number;
}

export interface DetailPosyanduCakupanPendampingan {
  jumlah_didampingi: number;
  total_sasaran: number;
  persentase: number;
}

export interface DetailPosyanduKetepatanLaporan {
  jumlah_laporan_tepat_waktu: number;
  total_laporan: number;
  persentase: number;
}

export interface DetailPosyanduIndikatorKinerja {
  kehadiran_kader: DetailPosyanduKehadiranKader;
  cakupan_pendampingan: DetailPosyanduCakupanPendampingan;
  ketepatan_laporan: DetailPosyanduKetepatanLaporan;
}

export interface DetailPosyanduKaderItem {
  id_kader: number;
  nama: string;
  jabatan: string;
  jumlah_balita_didampingi: number;
  jumlah_ibu_hamil_didampingi: number;
  indikator_kinerja: DetailPosyanduIndikatorKinerja;
  skor_kinerja: number;
  status_kinerja: string;
}

export interface DetailPosyanduKaderData {
  periode: Periode;
  total_sasaran: DetailPosyanduTotalSasaran;
  kategori_kinerja: {
    rendah: DetailPosyanduKategoriKinerjaRange;
    sedang: DetailPosyanduKategoriKinerjaRange;
    tinggi: DetailPosyanduKategoriKinerjaRange;
  };
  kader: DetailPosyanduKaderItem[];
}

export type DetailPosyanduKaderResponse = ApiResponse<DetailPosyanduKaderData>;
