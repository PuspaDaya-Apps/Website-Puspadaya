import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { AnakResponse } from '@/types/data-25/AnakResponse';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: AnakResponse["data"] | null; // array AnakItem
}

// Fungsi utama untuk fetch data Balita
export const Databalita = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        console.log("SSR mode – Databalita tidak dijalankan.");
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            console.log("Tidak ada access token ditemukan.");
            return { successCode: 401, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        console.log("Mengambil data dari endpoint:", APIEndpoints.ANAKPOSYANDU);

        const response = await axios.get<AnakResponse>(APIEndpoints.ANAKPOSYANDU, config);

        console.log("Status Response:", response.status);
        console.log("Full API Response:", response.data);

        const { data } = response.data;

        console.log("Data Anak (array):", data);
        console.log("Jumlah Anak:", data.length);

        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };
    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error saat fetch Databalita:", message);
        return { successCode: status, data: null };
    }
};
