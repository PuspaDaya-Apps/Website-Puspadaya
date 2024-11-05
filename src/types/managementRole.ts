export enum AccessRight {
  DASHBOARD_KETUA_KADER = "dashboard_ketua_kader",
  CREATE_ORANG_TUA = "create_orang_tua",
  UPDATE_ORANG_TUA = "update_orang_tua",
  DELETE_ORANG_TUA = "delete_orang_tua",    
  DASHBOARD_ANGGOTA = "dashboard_anggota",
  CREATE_ANGGOTA = "create_anggota",
  UPDATE_ANGGOTA = "update_anggota",
  DELETE_ANGGOTA = "delete_anggota",
  CRUD_BALITA = "crud_balita",
  CREATE_BALITA = "create_balita",
  UPDATE_BALITA = "update_balita",
  DELETE_BALITA = "delete_balita",
  DASHBOARD_BIDAN = "dashboard_bidan",
  CREATE_BIDAN = "create_bidan",
  UPDATE_BIDAN = "update_bidan",
  DELETE_BIDAN = "delete_bidan",
}

type User = {
  id: string;
  name: string;
};

type Role = {
  id: number;
  namaRole: string;
  accessRights: AccessRight[];
  usersWithAccess: User[];
};

export default Role;
