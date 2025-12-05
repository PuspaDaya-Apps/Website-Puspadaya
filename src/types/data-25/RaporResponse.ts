export interface RaporResponse {
    anak: AnakResponseRapor;
    pengukuran_anak: PengukuranAnakResponseRapor | null;
    orang_tua: OrangTuaResponseRapor;
    pengukuran_ibu_hamil: PengukuranIbuHamil | null;
}



export interface AnakResponseRapor {
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

export interface PengukuranAnakResponseRapor {
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

export interface OrangTuaResponseRapor {
    ibu: IbuResponseRapor;
    ayah: AyahResponseRapor;
}

export interface IbuResponseRapor {
    id: string;
    nik: string;
    nama_ibu: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_telepon: string;
    gol_darah: string;
    jenis_kb: string;
}

export interface AyahResponseRapor {
    id: string;
    nik: string;
    nama_ayah: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_telepon: string | null; // ← sesuai API kamu
}

export interface PengukuranIbuHamil {
    tanggal: string;
    tempat: string;
    usiaKehamilan: string | number;
    tinggi: string | number;
    berat: string | number;
    lila: string | number;
    tinggiFundus: string | number;
    hemoglobin: string | number;
    tglHaid: string;
    asapRokok: string;
    tabletFe: string;
}
