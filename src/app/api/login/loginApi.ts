import axios from 'axios';
import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { useRouter } from 'next/navigation';

export const loginUser = async (username: string, password: string): Promise<string> => {
    if (!username || !password) {
        throw new Error(Messages.VALIDATION_ERROR);
    }

    try {
        const response = await axios.post(APIEndpoints.AUTHENTICATION, { username, password });

        if (response.status === 200) {
            const { data } = response.data;

            if (data?.access_token && data?.refresh_token) {
                // Simpan token dan data awal ke sessionStorage
                sessionStorage.setItem('access_token', data.access_token);
                sessionStorage.setItem('refresh_token', data.refresh_token);
                sessionStorage.setItem('user_role', data.role);
                sessionStorage.setItem('nama_lengkap', data.nama_lengkap);

                // 🔹 Panggil API CURRENT setelah login berhasil
                try {
                    const currentResponse = await axios.get(APIEndpoints.CURRENT, {
                        headers: {
                            Authorization: `Bearer ${data.access_token}`,
                        },
                    });

                    if (currentResponse.status === 200) {
                        const currentData = currentResponse.data?.data || currentResponse.data;

                        // Simpan hasil CURRENT ke localStorage
                        localStorage.setItem('current_user', JSON.stringify(currentData));

                        // Print hasil CURRENT ke console
                        // console.log('✅ CURRENT user data saved to localStorage:', currentData);
                    } else {
                        // console.warn('⚠️ Gagal memuat data CURRENT user.');
                    }
                } catch (currentError: any) {
                    // console.error('❌ Error fetching CURRENT user:', currentError.response?.data || currentError.message);
                }

                return data.access_token;
            } else {
                throw new Error(Messages.TOKEN_INVALID);
            }

        } else {
            throw new Error(Messages.BAD_REQUEST);
        }
    } catch (error: any) {
        console.error('Login Error:', error.response?.data || error.message);

        if (error.response?.data) {
            const errorData = error.response.data;

            if (error.response.status === 401) {
                throw new Error(` ${errorData.message}`);
            }

            const detailedErrors = errorData.errors
                ? Object.values(errorData.errors).flat().join(', ')
                : '';

            if (detailedErrors) {
                throw new Error(` ${detailedErrors}`);
            }

            throw new Error(` ${errorData.message}` || Messages.GENERIC_ERROR);
        }

        throw new Error(Messages.GENERIC_ERROR);
    }
};
