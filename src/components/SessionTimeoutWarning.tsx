"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TokenManager } from '@/app/api/utils/TokenManager';
import { logoutUser, redirectAfterLogout } from '@/app/api/login/loginApi';
import { refreshToken } from '@/app/api/token/refreshToken';

/**
 * Session Timeout Warning Component
 * Shows warning modal before session expires
 */
// Di level modul: nilainya tetap, jadi tidak perlu ikut jadi dependensi efek.
const WARNING_THRESHOLD = 2 * 60 * 1000; // tampilkan peringatan 2 menit sebelum habis

export default function SessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const sedangMemperbarui = useRef(false);

  const handleSessionExpired = useCallback(() => {
    setShowWarning(false);
    TokenManager.clearToken();
    localStorage.removeItem('current_user');
    
    // Show message and redirect
    alert('Sesi Anda telah berakhir. Silakan login kembali.');
    redirectAfterLogout();
  }, []);

  // Sebelumnya fungsi ini tidak pernah menghubungi backend -- hanya memajukan
  // expiresAt satu jam di sisi klien, sehingga "sesi diperpanjang" padahal
  // token yang dipakai tetap token lama yang sudah ditolak server.
  const handleRefreshToken = useCallback(async () => {
    // Interval berjalan tiap 10 detik; tanpa penjaga ini satu refresh yang
    // lambat bisa memicu beberapa permintaan sekaligus.
    if (sedangMemperbarui.current) {
      return;
    }

    sedangMemperbarui.current = true;

    try {
      const tokenData = TokenManager.getToken();

      if (!tokenData?.refreshToken) {
        throw new Error('Tidak ada refresh token');
      }

      const accessTokenBaru = await refreshToken(tokenData.refreshToken);

      if (!accessTokenBaru) {
        throw new Error('Refresh token ditolak server');
      }

      TokenManager.saveToken({
        ...tokenData,
        accessToken: accessTokenBaru,
        expiresAt: Date.now() + 60 * 60 * 1000,
      });

      setShowWarning(false);
    } catch (error) {
      console.error('Gagal memperbarui sesi:', error);
      handleSessionExpired();
    } finally {
      sedangMemperbarui.current = false;
    }
  }, [handleSessionExpired]);

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
        // Lewat batas lokal bukan berarti sesinya benar-benar habis: tukar
        // dulu lewat refresh token. handleRefreshToken yang memanggil
        // handleSessionExpired kalau server memang menolak.
        void handleRefreshToken();
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
  }, [handleRefreshToken, handleSessionExpired]);

  // Hitung mundur berjalan selama peringatan tampil.
  //
  // Syarat `timeRemaining <= COUNTDOWN_START` yang dulu ada di sini terbalik
  // dari namanya sendiri: ia justru menghentikan hitung mundur di menit
  // terakhir. Selama ini tidak terasa karena efeknya hanya dievaluasi sekali
  // saat peringatan muncul (sisa masih ~2 menit, jadi selalu lolos).
  useEffect(() => {
    if (!showWarning) return;

    const countdownInterval = setInterval(() => {
      const remaining = TokenManager.getTimeUntilExpiry();
      if (remaining === null || remaining <= 0) {
        handleSessionExpired();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showWarning, handleSessionExpired]);

  const handleStayLoggedIn = () => {
    handleRefreshToken();
  };

  const handleLogout = () => {
    setShowWarning(false);
    logoutUser();
    redirectAfterLogout();
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
