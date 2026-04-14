"use client";
import React from "react";
import { BebanKerjaTimSummary } from "@/types/dashboard-kepala-desa";

interface BebanKerjaTimSummaryProps {
  bebanKerjaTim: BebanKerjaTimSummary;
}

const BebanKerjaTimSummary: React.FC<BebanKerjaTimSummaryProps> = ({ bebanKerjaTim }) => {
  // Calculate percentages safely
  const totalKader = bebanKerjaTim.total_kader || 1; // Prevent division by zero
  const tinggiPercent = ((bebanKerjaTim.kader_beban_tinggi / totalKader) * 100).toFixed(1);
  const sedangPercent = ((bebanKerjaTim.kader_beban_sedang / totalKader) * 100).toFixed(1);
  const rendahPercent = ((bebanKerjaTim.kader_beban_rendah / totalKader) * 100).toFixed(1);

  // Calculate stroke lengths for donut chart
  const circumference = 2 * Math.PI * 40; // r=40
  const tinggiLength = (bebanKerjaTim.kader_beban_tinggi / totalKader) * circumference;
  const sedangLength = (bebanKerjaTim.kader_beban_sedang / totalKader) * circumference;
  const rendahLength = (bebanKerjaTim.kader_beban_rendah / totalKader) * circumference;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-dark dark:shadow-none">
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-200 dark:from-amber-500 dark:to-amber-700 dark:shadow-none">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Skor Beban Kerja Tim Kader
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Ringkasan beban kerja semua kader di wilayah Anda
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <div className="group rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 transition-all duration-200 hover:scale-105 hover:shadow-md dark:border-amber-900/30 dark:from-amber-900/20 dark:to-amber-900/10">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {bebanKerjaTim.total_kader}
          </p>
          <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">Total Kader</p>
        </div>
        <div className="group rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-red-100/50 p-4 transition-all duration-200 hover:scale-105 hover:shadow-md dark:border-red-900/30 dark:from-red-900/20 dark:to-red-900/10">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {bebanKerjaTim.skor_beban_tertinggi}
          </p>
          <p className="mt-1 text-xs font-medium text-red-700 dark:text-red-300">Skor Tertinggi</p>
        </div>
        <div className="group rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 transition-all duration-200 hover:scale-105 hover:shadow-md dark:border-emerald-900/30 dark:from-emerald-900/20 dark:to-emerald-900/10">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {bebanKerjaTim.skor_beban_terendah}
          </p>
          <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">Skor Terendah</p>
        </div>
        <div className="group rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 transition-all duration-200 hover:scale-105 hover:shadow-md dark:border-blue-900/30 dark:from-blue-900/20 dark:to-blue-900/10">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {bebanKerjaTim.skor_beban_rata_rata?.toFixed(1) || '0'}
          </p>
          <p className="mt-1 text-xs font-medium text-blue-700 dark:text-blue-300">Rata-rata Skor</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5 dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-900/50">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white">
          <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Distribusi Beban Kerja Kader
        </h3>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center lg:flex-row lg:gap-8">
          {/* Donut Chart */}
          <div className="relative h-44 w-44 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
                className="dark:stroke-gray-700"
              />
              {/* Tinggi segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="10"
                strokeDasharray={`${tinggiLength} ${circumference}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Sedang segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#eab308"
                strokeWidth="10"
                strokeDasharray={`${sedangLength} ${circumference}`}
                strokeDashoffset={-tinggiLength}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Rendah segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray={`${rendahLength} ${circumference}`}
                strokeDashoffset={-(tinggiLength + sedangLength)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalKader}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Kader</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-red-100 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-red-900/30 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Beban Tinggi</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-red-600 dark:text-red-400">{bebanKerjaTim.kader_beban_tinggi}</span>
                <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({tinggiPercent}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-yellow-100 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-yellow-900/30 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Beban Sedang</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{bebanKerjaTim.kader_beban_sedang}</span>
                <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({sedangPercent}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md dark:border-emerald-900/30 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Beban Rendah</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{bebanKerjaTim.kader_beban_rendah}</span>
                <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({rendahPercent}%)
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
