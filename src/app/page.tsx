"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TokenManager } from "@/app/api/utils/TokenManager";

// Dynamically import layout and dashboard with SSR disabled (uses ApexCharts and Leaflet)
const DefaultLayout = dynamic(() => import("@/components/Layouts/DefaultLaout"), { ssr: false, loading: () => <p>Loading...</p> });
const Dashboard = dynamic(() => import("@/components/Dashboard/Dashboard"), { ssr: false, loading: () => <p>Loading...</p> });

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Cek token menggunakan TokenManager (bukan localStorage langsung)
    const token = TokenManager.getToken();
    const accessToken = TokenManager.getAccessToken();

    if (!token || !accessToken) {
      // Jika tidak ada token, redirect ke login
      router.replace('/auth/signin');
      return;
    }

    setIsAuthorized(true);
    setCheckComplete(true);
  }, [router]);

  // Tampilkan null saat mengecek token
  if (!checkComplete || !isAuthorized) {
    return null;
  }

  return (
    <>
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </>
  );
}