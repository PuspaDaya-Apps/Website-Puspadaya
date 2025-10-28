import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { IbuHamilResponse } from '@/types/data-25/IbuHamilResponse';
import { SubmitPayload } from '@/types/data-25/SubmitKuesioner';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: IbuHamilResponse | null;
}

/**
 * Kirim data kuisioner ke API
 * @param payload - data kuisioner dalam format JSON
 */
export const Submitkuesioner = async (payload: SubmitPayload): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            console.warn('Akses token tidak ditemukan. Harap login terlebih dahulu.');
            return { successCode: 401, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        const response = await axios.post<IbuHamilResponse>(
            APIEndpoints.SUBMITEKUESIONER,
            payload,
            config
        );

        sessionStorage.removeItem(Messages.ERROR);

        // ✅ Log jika berhasil
        // if (response.status >= 200 && response.status < 300) {
        //     console.log('✅ Kuesioner berhasil dikirim!');
        //     console.log('🗓️ Tanggal Pengisian:', payload.tanggal_pengisian);
        //     console.log('🎯 Target:', payload.target_type, '-', payload.target_id);
        //     console.log('📨 Status Code:', response.status);
        // }

        return { successCode: response.status, data: response.data };
    } catch (err: any) {
        const { status } = handleError(err);
        console.error(' Gagal mengirim kuisioner. Status:', status);
        return { successCode: status, data: null };
    }
};
