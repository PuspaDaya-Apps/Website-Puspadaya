import { KuisionerList } from '@/types/data-25/KuisionerList';
import axios from 'axios';
import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';

interface FetchResult {
    successCode: number;
    data: KuisionerList[] | null;
}

export const Listkuesioner = async (): Promise<FetchResult> => {
    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken) {
            console.warn('Token tidak ditemukan di sessionStorage');
            return { successCode: 401, data: null };
        }

        const response = await axios.get<KuisionerList[]>(APIEndpoints.KUESIONER, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // console.log(' Data Kuisioner berhasil diambil:', response.data); 
        // console.log(' Status response:', response.status); 

        return { successCode: response.status, data: response.data };
    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error('Error fetching data Kuisioner:', message);
        console.error('Detail error:', err);
        return { successCode: status, data: null };
    }
};
