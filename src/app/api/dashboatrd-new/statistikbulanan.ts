import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { MonthlyActivityData, MonthlyActivityResponse } from '@/types/data-25/statistikbebankerja';
import axios from 'axios';
import { getSessionStorageWithTTL, setSessionStorageWithTTL } from '@/utils/sessionStorageUtils';

interface FetchResult {
    successCode: number;
    data: MonthlyActivityData | null;
}

const CACHE_KEY = 'statistik_bulanan';

export const StatistikBulanan = async (useCache: boolean = true): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    // Check if data exists in cache and is not expired
    if (useCache) {
        const cachedData = getSessionStorageWithTTL(CACHE_KEY);
        if (cachedData) {
            return { successCode: 200, data: cachedData };
        }
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

        const response = await axios.get<MonthlyActivityResponse>(
            APIEndpoints.KEHADIRANAKTIVITASBULANAN,
            config
        );

        const { data } = response.data;

        // Store data in session storage with TTL (30 minutes)
        setSessionStorageWithTTL(CACHE_KEY, data, 30);

        // sessionStorage.removeItem(Messages.ERROR);
        sessionStorage.removeItem('ERROR');

        return { successCode: response.status, data };
    } catch (err: any) {
        // Tampilkan error yang lebih informatif di console tanpa URL lengkap
        console.log('Error 500: Gagal mendapatkan data statistik bulanan');
        return { successCode: 500, data: null };
    }
};
