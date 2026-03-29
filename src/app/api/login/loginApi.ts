import axios from 'axios';
import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { TokenManager } from '../utils/TokenManager';
import { retryAxiosRequest } from '../utils/retry';

export const loginUser = async (username: string, password: string): Promise<string> => {
    if (!username || !password) {
        throw new Error(Messages.VALIDATION_ERROR);
    }

    try {
        // Use retry logic for login request
        const response = await retryAxiosRequest(() => 
            axios.post(APIEndpoints.AUTHENTICATION, { username, password }),
            { maxRetries: 2, initialDelay: 500 }
        );

        if (response.status === 200) {
            const { data } = response.data;

            if (data?.access_token && data?.refresh_token) {
                // Calculate token expiry (assume 1 hour if not provided)
                const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour from now

                // Handle role - check both data.role and data.user?.role
                const userRole = data?.role || data?.user?.role || 'Kader';
                const namaLengkap = data?.nama_lengkap || data?.user?.nama_lengkap || data?.nama || 'User';

                // Save token using TokenManager (syncs to all storage)
                TokenManager.saveToken({
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresAt: expiresAt,
                    role: userRole,
                    namaLengkap: namaLengkap,
                });

                // 🔹 Panggil API CURRENT setelah login berhasil dengan retry
                try {
                    const currentResponse = await retryAxiosRequest(() => 
                        axios.get(APIEndpoints.CURRENT, {
                            headers: {
                                Authorization: `Bearer ${data.access_token}`,
                            },
                        }),
                        { maxRetries: 3, initialDelay: 1000 }
                    );

                    if (currentResponse.status === 200) {
                        const currentData = currentResponse.data?.data || currentResponse.data;

                        // Simpan hasil CURRENT ke localStorage
                        localStorage.setItem('current_user', JSON.stringify(currentData));
                    }
                } catch (currentError: any) {
                    // Don't fail login if CURRENT fails - user can still access with valid token
                }

                return data.access_token;
            } else {
                throw new Error(Messages.TOKEN_INVALID);
            }

        } else {
            throw new Error(Messages.BAD_REQUEST);
        }
    } catch (error: any) {
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

// Fungsi untuk logout
export const logoutUser = (): void => {
    // Clear token from all storage (cookies, localStorage, sessionStorage)
    TokenManager.clearToken();
    
    // Clear user data
    localStorage.removeItem('current_user');
    
    // Dispatch logout event for any listeners
    window.dispatchEvent(new CustomEvent('auth:logout'));
};
