import { KecamatanClass } from '@/types/dashborad';
import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';

import axios from 'axios';

interface FetchResult {
    successCode: number;
    data: KecamatanClass[] | null;
}

export const Kecamatanwilayah = async (): Promise<FetchResult> => {
    try {
        const accessToken = sessionStorage.getItem("access_token");

        if (!accessToken) {
            return { successCode: 401, data: null };
        }

        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        let allData: KecamatanClass[] = [];
        const totalPages = 5; // Total halaman yang ingin diambil (1-5)

        // Loop untuk ambil semua halaman dari 1 hingga 5
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const response = await axios.get(`${APIEndpoints.KECAMATAN}?page=${currentPage}`, config);
            const { data } = response.data;

            allData = [...allData, ...data]; // Gabung semua data
            // console.log(`Data dari halaman ${currentPage} berhasil diambil.`); // Debugging
        }

        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: 200, data: allData };

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error fetching data:", message);
        return { successCode: status ?? 500, data: null };
    }
};