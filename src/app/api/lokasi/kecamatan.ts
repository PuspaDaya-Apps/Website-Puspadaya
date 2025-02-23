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
        let currentPage = 3;
        let totalPages = 5;

        // Loop untuk ambil semua halaman
        do {
            const response = await axios.get(`${APIEndpoints.KECAMATAN}?page=${currentPage}`, config);
            const { data, total_pages } = response.data; 

            allData = [...allData, ...data]; // Gabung semua data
            totalPages = total_pages; // Update total halaman dari API
            currentPage++; // Pindah ke halaman berikutnya
        } while (currentPage <= totalPages); // Loop sampai semua halaman diambil

        sessionStorage.removeItem(Messages.ERROR);

        return { successCode: 200, data: allData };

    } catch (err: any) {
        const { status, message } = handleError(err);
        console.error("Error fetching data:", message);
        return { successCode: status ?? 500, data: null };
    }
};
