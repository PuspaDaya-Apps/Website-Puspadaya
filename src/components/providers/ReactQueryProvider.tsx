"use client";
import React, { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  clearPersistedQueryCache,
  restoreQueryCache,
  startPersistingQueryCache,
} from "@/lib/react-query/persist";
import { getQueryClient } from "@/lib/react-query/queryClient";

export default function ReactQueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => {
    const client = getQueryClient();
    // Dipulihkan sebelum children render, supaya data hasil prefetch saat login
    // sudah tersedia pada render pertama dan tidak ada loading yang berkedip.
    restoreQueryCache(client);
    return client;
  });

  useEffect(() => {
    const stopPersisting = startPersistingQueryCache(queryClient);

    // Semua jalur logout (tombol logout, timeout sesi, dan 401 dari axios
    // interceptor) memancarkan event ini, jadi satu listener sudah menutup
    // semuanya tanpa perlu menyentuh tiap pemanggil.
    const handleLogout = () => {
      queryClient.clear();
      clearPersistedQueryCache();
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
      stopPersisting();
    };
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
