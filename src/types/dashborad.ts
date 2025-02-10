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
  