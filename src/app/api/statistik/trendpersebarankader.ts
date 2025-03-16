import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { ApiResponsePersebaranKaderDusun } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: ApiResponsePersebaranKaderDusun | null;
}

// Fungsi untuk mendapatkan data trend persebaran kader berdasarkan desa/kelurahan
export const trendPersebaranKader = async (desaKelurahan: string): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        // console.log("❌ Fungsi tidak dapat berjalan di server-side.");
        return { successCode: 500, data: null };
    }

    try {
        // console.log("🔍 Mencari token akses di sessionStorage...");
        const accessToken = sessionStorage.getItem("access_token");

        if (!accessToken) {
            // console.log("❌ Token akses tidak ditemukan.");
            return { successCode: 401, data: null };
        }

        // console.log("✅ Token ditemukan, melanjutkan permintaan API...");
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        // console.log(`📡 Mengambil data dari API: ${APIEndpoints.TRENDPERSEBARANKADER}?desa_kelurahan=${desaKelurahan}`);
        const response = await axios.get<ApiResponsePersebaranKaderDusun>(
            `${APIEndpoints.TRENDPERSEBARANKADER}?desa_kelurahan=${desaKelurahan}`,
            config
        );

        // console.log("✅ Data berhasil diambil:", response.data);
        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data: response.data };

    } catch (err: any) {
        const { status, message } = handleError(err);
        // console.error("❌ Error fetching data:", message);
        return { successCode: status, data: null };
    }
};
