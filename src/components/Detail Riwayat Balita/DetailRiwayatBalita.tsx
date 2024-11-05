"use client";
import TableRiwayatBalita from "@/components/Tables/TableRiwayatBalita";

import React from "react";
import StatusStuntingBalita from "./StatusStantingBalita";
import DataDiriKeluarga from "./DataDiriKeluarga";
import GrafikTumbuhKembangBalita from "../Charts/GrafikTumbuhKembangBalita";


const DetailRiwayatBalita = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      {/* Data Diri Keluarga */}
      <DataDiriKeluarga />

      {/* Status Stunting dan Gizi Balita */}
      <StatusStuntingBalita />

      {/* Grafik */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-black">Grafik Tumbuh Kembang Balita</h2>
        <p className="text-sm font-light text-gray-500">
          Birth to 6 months (z-scores)
        </p>
        <div style={{ width: "80%", margin: "0 auto", paddingTop: "10px" }}>
          <GrafikTumbuhKembangBalita />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-black">Riwayat Pengukuran Balita</h2>
      </div>

      {/* Tabel Riwayat Balita */}
      <TableRiwayatBalita />
      <div className="mt-5">
        <h4><b>Keterangan :</b></h4>
        <p className="text-sm font-light text-gray-500">
          BB : Berat Badan <br />
          TB : Tinggi Badan <br />
          Lila : Lingkar Lengan Atas <br />
          LP : Lingkar Kepala
        </p>
      </div>
    </div>
  );
};

export default DetailRiwayatBalita;
