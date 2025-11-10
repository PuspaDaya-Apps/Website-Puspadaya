// Utility functions for session storage management
// This file contains helper functions to manage session storage with TTL (Time To Live)

interface SessionStorageData {
    data: any;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

/**
 * Saves data to session storage with a TTL
 * @param key The storage key
 * @param data The data to store
 * @param ttl Time to live in minutes (default: 30 minutes)
 */
export const setSessionStorageWithTTL = (key: string, data: any, ttl: number = 30): void => {
    const now = new Date();
    const item: SessionStorageData = {
        data: JSON.stringify(data),
        timestamp: now.getTime(),
        ttl: ttl * 60 * 1000, // Convert minutes to milliseconds
    };
    sessionStorage.setItem(key, JSON.stringify(item));
};

/**
 * Gets data from session storage if not expired
 * @param key The storage key
 * @returns The data if valid and not expired, otherwise null
 */
export const getSessionStorageWithTTL = (key: string): any | null => {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) {
        return null;
    }

    try {
        const item: SessionStorageData = JSON.parse(itemStr);
        const now = new Date();

        // Check if item has expired
        if (now.getTime() > item.timestamp + item.ttl) {
            sessionStorage.removeItem(key);
            return null;
        }

        return JSON.parse(item.data);
    } catch (error) {
        console.error('Error parsing session storage item:', error);
        sessionStorage.removeItem(key);
        return null;
    }
};

/**
 * Removes data from session storage
 * @param key The storage key
 */
export const removeSessionStorageItem = (key: string): void => {
    sessionStorage.removeItem(key);
};