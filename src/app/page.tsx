"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { TokenManager } from "@/app/api/utils/TokenManager";

// Dynamically import layout and dashboard with SSR disabled (uses ApexCharts and Leaflet)
const DefaultLayout = dynamic(() => import("@/components/Layouts/DefaultLaout"), { ssr: false, loading: () => <Loader /> });
const Dashboard = dynamic(() => import("@/components/Dashboard/Dashboard"), { ssr: false, loading: () => <Loader /> });

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Cek token menggunakan TokenManager (bukan localStorage langsung).
    // Catatan: TokenManager.getAccessToken() itu async -- memakainya langsung
    // di kondisi if berarti mengecek sebuah Promise (selalu truthy), sehingga
    // token kedaluwarsa pun ikut lolos. Dicek lewat isExpired() supaya nyata.
    const token = TokenManager.getToken();

    if (!token || TokenManager.isExpired()) {
      // Jika tidak ada token / sudah kedaluwarsa, redirect ke login
      router.replace('/auth/signin');
      return;
    }

    setIsAuthorized(true);
    setCheckComplete(true);
  }, [router]);

  // Tampilkan loader (bukan layar kosong) saat mengecek token
  if (!checkComplete || !isAuthorized) {
    return <Loader />;
  }

  return (
    <>
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </>
  );
}
