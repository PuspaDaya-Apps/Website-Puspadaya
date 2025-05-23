import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: UserCurrent[] | null; 
  }
  
  export const currentUser = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
      return { successCode: 500, data: null };
    }
  
    try {
      const accessToken = sessionStorage.getItem("access_token");
      // console.log("ini adlaah datanya")
  
      if (!accessToken) {
        return { successCode: 401, data: null };
      }
  
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
  
      const response = await axios.get(APIEndpoints.CURRENT, config);
      const { data } = response.data; 

      if (data?.provinsi?.nama_provinsi) {
        sessionStorage.setItem('nama_provinsi', data.provinsi.nama_provinsi);
        sessionStorage.setItem('nama_kecamatan', data.kecamatan.nama_kecamatan);
        sessionStorage.setItem('nama_desa_kelurahan', data.desa_kelurahan.nama_desa_kelurahan);
        sessionStorage.setItem('nama_dusun', data.dusun.nama_dusun);
        
      }
     
     
      sessionStorage.removeItem(Messages.ERROR);
  
      return { successCode: response.status, data };
    } catch (err: any) {
      const { status, message } = handleError(err);
      console.error("Error fetching data:", message);
      return { successCode: status, data: null };
    }
  };
