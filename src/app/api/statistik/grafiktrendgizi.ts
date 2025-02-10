import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { GiziDusunClass } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: GiziDusunClass | null; 
}

// Tambahkan parameter desa_kelurahan pada fungsi Grafikgizi
export const Grafikgizi = async (desaKelurahan: string): Promise<FetchResult> => {
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

        // Menggunakan parameter desa_kelurahan untuk menambahkannya ke URL query
        const response = await axios.get(`${APIEndpoints.GRAFIKGIZI}?desa_kelurahan=${desaKelurahan}`, config);
        
        const { data } = response.data;
        console.log("ini jeh datanyo", data)
        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error fetching data:", message);
        return { successCode: status, data: null };
    }
};
