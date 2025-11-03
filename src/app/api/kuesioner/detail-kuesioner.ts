import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import axios from 'axios';

// Tipe response sesuai dengan contoh kamu
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

interface FetchBySessionResult {
    successCode: number;
    data: JawabanKuesionerResponse[] | null;
}

// ✅ Fungsi utama
export const JawabanKuesionerBySession = async (): Promise<FetchBySessionResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        const ibuHamilId = sessionStorage.getItem('ibu_hamil_id_jawaban');

        if (!accessToken || !ibuHamilId) {
            console.warn('⚠️ Token atau ID ibu hamil tidak ditemukan di sessionStorage');
            return { successCode: 401, data: null };
        }

        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        // Endpoint kamu kemungkinan seperti ini:
        const url = `${APIEndpoints.DETAILKUESIONER}/${ibuHamilId}`;
        console.log('📡 Fetch Jawaban Kuesioner by session:', url);

        const response = await axios.get<JawabanKuesionerResponse[]>(url, config);
        console.log('✅ Response API:', response.data);

        return { successCode: response.status, data: response.data };
    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error('❌ Error fetching jawaban kuisioner:', message);
        return { successCode: status, data: null };
    }
};
