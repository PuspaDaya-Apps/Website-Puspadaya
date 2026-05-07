"use client";

import React from "react";

const TableRekapBalita = () => {
  return (
    <div className="container mx-auto">
      <div className="card overflow-hidden rounded-lg bg-white p-4 shadow-md">
        <div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
          <div className="md:mb-0">
            <h2 className="pb-1 text-2xl font-bold text-black">
              Rekapitulasi Data Pengukuran Balita
            </h2>
            <p className="text-sm font-light text-gray-5">
              Data belum tersedia dari API.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-6 text-red-700">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
              !
            </div>
            <div>
              <p className="font-semibold">Data rekap balita tidak tersedia</p>
              <p className="mt-1 text-sm">
                API tidak mengembalikan data atau sedang mengalami gangguan. Tidak ada data dummy yang digunakan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableRekapBalita;
