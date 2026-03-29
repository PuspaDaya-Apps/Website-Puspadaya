"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Cek token dengan cepat
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Jika tidak ada token, redirect ke login
      router.replace('/auth/signin');
      return;
    }
    
    setIsAuthorized(true);
  }, [router]);

  // Tampilkan null saat mengecek token
  if (!isAuthorized) {
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