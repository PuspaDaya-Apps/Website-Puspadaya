export const APIEndpoints = {
    AUTHENTICATION: '/api/v1/auth/login',
    REFRESH_TOKEN: '/api/v1/auth/refresh',
    TOKEN_API: '/api/token',
    CURRENT: '/api/v1/users/current',

    DASHBOARD: '/api/v1/dashboard',
    DASHBOARDDINASSOSIAL: '/api/v1/dashboard/provinsi',
    DASHBOARDKEPALADESA: '/api/v1/dashboard/desa-kelurahan',
    DASHBOARDPOSYANDU: '/api/v1/dashboard/posyandu',
    DASHBOARDDINASKESEHATAN: '/api/v1/dashboard/provinsi',
    DASHBOARDTPG: '/api/v1/dashboard/desa-kelurahan',
    TRENGIZI: '/api/v1/dashboard/tren-gizi',
    TRENKEHADIRAN: '/api/v1/dashboard/kehadiran-statistik',
    KABUPATEN: '/api/v1/kabupaten-kota',
    KECAMATAN: '/api/v1/kecamatan',
    DESAKELURAHAN: '/api/v1/desa-kelurahan',
    GRAFIKGIZI: '/api/v1/dashboard/tingkat-gizi',
    TRENDPOSYANDU: '/api/v1/dashboard/persebaran-posyandu',
    TRENDPERSEBARANKADER: '/api/v1/dashboard/persebaran-kader',

    //Grafik Maps
    MAPANAKSTUNTING: '/api/v1/dashboard/map-anak-stunting',
    MAPPERSEBARANANAK: '/api/v1/dashboard/map-persebaran-anak',
    MAPPERSEBARANKADERAKTIFNONAKTIF: '/api/v1/dashboard/map-persebaran-kader',
    MAPPERSEBARANMCK: "/api/v1/dashboard/map-persebaran-mck",


    // API BARU
    // Kuesioner
    IBUHAMIL: '/api/v1/ibu-hamil',
    KUESIONER: '/api/v1/kuisioner?kategori=ibu_hamil',
    SUBMITEKUESIONER: '/api/v1/kuisioner/respon',
    DETAILKUESIONER: '/api/v1/kuisioner/respon/target/ibu_hamil',
    POINTSKUESIONER: '/api/v1/kuisioner/respon',

    // API DASHBPOARD BARU
    STATISTIKKEHADIRANBEBANKERJA: '/api/v1/statistik-kehadiran-bebanKerja',
    KEHADIRANAKTIVITASBULANAN: '/api/v1/grafik-kehadiran-aktivitas-bulanan',
    DURASIBEBANKERJAPOSYANDU: '/api/v1/durasi-kerja-jaraktempuh',
    PROFILEJENISPEKERJAAN: "/api/v1/profilekader-jenispekerjaan",
    ANAKPOSYANDU: "/api/v1/anak-posyandu",
    RAPOIRTANAK: "/api/v1/report/balita",

    // API KEPALA DESA NEW
    INFORMASI_DATA_DESA: '/api/v1/kepala-dashboard/informasi-data-desa',
    TREND_DATA_POSYANDU: '/api/v1/kepala-dashboard/tren-data',
    STATISTIK_DATA_DESA: '/api/v1/kepala-dashboard/statistik-data-desa',
    ANAK_CAKUPAN_DILAYANI: '/api/v1/kepala-dashboard/anak-cakupan-dilayani',
    STATISTIK_SKDN: '/api/v1/kepala-dashboard/statistik-skdn',
    DURASI_KERJA_POSYANDU: '/api/v1/kepala-dashboard/durasi-kerja-posyandu',
    SKOR_BEBAN_KERJA_TIM: '/api/v1/kepala-dashboard/skor-beban-kerja-tim',
    IMUNISASI_KEPENDUDUKAN: '/api/v1/kepala-dashboard/imunisasi-kependudukan',
    LOG_AKTIVITAS_KADER: '/api/v1/kepala-dashboard/log-aktivitas-kader',
    DETAIL_POSYANDU_KEPALA_DESA: '/api/posyandu/kepaladesa/{id_posyandu}',
    KINERJA_KEPALA_DESA_RINGKASAN: '/api/posyandu/kepaladesa/kinerja/ringkasan',
    KINERJA_KEPALA_DESA_PERHATIAN_KHUSUS: '/api/posyandu/kepaladesa/kinerja/perhatian-khusus',
    DATA_KASUS_KRITIS_KEPALA_DESA: '/api/posyandu/kepaladesa/data-kasus-kritis',
    DATA_KASUS_KRITIS_BALITA_KEPALA_DESA: '/api/posyandu/kepaladesa/data-kasus-kritis-balita',
    DETAIL_DATA_KASUS_KRITIS_KEPALA_DESA: '/api/posyandu/kepaladesa/detail/data-kasus-kritis',

};
