import axios from "axios";
import { APIEndpoints } from "@/app/config/route/apiEndpoints";
import { handleError } from "@/components/Handleerror/server/errorHandler";

// 📦 Tipe data untuk response API
export interface JawabanKuesionerResponse {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    target_type: string;
    target_id: string;
    tanggal_pengisian: string;
    status: string;
    kuisioner: {
        id: string;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        nama_kuisioner: string;
        deskripsi: string;
        kategori: string;
        is_active: boolean;
    };
    jawaban: {
        id: string;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        respon_id: string;
        pertanyaan_id: string;
        jawaban_value: string;
        pertanyaan: {
            id: string;
            pertanyaan_text: string;
            tipe_pertanyaan: string;
            pilihan_opsional: { id: number; text: string; score: number }[];
            urutan: number;
            is_required: boolean;
        };
    }[];
}

export interface FetchBySessionResult {
    successCode: number;
    data: JawabanKuesionerResponse[] | null;
}

export const JawabanKuesionerBySession = async (ibuHamilId: string): Promise<FetchBySessionResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken || !ibuHamilId) {
            console.warn('⚠️ Token atau ID ibu hamil tidak ditemukan');
            return { successCode: 401, data: null };
        }

        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        const url = `${APIEndpoints.DETAILKUESIONER}/${ibuHamilId}`;
        // console.log('📡 Fetch Jawaban Kuesioner:', url);

        const response = await axios.get<JawabanKuesionerResponse[]>(url, config);
        return { successCode: response.status, data: response.data };
    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error('❌ Error fetching jawaban kuisioner:', message);
        return { successCode: status, data: null };
    }
};
