import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { KaderProfileData, KaderProfileResponse } from '@/types/data-25/statistikbebankerja';
import axios from 'axios';
import { getSessionStorageWithTTL, setSessionStorageWithTTL } from '@/utils/sessionStorageUtils';

interface FetchResult {
    successCode: number;
    response?: KaderProfileResponse | null; // seluruh response
    data: KaderProfileData | null;          // langsung data
}

const CACHE_KEY = 'statistik_jenis_pekerjaan';

export const StatistikJenisPekerjaan = async (useCache: boolean = true): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, response: null, data: null };
    }

    // Check if data exists in cache and is not expired
    if (useCache) {
        const cachedData = getSessionStorageWithTTL(CACHE_KEY);
        if (cachedData) {
            return {
                successCode: 200,
                response: cachedData,  // KaderProfileResponse
                data: cachedData.data, // KaderProfileData
            };
        }
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

        // Store data in session storage with TTL (30 minutes)
        setSessionStorageWithTTL(CACHE_KEY, response.data, 30);

        // Simpan message + data sekaligus
        return {
            successCode: response.status,
            response: response.data,  // KaderProfileResponse
            data: response.data.data, // KaderProfileData
        };
    } catch (err: any) {
        // Tampilkan error yang lebih informatif di console tanpa URL lengkap
        console.log('Error 500: Gagal mendapatkan data jenis pekerjaan kader');
        return { successCode: 500, response: null, data: null };
    }
};
