import { ApiResponse, Periode } from './common';

export interface KinerjaPosyanduRingkasanKategori {
  sangat_baik: number;
  baik: number;
  cukup: number;
  kurang: number;
}

export interface KinerjaPosyanduRingkasanData {
  periode: Periode;
  total_posyandu: number;
  rata_rata_skor: number;
  maksimal_skor: number;
  kategori_posyandu: KinerjaPosyanduRingkasanKategori;
}

export type KinerjaPosyanduRingkasanResponse = ApiResponse<KinerjaPosyanduRingkasanData>;

export interface KinerjaPosyanduPerhatianKhususItem {
  rank: number;
  id_posyandu: number;
  nama_posyandu: string;
  lokasi: string;
  skor: number;
  kategori: string;
}

export interface KinerjaPosyanduPerhatianKhususData {
  periode: Periode;
  posyandu: KinerjaPosyanduPerhatianKhususItem[];
}

export type KinerjaPosyanduPerhatianKhususResponse = ApiResponse<KinerjaPosyanduPerhatianKhususData>;

export interface KinerjaPosyanduKasusKritisPrioritas {
  sangat_tinggi: number;
  tinggi: number;
  sedang: number;
}

export interface KinerjaPosyanduKasusKritisRingkasan {
  total_kasus: number;
  wasting: number;
  underweight: number;
  stunting: number;
  prioritas: KinerjaPosyanduKasusKritisPrioritas;
}

export interface KinerjaPosyanduKasusKritisItem {
  id: number;
  nama_posyandu: string;
  total_anak: number;
  stunting: number;
  wasting: number;
  underweight: number;
  normal: number;
}

export interface KinerjaPosyanduKasusKritisDaftarPrioritasAnak {
  id_anak: string;
  nama: string;
  ibu: string;
  usia_bulan: number;
}

export interface KinerjaPosyanduKasusKritisDaftarPrioritasLokasi {
  posyandu: string;
  dusun: string;
}

export interface KinerjaPosyanduKasusKritisDaftarPrioritasPengukuran {
  berat_badan_kg: number;
  tinggi_badan_cm: number;
}

export interface KinerjaPosyanduKasusKritisDaftarPrioritasItem {
  id: number;
  prioritas: 'Sangat Tinggi' | 'Tinggi' | 'Sedang';
  anak: KinerjaPosyanduKasusKritisDaftarPrioritasAnak;
  lokasi: KinerjaPosyanduKasusKritisDaftarPrioritasLokasi;
  pengukuran: KinerjaPosyanduKasusKritisDaftarPrioritasPengukuran;
  status: string[];
}

export interface KinerjaPosyanduKasusKritisData {
  periode: Periode;
  ringkasan: KinerjaPosyanduKasusKritisRingkasan;
  kasus_kritis?: KinerjaPosyanduKasusKritisItem[];
  daftar_prioritas?: KinerjaPosyanduKasusKritisDaftarPrioritasItem[];
}

export type KinerjaPosyanduKasusKritisResponse = ApiResponse<KinerjaPosyanduKasusKritisData>;

export interface KinerjaPosyanduDetailKasusKritisData {
  anak: {
    id_anak: string;
    nama: string;
    nik: string;
    tanggal_lahir: string;
    usia_bulan: number;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    nama_ibu: string;
  };
  lokasi: {
    posyandu: string;
    dusun: string;
  };
  pengukuran_terakhir: {
    berat_badan_kg: number;
    tinggi_badan_cm: number;
    tanggal: string;
  };
  status_kesehatan: string[];
  prioritas: 'Sangat Tinggi' | 'Tinggi' | 'Sedang';
}

export type KinerjaPosyanduDetailKasusKritisResponse = ApiResponse<KinerjaPosyanduDetailKasusKritisData>;
