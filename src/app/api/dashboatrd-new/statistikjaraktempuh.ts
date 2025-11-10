import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { BebanKerjaData, BebanKerjaResponse } from '@/types/data-25/statistikbebankerja';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: BebanKerjaData | null;
}

export const StatistikJarakTempuh = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            return { successCode: 401, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await axios.get<BebanKerjaResponse>(
            APIEndpoints.DURASIBEBANKERJAPOSYANDU,
            config
        );

        const { data } = response.data;

        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };
    } catch (err: any) {
        const { status } = handleError(err);
        return { successCode: status, data: null };
    }
};
