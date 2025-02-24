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
  
  type ApiResponse = {
    message: string;
    data: UserData | null; // Bisa null jika request gagal
  };
  