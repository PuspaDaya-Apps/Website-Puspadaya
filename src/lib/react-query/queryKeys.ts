export interface DashboardPeriod {
  bulan: number;
  tahun: number;
}

const period = ({ bulan, tahun }: DashboardPeriod) => ({ bulan, tahun });

// Satu tempat untuk semua queryKey dashboard, supaya prefetch saat login dan
// hook di komponen tidak pernah memakai key yang berbeda untuk data yang sama.
export const queryKeys = {
  statistikDashboard: (role: string) => ['statistik-dashboard', role] as const,
  currentUser: () => ['current-user'] as const,

  kepalaDesa: {
    informasiDataDesa: (p: DashboardPeriod) => ['kepala-desa', 'informasi-data-desa', period(p)] as const,
    statistikDataDesa: (p: DashboardPeriod) => ['kepala-desa', 'statistik-data-desa', period(p)] as const,
    trenDataPosyandu: (p: DashboardPeriod) => ['kepala-desa', 'tren-data-posyandu', period(p)] as const,
    anakCakupanDilayani: (p: DashboardPeriod) => ['kepala-desa', 'anak-cakupan-dilayani', period(p)] as const,
    statistikSkdn: (p: DashboardPeriod) => ['kepala-desa', 'statistik-skdn', period(p)] as const,
    durasiKerjaPosyandu: (p: DashboardPeriod) => ['kepala-desa', 'durasi-kerja-posyandu', period(p)] as const,
    skorBebanKerjaTim: (p: DashboardPeriod) => ['kepala-desa', 'skor-beban-kerja-tim', period(p)] as const,
    imunisasiKependudukan: (p: DashboardPeriod) => ['kepala-desa', 'imunisasi-kependudukan', period(p)] as const,
    logAktivitasKader: (p: DashboardPeriod) => ['kepala-desa', 'log-aktivitas-kader', period(p)] as const,
  },

  kader: {
    profil: () => ['kader', 'jenis-pekerjaan'] as const,
    bebanKerja: () => ['kader', 'beban-kerja'] as const,
    statistikBulanan: () => ['kader', 'statistik-bulanan'] as const,
    jarakTempuh: () => ['kader', 'jarak-tempuh'] as const,
    daftarBalita: () => ['kader', 'daftar-balita'] as const,
    raporBalita: (id: string) => ['kader', 'rapor-balita', id] as const,
  },

  kinerja: {
    ringkasan: (p: DashboardPeriod) => ['kinerja-kepala-desa', 'ringkasan', period(p)] as const,
    perhatianKhusus: (p: DashboardPeriod) =>
      ['kinerja-kepala-desa', 'perhatian-khusus', period(p)] as const,
    dataKasusKritis: (p: DashboardPeriod) =>
      ['kinerja-kepala-desa', 'data-kasus-kritis', period(p)] as const,
  },

  wilayah: {
    kabupaten: () => ['wilayah', 'kabupaten'] as const,
    kecamatan: () => ['wilayah', 'kecamatan'] as const,
    desa: () => ['wilayah', 'desa'] as const,
    trendPersebaranPosyandu: (desaKelurahan: string) =>
      ['wilayah', 'trend-persebaran-posyandu', desaKelurahan] as const,
  },

  maps: {
    stunting: () => ['maps', 'stunting'] as const,
    persebaranAnak: () => ['maps', 'persebaran-anak'] as const,
    persebaranKader: () => ['maps', 'persebaran-kader'] as const,
    persebaranMck: () => ['maps', 'persebaran-mck'] as const,
  },
} as const;
