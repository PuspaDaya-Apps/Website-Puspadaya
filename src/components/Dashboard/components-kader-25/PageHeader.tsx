"use client";
import { useCurrentUser } from "@/hooks/dashboard";
import React from "react";


interface PageHeaderProps { }

const PageHeader: React.FC<PageHeaderProps> = () => {
  const title = "Dashboard";
  const { data } = useCurrentUser();

  const now = new Date();
  const periode = `${now.toLocaleString("id-ID", { month: "long" })} ${now.getFullYear()}`;

  const user = data as any; // tipe bisa disesuaikan
  const posyanduNama = user ? user.posyandu?.nama_posyandu || "-" : "";
  const posyanduAlamat = user
    ? `${user.dusun?.nama_dusun || "-"}, ${user.kecamatan?.nama_kecamatan || "-"}, ${user.kabupaten_kota?.nama_kabupaten_kota || "-"}`
    : "";


  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <h1 className="text-xl font-bold text-dark dark:text-white md:text-2xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Periode: {periode} | Posyandu: {posyanduNama} - {posyanduAlamat}
      </p>
    </div>
  );
};

export default PageHeader;
