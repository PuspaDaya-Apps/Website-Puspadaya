type Role = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    nama_role: string;
  };
  
  type Posyandu = {
    id: string;
    nama_posyandu: string;
  };
  
  type Provinsi = {
    id: string;
    nama_provinsi: string;
  };
  
  type Kelurahan = {
    id: string;
    nama_desa_kelurahan: string;
  };

  type Dusun = {
    id: string;
    nama_dusun: string;
  };
  
  type UserData = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    nama_lengkap: string;
    nomor_telepon: string;
    tanggal_lahir: string;
    rt: string;
    rw: string;
    alamat_lengkap: string;
    role: Role;
    posyandu: Posyandu;
    provinsi: Provinsi;
    kelurahan : Kelurahan;
    dusun : Dusun;
  };

  type UserCurrent  = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    nama_lengkap: string;
    nomor_telepon: string;
    tanggal_lahir: string;
    rt: string;
    rw: string;
    alamat_lengkap: string;
    role: {
      id: string;
      created_at: string;
      updated_at: string | null;
      deleted_at: string | null;
      nama_role: string;
    };
    posyandu: {
      id: string;
      nama_posyandu: string;
    };
    provinsi: {
      id: string;
      nama_provinsi: string;
    };
    kabupaten_kota: {
      id: string;
      nama_kabupaten_kota: string;
    };
    kecamatan: {
      id: string;
      nama_kecamatan: string;
    };
    desa_kelurahan: {
      id: string;
      nama_desa_kelurahan: string;
    };
    dusun: {
      id: string;
      nama_dusun: string;
    };
  };
  
  type ApiResponse = {
    message: string;
    data: UserData | null; // Bisa null jika request gagal
  };
  