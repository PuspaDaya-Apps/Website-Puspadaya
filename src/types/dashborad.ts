export type StatistikClass = {
    jumlah_anak: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_stunting: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_underweight: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_wasting: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_kenaikan_bb: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_bb_tetap: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_penurunan_bb: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_kenaikan_kbm: {
        D_: number;
        O: number;
        B: number;
        T: number;
        persentaseKenaikanBBKbm: string;
    };
    perhitungan_skdn: {
        D_S: {
            jumlah: number;
            status: any;
            rate: any;
        };
        K_S: {
            jumlah: number;
            status: any;
            rate: any;
        };
    };
    jumlah_anak_lulus: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_mpasi: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_asi_ekslusif: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_tidak_punya_nik: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_ibu_tidak_punya_nik: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_ayah_tidak_punya_nik: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_orang_tua_tidak_punya_kk: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_desa: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_ibu_hamil: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_ibu_hamil_kurang_dari_20: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_ibu_hamil_lebih_dari_35: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_terlalu_banyak: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_kehamilan_terlalu_dekat: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_posyandu: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_kader: {
        jumlah: number;
        status: any;
        rate: any;
    };
    keluarga_tanpa_mck: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_ibu_hamil_hpl: {
        jumlah: number;
        status: any;
        rate: any;
    };
    jumlah_anak_hadir: {
        jumlah: number;
        status: any;
        rate: any;
    };
    persentase_kader: {
        banyuwangi_rate: number;
        maluku_rate: number;
    };
    persentase_posyandu: {
        banyuwangi_rate: number;
        maluku_rate: number;
    };
};

//grafik maps anak stunting
export type DusunData = {
  nama_dusun: string;
  count_stunting: number;
  count_wasting: number;
  count_gizi_baik: number;
};

export type DesaData = {
  nama_desa: string;
  count_stunting: number;
  count_wasting: number;
  count_gizi_baik: number;
  dusun: DusunData[];
};

export type MapPersebaranResponse = {
  message: string;
  data: DesaData[];
};



export type TrenGiziResponse = {
    message: string;
    data: TrenGizi[];
};

export type TrenGizi = {
    tahun: number;
    jumlah_gizi_baik: number;
    jumlah_gizi_buruk: number;
};


export type KehadiranStatistikResponse = {
    message: string;
    data: KehadiranStatistik[];
};

export type KehadiranStatistik = {
    bulan: number;
    jumlah_hadir: number;
};




export type Provinsi = {
    id: string;
    nama_provinsi: string;
};

export type KabupatenClass = {
    id: string;
    nama_kabupaten_kota: string;
    provinsi: Provinsi;
};

export type KabupatenResponse = {
    data: KabupatenClass[];
    meta: {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
    links: {
        first: string;
        last: string;
        current: string;
        next?: string;
        previous?: string;
    };
    message: string;
};


export type KecamatanClass = {
    id: string;
    nama_kecamatan: string;
    kabupaten_kota: KabupatenClass;
};


export type DesakelurahanClass = {
    id: string;
    nama_desa_kelurahan: string;
    kecamatan: {
        id: string;
        nama_kecamatan: string;
    };
};


export type GiziDusunClass = {
    id: string;
    nama_dusun: string;
    anak_gizi_baik_count: number;
    anak_gizi_buruk_count: number;
};

export interface PosyanduData {
    id: string;
    nama_dusun: string;
    posyandu_aktif_count: number;
    posyandu_tidak_aktif_count: number;
}

export interface PersebaranPosyanduResponse {
    message: string;
    data: PosyanduData[];
}




export interface DataPersebaranKaderDusun {
    id: string; // Readonly karena biasanya ID tidak berubah
    nama_dusun: string;
    kader_aktif_count: number;
    kader_tidak_aktif_count: number;
}

export interface ApiResponsePersebaranKaderDusun {
    message: string;
    data: DataPersebaranKaderDusun[]; // Pastikan API tidak mengembalikan `null`, sebaiknya `[]`
}


