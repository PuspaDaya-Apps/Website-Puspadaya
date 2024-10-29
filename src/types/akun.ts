import { Role } from "./role";

export type Akun = {
  namaLengkap: string;
  noTelepon: string;
  email: string;
  kata_sandi:string;
  konfirmasi_sandi:string;
  posisi: Role
  alamat :{
    kabupaten:string,
    kecamatan:string,
    desa:string,
    dusun:string,
  }
};
