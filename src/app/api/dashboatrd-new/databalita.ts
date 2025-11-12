import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { AnakItem } from '@/types/data-25/DataBalita';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: AnakItem | null;
}

// Fungsi utama untuk fetch data Ibu Hamil
export const Databalita = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        console.log('⚠️ Server-side rendering detected, returning empty response.');
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            console.warn('⚠️ No access token found.');
            return { successCode: 401, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        console.log(`📡 Fetching data from ${APIEndpoints.ANAKPOSYANDU}`);
        const response = await axios.get<AnakItem>(APIEndpoints.ANAKPOSYANDU, config);
        const data = response.data;

        console.log('API Response:', data);

        // Removing any previous error message from sessionStorage
        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };
    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error('❌ Error occurred:', message);

        return { successCode: status, data: null };
    }
};
