import { APIEndpoints } from '@/app/route/apiEndpoints';
import { Messages } from '@/components/Handleerror/message/messages';
import { handleError } from '@/components/Handleerror/server/errorHandler';
import axios from 'axios';

let tokenUpdateInterval: NodeJS.Timeout | null = null;

export const getToken = async (username: string) => {
    const hash = sessionStorage.getItem('hash');

    if (!hash) {
        return;
    }

    try {
        const response = await axios.post(APIEndpoints.TOKEN_API, { username, hash });

        sessionStorage.setItem(Messages.TOKEN, response.data.token);

        const storedToken = sessionStorage.getItem(Messages.TOKEN);
        // console.log('Stored Token:', storedToken);

        return response.data.token;
    } catch (err: any) {
        const { message } = handleError(err);
        throw new Error(message);
    }
};

export const startTokenRefresh = (username: string) => {
    if (tokenUpdateInterval) {
        clearInterval(tokenUpdateInterval);
    }

    const fetchToken = async () => {
        try {
            await getToken(username);
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    fetchToken();

    // Set interval to fetch token
    tokenUpdateInterval = setInterval(() => {
        fetchToken();
    }, 10000);
};

export const stopTokenRefresh = () => {
    if (tokenUpdateInterval) {
        clearInterval(tokenUpdateInterval);
        tokenUpdateInterval = null;
    }
};
