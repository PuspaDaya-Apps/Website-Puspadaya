import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import axios from 'axios';

interface FetchResult {
  successCode: number;
  data: UserData | null; // Pastikan sesuai dengan respons API
}

export const currentUser = async (): Promise<FetchResult> => {
  if (typeof window === 'undefined') {
    return { successCode: 500, data: null };
  }

  try {
    const accessToken = sessionStorage.getItem("access_token");

    if (!accessToken) {
      return { successCode: 401, data: null };
    }

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const response = await axios.get<ApiResponse>(APIEndpoints.CURRENT, config);
    const userData = response.data.data;

    // console.log ("ini datanya atuih", userData);

    // Simpan data yang dibutuhkan ke sessionStorage
    if (userData) {
      sessionStorage.setItem("nama_role", userData.role.nama_role);
      sessionStorage.setItem("nama_lengkap", userData.nama_lengkap);
      sessionStorage.setItem("nomor_telepon", userData.nomor_telepon);
      sessionStorage.setItem("tanggal_lahir", userData.tanggal_lahir);
      sessionStorage.setItem("rt", userData.rt);
      sessionStorage.setItem("rw", userData.rw);
      sessionStorage.setItem("alamat_lengkap", userData.alamat_lengkap);
      sessionStorage.setItem("nama_provinsi", userData.provinsi.nama_provinsi);
      sessionStorage.setItem("nama_kelurahan", userData.kelurahan.nama_desa_kelurahan);
      sessionStorage.setItem("nama_dusun", userData.dusun.nama_dusun);
    }

    sessionStorage.removeItem(Messages.ERROR);

    return { successCode: response.status, data: userData };

  } catch (err: any) {
    const { status, message } = handleError(err);
    console.error("Error fetching data:", message);
    return { successCode: status, data: null };
  }
};
