import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { IbuHamilResponse } from '@/types/data-25/IbuHamilResponse';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: IbuHamilResponse | null;
}

// Fungsi utama untuk fetch data Ibu Hamil
export const Ibuhamil = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        console.warn(' Fungsi dijalankan di server-side, dibatalkan.');
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            console.warn(' Token tidak ditemukan di sessionStorage');
            return { successCode: 401, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        console.log(' Mengirim request ke:', APIEndpoints.IBUHAMIL);

        const response = await axios.get<IbuHamilResponse>(APIEndpoints.IBUHAMIL, config);

        console.log(' Response Status:', response.status);
        console.log(' Full Response Data:', response.data);

        const data = response.data;
        console.log(' Jumlah Data Ibu Hamil:', data.meta.totalItems);
        console.table(data.data.map((item) => ({
            Nama: item.nama_ibu,
            Usia: item.usia_ibu,
            Suami: item.nama_suami,
            'Usia Kehamilan': item.usia_kehamilan,
            'Terakhir Update': item.updated_at,
        })));

        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };
    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error(' Error fetching data Ibu Hamil:', message);
        return { successCode: status, data: null };
    }
};
