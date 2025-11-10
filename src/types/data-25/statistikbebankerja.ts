// Type definition for the response
export interface KaderStatisticsResponse {
    message: string;
    data: KaderStatisticsData;
}

export interface KaderStatisticsData {
    total_anak_diukur_bulan_ini: number;
    total_ibu_hamil_diukur_bulan_ini: number;
    skor_beban_kerja_bulan_ini: number;
}


export interface JenisPekerjaan {
    kategori: string;
    jenis: string;
}

export interface MonthlyActivityData {
    jumlah_kehadiran_balita: number;
    jumlah_kehadiran_ibu_hamil: number;
    jenis_pekerjaan: JenisPekerjaan[];
}

export interface MonthlyActivityResponse {
    message: string;
    data: MonthlyActivityData;
}




export interface BebanKerjaData {
    durasi_kerja_posyandu: number;
    durasi_kunjungan_rumah: number;
    jarak_total_kunjungan_rumah: number;
}

// Struktur response lengkap dari API
export interface BebanKerjaResponse {
    message: string;
    data: BebanKerjaData;
}

export interface KaderProfileData {
    nama_kader: string;
    nama_role: string;
    jenis_pekerjaan: string[];
}

export interface KaderProfileResponse {
    message: string;
    data: KaderProfileData;
}