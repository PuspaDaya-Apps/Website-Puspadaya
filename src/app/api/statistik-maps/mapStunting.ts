import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { MapPersebaranResponse } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: MapPersebaranResponse | null;
}

export const mapStunting = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem("access_token");
        if (!accessToken) {
            console.warn("Token tidak tersedia di sessionStorage");
            return { successCode: 401, data: null };
        }

        const endpoint = APIEndpoints.MAPANAKSTUNTING;
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        const response = await axios.get(endpoint, config);

        // Debug output
        // console.log("Raw API response:", response.data);

        const responseData: MapPersebaranResponse = response.data;

        sessionStorage.removeItem(Messages.ERROR);
        return { successCode: response.status, data: responseData };

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error fetching data:", message);
        return { successCode: status, data: null };
    }
};
