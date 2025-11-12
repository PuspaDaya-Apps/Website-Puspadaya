import axios from "axios";
import { APIEndpoints } from "@/app/config/route/apiEndpoints";
import { handleError } from "@/components/Handleerror/server/errorHandler";
import { AnakResponse } from "@/types/data-25/DataBalita";

interface FetchResult {
    successCode: number;
    data: AnakResponse | null; // Menggunakan AnakResponse sebagai tipe data
}

export const Statistikraportbalita = async (id: string): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken || !id) {
            return { successCode: 401, data: null };
        }

        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        const url = `${APIEndpoints.RAPOIRTANAK}/${id}`;

        const response = await axios.get<AnakResponse>(url, config);

        if (response.data) {
            return { successCode: response.status, data: response.data };
        } else {
            return { successCode: 404, data: null };
        }

    } catch (err: any) {
        const { status, message } = handleError(err);
        return { successCode: status, data: null };
    }
};
