import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { AnakResponse } from '@/types/data-25/AnakResponse';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: AnakResponse["data"] | null;
}

// Debug helper → tinggal ON/OFF dari sini
const DEBUG_MODE = false;
const debugLog = (...args: any[]) => {
    if (DEBUG_MODE) console.log(...args);
};

export const Databalita = async (): Promise<FetchResult> => {

    if (typeof window === 'undefined') {
        debugLog("SSR mode – Databalita tidak dijalankan.");
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');

        if (!accessToken) {
            debugLog("Tidak ada access token ditemukan.");
            return { successCode: 401, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        debugLog("Mengambil data dari endpoint:", APIEndpoints.ANAKPOSYANDU);

        const response = await axios.get<AnakResponse>(APIEndpoints.ANAKPOSYANDU, config);

        debugLog("Status Response:", response.status);
        debugLog("Full API Response:", response.data);

        const { data } = response.data;

        debugLog("Data Anak (array):", data);
        debugLog("Jumlah Anak:", data.length);

        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };

    } catch (err: any) {

        const { status, message } = handleError(err);

        // log error juga dimatikan
        debugLog("Error saat fetch Databalita:", message);

        return { successCode: status, data: null };
    }
};
