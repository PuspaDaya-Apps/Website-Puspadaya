import axios from "axios";
import { APIEndpoints } from "@/app/config/route/apiEndpoints";
import { handleError } from "@/components/Handleerror/server/errorHandler";

// 📦 Tipe data untuk response API
export interface SkorKuesionerResponse {
    total_score: number;  // Menampilkan total_score
}

export interface FetchBySessionResult {
    successCode: number;
    data: { total_score: number | null } | null; // Menghapus jawaban_id jika tidak dibutuhkan
}

export const Skorkuesioner = async (id: string): Promise<FetchBySessionResult> => {
    if (typeof window === 'undefined') {
        console.log("Server-side rendering detected, returning empty response.");
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken || !id) {
            console.warn('⚠️ Token atau ID tidak ditemukan');
            return { successCode: 401, data: null };
        }

        console.log(`Fetching data for ID: ${id}`);

        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        const url = `${APIEndpoints.POINTSKUESIONER}/${id}/score`; // Ganti ibuHamilId menjadi id
        console.log(`Request URL: ${url}`);

        const response = await axios.get<SkorKuesionerResponse>(url, config);

        console.log("API Response:", response);

        // Mengembalikan total_score dari response
        if (response.data && response.data.total_score) {
            console.log(`Total Score: ${response.data.total_score}`);
            return { successCode: response.status, data: { total_score: response.data.total_score } };
        } else {
            console.warn('⚠️ No total_score found in the response.');
            return { successCode: 404, data: null };
        }

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error('❌ Error fetching jawaban kuisioner:', message);
        return { successCode: status, data: null };
    }
};
