/**
 * Refresh Token API
 * Handles token refresh when access token expires
 */

import axios from 'axios';
import { APIEndpoints } from '@/app/config/route/apiEndpoints';
import { retryAxiosRequest } from '../utils/retry';

/**
 * Refresh access token using refresh token
 * 
 * @param refreshToken - The refresh token
 * @returns New access token or null if refresh fails
 */
export const refreshToken = async (refreshToken: string): Promise<string | null> => {
    if (!refreshToken) {
        return null;
    }

    try {
        // Use retry logic for token refresh
        const response = await retryAxiosRequest(() =>
            axios.post(APIEndpoints.REFRESH_TOKEN || APIEndpoints.AUTHENTICATION, {
                refresh_token: refreshToken,
            }),
            { maxRetries: 2, initialDelay: 500 }
        );

        if (response.status === 200) {
            const { data } = response.data;
            return data.access_token || null;
        }

        return null;
    } catch (error: any) {
        return null;
    }
};
