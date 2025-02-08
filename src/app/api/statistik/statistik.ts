import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { StatistikClass } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: StatistikClass | null; // Mengubah menjadi objek, bukan array
}

export const statistikDashboard = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem("access_token");

        // console.log("Access Token:", accessToken);
        // console.log("API Endpoint:", APIEndpoints.DASHBOARD);

        if (!accessToken) {
            return { successCode: 401, data: null };
        }

        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        const response = await axios.get(APIEndpoints.DASHBOARD, config);
        // console.log("API Response:", response.data);

        const { data } = response.data;
        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error fetching data:", message);
        return { successCode: status, data: null };
    }
};

