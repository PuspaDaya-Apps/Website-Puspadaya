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
