"use client";
import { currentUser } from "@/app/api/user/currentUser";
import React, { useEffect, useState } from "react";


interface PageHeaderProps { }

const PageHeader: React.FC<PageHeaderProps> = () => {
  const [title, setTitle] = useState("Dashboard");
  const [periode, setPeriode] = useState("");
  const [posyanduNama, setPosyanduNama] = useState("");
  const [posyanduAlamat, setPosyanduAlamat] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const bulan = now.toLocaleString("id-ID", { month: "long" });
        const tahun = now.getFullYear();
        setPeriode(`${bulan} ${tahun}`);

        const res = await currentUser();
        if (res.successCode === 200 && res.data) {
          const user = res.data as any; // tipe bisa disesuaikan

          const posyandu = user.posyandu?.nama_posyandu || "-";
          setPosyanduNama(posyandu);

          const alamat = `${user.dusun?.nama_dusun || "-"}, ${user.kecamatan?.nama_kecamatan || "-"}, ${user.kabupaten_kota?.nama_kabupaten_kota || "-"}`;
          setPosyanduAlamat(alamat);
        }
      } catch (error) {
        console.error("Gagal mengambil data header:", error);
      }
    };

    fetchData();
  }, []);


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
