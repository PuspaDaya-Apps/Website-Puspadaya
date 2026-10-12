"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SeniorModeProvider } from "@/contexts/SeniorModeContext";
import SessionTimeoutWarning from "@/components/SessionTimeoutWarning";
import { initializeApp } from "@/app/api/utils/initializeApp";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    // Initialize app (axios interceptors, token management).
    // Sinkron, jadi interceptor sudah terpasang sebelum children di-render.
    initializeApp();
    setAppInitialized(true);

    // Loader hanya menutupi inisialisasi di atas; tidak ada lagi jeda buatan
    // 1 detik yang sebelumnya ikut menahan dashboard setiap kali halaman dibuka.
    setLoading(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SeniorModeProvider>
        <html lang="en">
          <head>
            <script
              dangerouslySetInnerHTML={{
                __html: `
              const style = document.createElement('style')
              style.innerHTML = '@layer tailwind-base, primereact, tailwind-utilities;'
              style.setAttribute('type', 'text/css')
              document.querySelector('head').prepend(style)
            `,
              }}
            />
          </head>
          <body suppressHydrationWarning={true}>
            {loading ? <Loader /> : (
              <>
                {appInitialized && <SessionTimeoutWarning />}
                {children}
              </>
            )}
          </body>
        </html>
      </SeniorModeProvider>
    </QueryClientProvider>
  );
}
