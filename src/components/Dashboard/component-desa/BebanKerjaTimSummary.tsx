"use client";
import React from "react";
import { BebanKerjaTimSummary } from "@/types/dashboard-kepala-desa";

interface BebanKerjaTimSummaryProps {
  bebanKerjaTim: BebanKerjaTimSummary;
}

const BebanKerjaTimSummary: React.FC<BebanKerjaTimSummaryProps> = ({ bebanKerjaTim }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Skor Beban Kerja Tim Kader
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ringkasan beban kerja semua kader di wilayah Anda
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-900/20">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {bebanKerjaTim.total_kader}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Kader</p>
        </div>
        <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {bebanKerjaTim.skor_beban_tertinggi}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Skor Tertinggi</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {bebanKerjaTim.skor_beban_terendah}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Skor Terendah</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Distribusi Beban Kerja Kader
        </h3>
        <div className="flex items-center gap-8">
          {/* Donut Chart */}
          <div className="relative h-40 w-40 flex-shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
                className="dark:stroke-gray-700"
              />
              {/* Tinggi segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${(bebanKerjaTim.kader_beban_tinggi / bebanKerjaTim.total_kader) * 251.2} 251.2`}
              />
              {/* Sedang segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#eab308"
                strokeWidth="12"
                strokeDasharray={`${(bebanKerjaTim.kader_beban_sedang / bebanKerjaTim.total_kader) * 251.2} 251.2`}
                strokeDashoffset={-((bebanKerjaTim.kader_beban_tinggi / bebanKerjaTim.total_kader) * 251.2)}
              />
              {/* Rendah segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeDasharray={`${(bebanKerjaTim.kader_beban_rendah / bebanKerjaTim.total_kader) * 251.2} 251.2`}
                strokeDashoffset={-(((bebanKerjaTim.kader_beban_tinggi + bebanKerjaTim.kader_beban_sedang) / bebanKerjaTim.total_kader) * 251.2)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-dark dark:text-white">{bebanKerjaTim.total_kader}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">kader</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-dark dark:text-white">Beban Tinggi</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-red-600 dark:text-red-400">{bebanKerjaTim.kader_beban_tinggi}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({((bebanKerjaTim.kader_beban_tinggi / bebanKerjaTim.total_kader) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium text-dark dark:text-white">Beban Sedang</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{bebanKerjaTim.kader_beban_sedang}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({((bebanKerjaTim.kader_beban_sedang / bebanKerjaTim.total_kader) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-dark dark:text-white">Beban Rendah</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{bebanKerjaTim.kader_beban_rendah}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({((bebanKerjaTim.kader_beban_rendah / bebanKerjaTim.total_kader) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BebanKerjaTimSummary;
