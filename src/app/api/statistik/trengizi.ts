import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { TrenGizi, TrenGiziResponse } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: TrenGizi[] | null; // Ubah menjadi array
  }
  
  export const statistikTrenGizi = async (): Promise<FetchResult> => {
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
  
      const response = await axios.get(APIEndpoints.TRENGIZI, config);
      const { data } = response.data; // Pastikan data adalah array TrenGizi[]
      // console.log("ini adalah datanya", data)
      sessionStorage.removeItem(Messages.ERROR);
  
      return { successCode: response.status, data };
    } catch (err: any) {
      const { status, message } = handleError(err);
      console.error("Error fetching data:", message);
      return { successCode: status, data: null };
    }
  };
