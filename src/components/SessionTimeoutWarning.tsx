"use client";

import React, { useEffect, useState } from 'react';
import { TokenManager } from '@/app/api/utils/TokenManager';
import { logoutUser } from '@/app/api/login/loginApi';
import { useRouter } from 'next/navigation';

/**
 * Session Timeout Warning Component
 * Shows warning modal before session expires
 */
export default function SessionTimeoutWarning() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isListening, setIsListening] = useState(false);

  // Warning threshold (show warning 2 minutes before expiry)
  const WARNING_THRESHOLD = 2 * 60 * 1000; // 2 minutes
  const COUNTDOWN_START = 1 * 60 * 1000; // Start countdown at 1 minute

  useEffect(() => {
    // Check if user is logged in
    const token = TokenManager.getToken();
    if (!token) {
      setIsListening(false);
      return;
    }

    setIsListening(true);

    // Check session every 10 seconds
    const checkInterval = setInterval(() => {
      const timeUntilExpiry = TokenManager.getTimeUntilExpiry();

      if (timeUntilExpiry === null) {
        setShowWarning(false);
        return;
      }

      // Show warning if close to expiry
      if (timeUntilExpiry <= WARNING_THRESHOLD && timeUntilExpiry > 0) {
        setShowWarning(true);
        setTimeRemaining(timeUntilExpiry);
      } else if (timeUntilExpiry <= 0) {
        // Session expired
        handleSessionExpired();
      } else {
        setShowWarning(false);
      }
    }, 10000);

    // Listen for token events
    const handleTokenExpired = () => {
      handleSessionExpired();
    };

    const handleTokenRefreshNeeded = async () => {
      // Auto refresh token
      await handleRefreshToken();
    };

    window.addEventListener('token:expired', handleTokenExpired);
    window.addEventListener('token:refreshNeeded', handleTokenRefreshNeeded);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('token:expired', handleTokenExpired);
      window.removeEventListener('token:refreshNeeded', handleTokenRefreshNeeded);
    };
  }, []);

  // Update countdown every second when warning is shown
  useEffect(() => {
    if (!showWarning || timeRemaining <= COUNTDOWN_START) return;

    const countdownInterval = setInterval(() => {
      const remaining = TokenManager.getTimeUntilExpiry();
      if (remaining === null || remaining <= 0) {
        handleSessionExpired();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showWarning]);

  const handleRefreshToken = async () => {
    try {
      // console.log('🔄 Refreshing token...');
      
      // Get current token
      const tokenData = TokenManager.getToken();
      if (!tokenData) {
        throw new Error('No token to refresh');
      }

      // Call refresh token API (implement based on your backend)
      // For now, we'll just extend the expiry
      const newExpiresAt = Date.now() + (60 * 60 * 1000); // Extend 1 hour
      
      TokenManager.saveToken({
        ...tokenData,
        expiresAt: newExpiresAt,
      });

      setShowWarning(false);
      // console.log('✅ Token refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh token:', error);
      handleSessionExpired();
    }
  };

  const handleSessionExpired = () => {
    setShowWarning(false);
    TokenManager.clearToken();
    localStorage.removeItem('current_user');
    
    // Show message and redirect
    alert('Sesi Anda telah berakhir. Silakan login kembali.');
    router.push('/auth/signin');
  };

  const handleStayLoggedIn = () => {
    handleRefreshToken();
  };

  const handleLogout = () => {
    setShowWarning(false);
    logoutUser();
    router.push('/auth/signin');
  };

  if (!showWarning || !isListening) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-6 w-6 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Sesi Akan Berakhir
          </h3>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Sesi login Anda akan berakhir dalam{' '}
          <span className="font-bold text-amber-600">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          . Pilih tindakan Anda:
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleStayLoggedIn}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Tetap Login
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-500 text-center">
          Sesi akan otomatis berakhir jika tidak ada aktivitas
        </p>
      </div>
    </div>
  );
}
