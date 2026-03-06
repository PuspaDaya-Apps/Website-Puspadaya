// Type definitions for Dashboard Kepala Desa
import { SKDNData } from "@/components/Dashboard/component-desa/SKDNBarChart";

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
  // Data kependudukan tambahan
  skdn: number; // Sistem Klasifikasi Desa Nusantara (tingkat 1-4)
  skdn_data: SKDNData; // Data detail SKDN untuk grafik
  // Kunjungan berdasarkan usia
  infant_0_12_months: number; // Bayi 0-12 bulan berkunjung ke posyandu
  children_0_23_months: number; // Anak 0-23 bulan berkunjung ke posyandu
  children_0_59_months: number; // Anak 0-59 bulan berkunjung ke posyandu
  // Data wanita
  women_post_fertile: number; // Wanita usia setelah subur (>49 tahun)
  pregnant_women_under_energized: number; // Ibu hamil dengan KEK (Kurang Energi Kronis)
  high_risk_pregnant_women: number; // Ibu hamil dengan risiko tinggi
  breastfeeding_mothers: number; // Ibu menyusui dengan ASI Eksklusif (dihitung dari data anak)
  // Data bayi
  newborn_count: number; // Jumlah bayi baru lahir
  // Imunisasi
  infant_immunization_coverage: InfantImmunizationCoverage; // Cakupan imunisasi bayi
  // KB dan asuransi
  pregnant_women_with_insurance: number; // Ibu hamil dengan jaminan kesehatan
  kb_acceptors: number; // Jumlah akseptor KB
  // Asuransi kesehatan anak
  infant_with_insurance: number; // Bayi 0-12 bulan dengan jaminan kesehatan
  children_under_5_with_insurance: number; // Balita 0-59 bulan dengan jaminan kesehatan
  // Prevalensi balita
  stunting_prevalence: PrevalensiData; // Jumlah dan prevalensi stunting
  wasting_prevalence: PrevalensiData; // Jumlah dan prevalensi wasting
  underweight_prevalence: PrevalensiData; // Jumlah dan prevalensi underweight
  // Data agregat kader (seperti DashboardAnggotaKader)
  kehadiran_kompetensi: KehadiranKompetensi; // Kehadiran per kompetensi
  durasi_jarak_agregat: DurasiJarakAgregat; // Durasi & jarak agregat tim
  beban_kerja_tim: BebanKerjaTimSummary; // Summary beban kerja tim
}

export interface InfantImmunizationCoverage {
  bcg: number;
  dpt_1: number;
  dpt_2: number;
  dpt_3: number;
  polio_1: number;
  polio_2: number;
  polio_3: number;
  polio_4: number;
  hepatitis: number;
  campak: number;
  total_imunisasi: number;
  cakupan_persentase: number;
}

export interface PrevalensiData {
  jumlah: number;
  prevalensi_persentase: number;
  total_balita: number;
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

// Kompetensi Kehadiran Types
export interface KompetensiItem {
  kompetensi: string;
  jumlah: number;
  aktivitas_kader?: string[]; // Optional: untuk ibu hamil
}

export interface KehadiranKompetensi {
  balita: {
    total_hadir: number;
    detail: KompetensiItem[];
  };
  ibu_hamil: {
    total_hadir: number;
    detail: KompetensiItem[];
  };
}

// Agregat Durasi & Jarak untuk Tim Kader
export interface DurasiJarakAgregat {
  total_durasi_kerja_posyandu: number; // jam
  total_durasi_kunjungan_rumah: number; // jam
  total_jarak_kunjungan_rumah: number; // km
  rata_rata_durasi_posyandu: number; // jam per kader
  rata_rata_durasi_kunjungan: number; // jam per kader
  rata_rata_jarak: number; // km per kader
}

// Summary untuk Beban Kerja Tim
export interface BebanKerjaTimSummary {
  total_kader: number;
  skor_beban_rata_rata: number;
  skor_beban_tertinggi: number;
  skor_beban_terendah: number;
  kader_beban_tinggi: number;
  kader_beban_sedang: number;
  kader_beban_rendah: number;
}
