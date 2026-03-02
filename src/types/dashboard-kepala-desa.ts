// Type definitions for Dashboard Kepala Desa

export interface PosyanduItem {
  id: string;
  nama_posyandu: string;
  nama_dusun: string;
  nama_kecamatan: string;
  nama_kabupaten_kota: string;
  total_balita: number;
  total_ibu_hamil: number;
  total_kader: number;
  kehadiran_balita_bulan_ini: number;
  kehadiran_ibu_hamil_bulan_ini: number;
  status_stunting: number;
  status_gizi_buruk: number;
  persentase_kehadiran: number;
  last_updated: string;
}

// Kader Workload Types
export interface KaderWorkload {
  id: string;
  nama_kader: string;
  posyandu_id: string;
  posyandu_nama: string;
  role: string;
  durasi_kerja_posyandu: number; // hours
  durasi_kunjungan_rumah: number; // hours
  jarak_kunjungan: number; // km
  total_balita_dibina: number;
  total_ibu_hamil_dibina: number;
  skor_beban_kerja: number;
  kategori_beban: "Tinggi" | "Sedang" | "Rendah";
  status: "aktif" | "non_aktif";
}

export interface KaderWorkloadSummary {
  total_kader: number;
  rata_rata_beban_kerja: number;
  beban_tinggi_count: number;
  beban_sedang_count: number;
  beban_rendah_count: number;
  total_jam_kerja_posyandu: number;
  total_jam_kunjungan: number;
  total_jarak_tempuh: number;
}

// Critical Children (Gizi Buruk & Stunting) Types
export interface CriticalChild {
  id: string;
  nik_anak: string;
  nama_anak: string;
  tanggal_lahir: string;
  usia_bulan: number;
  jenis_kelamin: "Laki-laki" | "Perempuan";
  nama_ibu: string;
  posyandu_id: string;
  posyandu_nama: string;
  dusun: string;
  berat_badan: number; // kg
  tinggi_badan: number; // cm
  status_gizi: "Gizi Buruk" | "Gizi Kurang" | "Gizi Baik" | "Gizi Lebih";
  status_stunting: "Stunting" | "Tidak Stunting";
  status_wasting: "Wasting" | "Tidak Wasting";
  tanggal_pengukuran: string;
  prioritas: "Sangat Tinggi" | "Tinggi" | "Sedang";
}

export interface DashboardSummary {
  total_posyandu: number;
  total_balita: number;
  total_ibu_hamil: number;
  total_kader: number;
  rata_rata_kehadiran: number;
  kasus_stunting: number;
  kasus_gizi_buruk: number;
  posyandu_aktif: number;
  posyandu_non_aktif: number;
}

export interface MonthlyTrendData {
  bulan: string;
  balita: number;
  ibu_hamil: number;
  kader: number;
}

export interface PosyanduPerformance {
  posyandu_id: string;
  nama_posyandu: string;
  skor_kinerja: number;
  kategori: "Sangat Baik" | "Baik" | "Cukup" | "Kurang";
  kehadiran: number;
  pengukuran_balita: number;
  pengukuran_ibu_hamil: number;
}

export interface RecentActivity {
  id: string;
  posyandu_nama: string;
  activity_type: "pengukuran_balita" | "pengukuran_ibu_hamil" | "kuesioner" | "laporan";
  description: string;
  tanggal: string;
  kader_nama: string;
}

export interface StuntingGiziData {
  posyandu_nama: string;
  stunting_count: number;
  gizi_buruk_count: number;
  normal_count: number;
  total_balita: number;
}

export interface KaderDistribution {
  nama_kader: string;
  posyandu_nama: string;
  role: string;
  beban_kerja: number;
  status: "aktif" | "non_aktif";
}
