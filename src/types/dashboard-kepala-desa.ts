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

export interface RecentActivity {
  id: string;
  posyandu_nama: string;
  activity_type: "pengukuran_balita" | "pengukuran_ibu_hamil" | "kuesioner" | "laporan";
  description: string;
  tanggal: string;
  kader_nama: string;
}
