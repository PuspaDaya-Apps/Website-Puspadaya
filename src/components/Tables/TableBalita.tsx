"use client";

import React from "react";

const TableBalita = () => {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
        <div className="md:mb-0">
          <h2 className="pb-1 text-2xl font-bold text-black">Data Balita</h2>
          <p className="text-sm font-normal text-gray-500">Data belum tersedia dari API.</p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-6 text-red-700">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
            !
          </div>
          <div>
            <p className="font-semibold">Data balita tidak tersedia</p>
            <p className="mt-1 text-sm">
              API tidak mengembalikan data atau sedang mengalami gangguan. Tidak ada data dummy yang digunakan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableBalita;
