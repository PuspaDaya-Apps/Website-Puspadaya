import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { KaderProfileData, KaderProfileResponse } from '@/types/data-25/statistikbebankerja';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    response?: KaderProfileResponse | null; // seluruh response
    data: KaderProfileData | null;          // langsung data
}

export const StatistikJenisPekerjaan = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, response: null, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            return { successCode: 401, response: null, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await axios.get<KaderProfileResponse>(
            APIEndpoints.PROFILEJENISPEKERJAAN,
            config
        );


        // Simpan message + data sekaligus
        return {
            successCode: response.status,
            response: response.data,  // KaderProfileResponse
            data: response.data.data, // KaderProfileData
        };
    } catch (err: any) {
        const { status } = handleError(err);
        return { successCode: status, response: null, data: null };
    }
};
