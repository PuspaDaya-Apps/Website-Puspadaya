"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    // Jika tidak ada token, arahkan ke halaman login
    if (!token) {
      router.push("/auth/signin");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header and Sidebar fixed at the top */}
      <div className="fixed left-0 right-0 top-0 z-50">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main content below the fixed header and sidebar */}
      <div className="flex-1 overflow-y-auto pt-[70px]">
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
