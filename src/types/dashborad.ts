export type StatistikClass = {
    jumlah_anak: {
        jumlah: number;
        status: any;
        rate : any;
    };
    jumlah_anak_stunting: {
        jumlah: number;
        status: any; 
        rate : number;
    };
    jumlah_anak_underweight: {
        jumlah: number;
        status: any; 
        rate : number;
    };
    jumlah_anak_wasting: {
        jumlah: number;
        status: any;
        rate : number;
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

    jumlah_desa: {
        jumlah: number;
        status: any;
        rate : number;
    };
    jumlah_ibu_hamil: {
        jumlah: number;
        status: any;
        rate : number;
    };
    jumlah_posyandu: {
        jumlah: number;
        status: any;
        rate : number;
    };
    jumlah_kader: {
        jumlah: number;
        status: any;
        rate : number;
    };
    persentase_kader: {
        kader_banyuwangi_rate: number;
        kader_maluku_rate: number;
    };
    persentase_posyandu: {
        posyandu_banyuwangi_rate: number;
        posyandu_maluku_rate: number;
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

    // jumlah_orang_tua_tidak_punya_nik: {
    //     ayah_count: number;
    //     ibu_count: number;
    // };

    jumlah_orang_tua_tidak_punya_kk: {
        jumlah: number;
        status: any;
        rate: any;
    };  
}


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