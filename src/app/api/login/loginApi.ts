import axios from 'axios';
import { APIEndpoints } from '@/app/route/apiEndpoints';
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
            // console.log("ini datanya", data);


            if (data?.access_token && data?.refresh_token) {
                sessionStorage.setItem('access_token', data.access_token);
                sessionStorage.setItem('refresh_token', data.refresh_token);
                sessionStorage.setItem('user_role', data.role);
                sessionStorage.setItem('nama_lengkap', data.nama_lengkap);

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
    
            // Jika error 401 (Unauthorized)
            if (error.response.status === 401) {
                throw new Error(` ${errorData.message}`);
            }
    
            // Jika error validasi (Validation Error)
            const detailedErrors = errorData.errors
                ? Object.values(errorData.errors).flat().join(', ')
                : '';
    
            if (detailedErrors) {
                throw new Error(` ${detailedErrors}`);
            }
    
            // Jika hanya ada pesan error umum
            throw new Error(` ${errorData.message}` || Messages.GENERIC_ERROR);
        }
    
        throw new Error(Messages.GENERIC_ERROR);
    }
    
        
};
