import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { StatistikClass } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: StatistikClass | null;
}

export const statistikDashboard = async (): Promise<FetchResult> => {
    if (typeof window === 'undefined') {
        return { successCode: 500, data: null };
    }

    try {
        const accessToken = sessionStorage.getItem("access_token");
        const userRole = sessionStorage.getItem("user_role"); // Ambil role dari sessionStorage

        if (!accessToken || !userRole) {
            return { successCode: 401, data: null };
        }

        // Pilih endpoint berdasarkan role
        let endpoint = APIEndpoints.DASHBOARD; // Default untuk Admin
        switch (userRole) {
            case 'Dinas Sosial':
                endpoint = APIEndpoints.DASHBOARDDINASSOSIAL;
                break;
            case 'Kepala Desa':
                endpoint = APIEndpoints.DASHBOARDKEPALADESA;
                break;
            case 'Ketua Kader':
                endpoint = APIEndpoints.DASHBOARDPOSYANDU;
                break;
            case 'Kader':
                    endpoint = APIEndpoints.DASHBOARDPOSYANDU;
                    break;
            case 'Dinas Kesehatan':
                endpoint = APIEndpoints.DASHBOARDDINASKESEHATAN;
                break;
            case 'TPG':
                endpoint = APIEndpoints.DASHBOARDTPG;
                break;
            default:
                endpoint = APIEndpoints.DASHBOARD; // Default Admin
        }

        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        const response = await axios.get(endpoint, config);

        const { data } = response.data;
        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error fetching data:", message);
        return { successCode: status, data: null };
    }
};
