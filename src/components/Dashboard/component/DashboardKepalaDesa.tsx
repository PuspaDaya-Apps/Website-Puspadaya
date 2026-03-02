"use client";
import React, { useState, useEffect } from "react";
import { PosyanduItem, DashboardSummary as DashboardSummaryType } from "@/types/dashboard-kepala-desa";
import {
  posyanduListData,
  dashboardSummaryData,
  monthlyTrendData,
  posyanduPerformanceData,
  recentActivityData,
} from "@/data/dummy-dashboard-kepala-desa";
import PosyanduSelector from "../component-desa/PosyanduSelector";
import DashboardSummary from "../component-desa/DashboardSummary";
import PosyanduPerformanceChart from "../component-desa/PosyanduPerformanceChart";
import MonthlyTrendChart from "../component-desa/MonthlyTrendChart";
import RecentActivityTable from "../component-desa/RecentActivityTable";

const DashboardKepalaDesa: React.FC = () => {
  const [selectedPosyandu, setSelectedPosyandu] = useState<PosyanduItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-dark dark:text-white">
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
              Dashboard Kepala Desa
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Monitor dan kelola semua posyandu di wilayah Anda
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Periode:</span>{" "}
              <span className="font-medium text-dark dark:text-white">
                {new Date().toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
              <span className="font-medium">
                {posyanduListData.length} Posyandu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummary summary={dashboardSummaryData} />

      {/* Posyandu Selector */}
      <PosyanduSelector
        posyanduList={posyanduListData}
        selectedPosyandu={selectedPosyandu}
        onSelectPosyandu={setSelectedPosyandu}
      />

      {/* Selected Posyandu Detail */}
      {selectedPosyandu && (
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                {selectedPosyandu.nama_posyandu}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                📍 {selectedPosyandu.nama_dusun},{" "}
                {selectedPosyandu.nama_kecamatan},{" "}
                {selectedPosyandu.nama_kabupaten_kota}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedPosyandu.total_balita}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Balita</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {selectedPosyandu.total_ibu_hamil}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Ibu Hamil
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedPosyandu.total_kader}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Kader</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Trend Chart */}
        <MonthlyTrendChart trendData={monthlyTrendData} />

        {/* Posyandu Performance */}
        <PosyanduPerformanceChart
          performanceData={posyanduPerformanceData}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivityTable activities={recentActivityData} />

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stunting & Gizi Stats */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Statistik Stunting & Gizi Buruk
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Posyandu
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-red-500">
                    Stunting
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-orange-500">
                    Gizi Buruk
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-emerald-500">
                    Normal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {posyanduListData.map((posyandu) => (
                  <tr
                    key={posyandu.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3 font-medium text-dark dark:text-white">
                      {posyandu.nama_posyandu}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                      {posyandu.total_balita}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {posyandu.status_stunting}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        {posyandu.status_gizi_buruk}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {posyandu.total_balita -
                          posyandu.status_stunting -
                          posyandu.status_gizi_buruk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Aksi Cepat
          </h2>
          <div className="space-y-3">
            <button className="flex w-full items-center gap-3 rounded-lg bg-blue-50 p-3 text-left transition hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Buat Laporan
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Laporan bulanan desa
                </p>
              </div>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg bg-emerald-50 p-3 text-left transition hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30">
              <svg
                className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Kelola Kader
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Data kader aktif
                </p>
              </div>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg bg-purple-50 p-3 text-left transition hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30">
              <svg
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <div>
                <p className="font-medium text-dark dark:text-white">
                  Lihat Grafik
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Analisis lengkap
                </p>
              </div>
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg bg-amber-50 p-3 text-left transition hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30">
              <svg
                className="h-6 w-6 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <div>
                <p className="font-medium text-dark dark:text-white">Notifikasi</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pengingat & alert
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardKepalaDesa;
