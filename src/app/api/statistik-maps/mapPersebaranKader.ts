import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { DesaKader, PersebaranKaderResponse } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: PersebaranKaderResponse | null;
    error?: string;
}

export const mapPersebaranKader = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null, error: 'Server-side execution not allowed' };
    }

    try {
        const accessToken = sessionStorage.getItem("access_token");
        if (!accessToken) {
            return { successCode: 401, data: null, error: 'Unauthorized' };
        }

        const response = await axios.get<PersebaranKaderResponse>(APIEndpoints.MAPPERSEBARANKADERAKTIFNONAKTIF, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // console.log("Raw API Response:", response.data);

        // Return the exact structure from the API
        return {
            successCode: response.status,
            data: response.data
        };

    } catch (err: any) {
        const { status, message } = handleError(err);
        return {
            successCode: status,
            data: null,
            error: message
        };
    }
};