import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { ApiResponsePersebaranKaderDusun } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: ApiResponsePersebaranKaderDusun | null;
}

// Fungsi untuk mendapatkan data trend persebaran posyandu berdasarkan desa/kelurahan
export const trendPersebaranKader = async (desaKelurahan: string): Promise<FetchResult> => {
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

        // Mengambil data dari API dengan parameter desa_kelurahan
        const response = await axios.get<ApiResponsePersebaranKaderDusun>(
            `${APIEndpoints.TRENDPERSEBARANKADER}?desa_kelurahan=${desaKelurahan}`,
            config
        );

        const data = response.data;
        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error fetching data:", message);
        return { successCode: status, data: null };
    }
};
