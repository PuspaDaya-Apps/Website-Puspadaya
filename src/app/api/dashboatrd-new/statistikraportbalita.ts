

import axios from "axios";
import { APIEndpoints } from "@/app/config/route/apiEndpoints";
import { handleError } from "@/components/Handleerror/server/errorHandler";

import { RaporResponse } from '@/types/data-25/RaporResponse';

interface FetchResult {
    successCode: number;
    data: RaporResponse | null;
}

export const Statistikraportbalita = async (id: string): Promise<FetchResult> => {
    // ⛔ SSR guard – axios tidak boleh jalan di server
    if (typeof window === "undefined") {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem("access_token");

        // ⛔ Validasi awal
        if (!accessToken) {
            return { successCode: 401, data: null };
        }
        if (!id || id.trim() === "") {
            return { successCode: 400, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const url = `${APIEndpoints.RAPOIRTANAK}/${id}`;

        // ✅ axios dengan tipe generic
        const response = await axios.get<RaporResponse>(url, config);

        // ⛔ Jika API tidak mengirim `anak`, anggap 404
        if (!response.data || !response.data.anak) {
            return { successCode: 404, data: null };
        }

        // 🎉 SUCCESS
        return {
            successCode: response.status,
            data: response.data,
        };

    } catch (err: any) {
        const { status } = handleError(err);
        return { successCode: status, data: null };
    }
};
