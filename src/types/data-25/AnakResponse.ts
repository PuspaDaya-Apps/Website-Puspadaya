// types/AnakResponse.ts

export interface Anak {
    id: string;
    nik: string;
    nama_anak: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    anak_ke: number;
    berat_badan_lahir: string;
    tinggi_badan_lahir: string;
    lingkar_lengan_atas_lahir: string;
    lingkar_kepala_lahir: string;
    status_stunting: string;
    status_gizi: string;
    status_wasting: string;
}

export interface PengukuranAnak {
    id: string;
    tanggal_pengukuran: string;
    berat_badan: string;
    tinggi_badan: string;
    lingkar_lengan_atas: string | null;
    lingkar_kepala: string | null;
    asi_eksklusif: string;
    mpasi: string;
    status_stunting: string;
    status_gizi: string;
    status_wasting: string;
}

export interface Ibu {
    id: string;
    nik: string;
    nama_ibu: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_telepon: string | null;
    gol_darah: string;
    jenis_kb: string;
}

export interface Ayah {
    id: string;
    nik: string;
    nama_ayah: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_telepon: string | null;
}

export interface OrangTua {
    ibu: Ibu;
    ayah: Ayah;
}

export interface AnakResponse {
    anak: Anak;
    pengukuran_anak: PengukuranAnak;
    orang_tua: OrangTua;
    pengukuran_ibu_hamil: null; // Atau tipe lain jika ada data untuk pengukuran ibu hamil
}
