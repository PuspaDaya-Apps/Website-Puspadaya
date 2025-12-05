import axios from "axios";
import { APIEndpoints } from "@/app/config/route/apiEndpoints";
import { handleError } from "@/components/Handleerror/server/errorHandler";

import { RaporResponse } from '@/types/data-25/RaporResponse';

interface FetchResult {
    successCode: number;
    data: RaporResponse | null;
}

// Debug helper
const DEBUG_MODE = false;
const debugLog = (...args: any[]) => {
    if (DEBUG_MODE) console.log(...args);
};

export const Statistikraportbalita = async (id: string): Promise<FetchResult> => {

    // SSR guard
    if (typeof window === "undefined") {
        debugLog("SSR mode – request diblokir.");
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem("access_token");

        if (!accessToken) {
            debugLog("Tidak ada access token.");
            return { successCode: 401, data: null };
        }

        if (!id || id.trim() === "") {
            debugLog("ID anak kosong.");
            return { successCode: 400, data: null };
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const url = `${APIEndpoints.RAPOIRTANAK}/${id}`;
        debugLog("Request URL:", url);

        const response = await axios.get<RaporResponse>(url, config);

        // Cek apakah response valid
        if (!response.data || !response.data.anak) {
            debugLog("Data anak tidak ditemukan pada response.");
            return { successCode: 404, data: null };
        }

        debugLog("Berhasil mengambil data rapor:", response.data);

        return {
            successCode: response.status,
            data: response.data,
        };

    } catch (err: any) {
        const { status, message } = handleError(err);
        debugLog("Error API:", message);

        return { successCode: status, data: null };
    }
};
