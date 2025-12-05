export interface RaporResponse {
    anak: Anak;
    pengukuran_anak: PengukuranAnak | null;
    orang_tua: OrangTua;
    pengukuran_ibu_hamil: PengukuranIbuHamil | null;
}



export interface Anak {
    id: string;
    nik: string;
    nama_anak: string;
    tempat_lahir: string;
    tanggal_lahir: string; // ISO date
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
    tanggal_pengukuran: string; // ISO date
    berat_badan: string;
    tinggi_badan: string;
    lingkar_lengan_atas: string;
    lingkar_kepala: string;
    asi_eksklusif: string;
    mpasi: string;
    status_stunting: string;
    status_gizi: string;
    status_wasting: string;
}

export interface OrangTua {
    ibu: Ibu;
    ayah: Ayah;
}

export interface Ibu {
    id: string;
    nik: string;
    nama_ibu: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_telepon: string;
    gol_darah: string;
    jenis_kb: string;
}

export interface Ayah {
    id: string;
    nik: string;
    nama_ayah: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_telepon: string | null; // ← sesuai API kamu
}

export interface PengukuranIbuHamil {
    // Isi jika nanti ada datanya
}
