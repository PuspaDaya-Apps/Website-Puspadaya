import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import { DesakelurahanClass } from '@/types/dashborad';
import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: DesakelurahanClass[] | null;
}

export const Desakelurahanwilayahaktivitas = async (): Promise<FetchResult> => {
    try {
        const accessToken = sessionStorage.getItem("access_token");

        if (!accessToken) {
            return { successCode: 401, data: null };
        }

        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        const response = await axios.get(APIEndpoints.DESAKELURAHAN, config);

        const { data } = response.data;
        // console.log ("Ini adalah datanya", data);
        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: response.status, data };

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error fetching data:", message);
        return { successCode: status ?? 500, data: null };
    }
};
