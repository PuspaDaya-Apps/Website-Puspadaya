"use client";
import React from "react";
import CardDetail from "../ui/CardDetail";

const StatusStuntingBalita = () => {
  return (
    <div className="mt-8">
      <h3 className="pb-4 text-xl font-bold text-black">
        Status Stunting dan Gizi Balita
      </h3>
      <div className="grid grid-cols-3 gap-6">
        {/* Kolom Pertama */}
        <div>
          <div className="mb-4">
            <CardDetail label="Tanggal Indikasi Stunting">
              17 Mei 2013
            </CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Berat Badan Saat Ini">12</CardDetail>
          </div>
        </div>
        {/* Kolom Kedua */}
        <div>
          <div className="mb-4">
            <CardDetail label="Tanggal Kelulusan Stunting">
              17 Mei 2015
            </CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Tinggi Badan Saat Ini">20</CardDetail>
          </div>
        </div>

        {/* Kolom Ketiga */}
        <div>
          <div className="mb-4">
            <CardDetail
              label="Status Kelulusan"
              className="w-full rounded-md bg-green-500 p-2 text-center font-bold text-white"
            >
              LULUS KARENA USIA
            </CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail
              label="Status Gizi"
              className="w-full rounded-md bg-green-500 p-2 text-center font-bold text-white"
            >
              GIZI BAIK
            </CardDetail>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusStuntingBalita;
