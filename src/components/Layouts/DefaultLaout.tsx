"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

// Nilai awal, sekadar supaya render pertama tidak melompat. Tinggi
// sesungguhnya diukur setelah mount.
const TINGGI_HEADER_AWAL = 70;

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [tinggiHeader, setTinggiHeader] = useState(TINGGI_HEADER_AWAL);
  const router = useRouter();

  // Header dipasang fixed, jadi konten di bawahnya butuh padding setinggi
  // header. Angka tetap 70px tidak pernah cocok: di desktop logonya 55px plus
  // judul dua baris dan py-2, totalnya lebih dari 70px, sehingga kartu pertama
  // tiap halaman menyelip di bawah header. Diukur saja, supaya ikut berubah
  // mengikuti breakpoint dan isi header.
  useEffect(() => {
    const el = headerRef.current;

    if (!el || typeof ResizeObserver === "undefined") {
      return;
    }

    const ukur = () => setTinggiHeader(el.getBoundingClientRect().height);
    ukur();

    const observer = new ResizeObserver(ukur);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

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
        {/* Hanya header yang diukur. Sidebar ikut di pembungkus fixed yang
            sama tapi tingginya tidak boleh ikut terhitung. */}
        <div ref={headerRef}>
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main content below the fixed header and sidebar */}
      <div className="flex-1 overflow-y-auto" style={{ paddingTop: tinggiHeader }}>
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
