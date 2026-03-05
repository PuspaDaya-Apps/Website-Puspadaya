"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PosyanduPerformance, MonthlyTrendData } from "@/types/dashboard-kepala-desa";
import { posyanduPerformanceData, monthlyTrendData, posyanduListData } from "@/data/dummy-dashboard-kepala-desa";

const KinerjaPosyanduPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ranking" | "tren" | "detail">("ranking");
  const [selectedPosyandu, setSelectedPosyandu] = useState<string | null>(null);

  // Sort posyandu by performance
  const sortedPosyandu = useMemo(() => {
    return [...posyanduPerformanceData].sort((a, b) => b.skor_kinerja - a.skor_kinerja);
  }, []);

  // Get top 3 and bottom 3
  const top3 = sortedPosyandu.slice(0, 3);
  const bottom3 = sortedPosyandu.slice(-3).reverse();

  // Calculate average scores
  const avgScore = Math.round(
    posyanduPerformanceData.reduce((sum, p) => sum + p.skor_kinerja, 0) / posyanduPerformanceData.length
  );

  // Get category counts
  const categoryCounts = useMemo(() => {
    return {
      sangatBaik: posyanduPerformanceData.filter((p) => p.kategori === "Sangat Baik").length,
      baik: posyanduPerformanceData.filter((p) => p.kategori === "Baik").length,
      cukup: posyanduPerformanceData.filter((p) => p.kategori === "Cukup").length,
      kurang: posyanduPerformanceData.filter((p) => p.kategori === "Kurang").length,
    };
  }, []);

  // Get selected posyandu detail
  const selectedPosyanduDetail = useMemo(() => {
    if (!selectedPosyandu) return null;
    const performance = posyanduPerformanceData.find((p) => p.posyandu_id === selectedPosyandu);
    const posyandu = posyanduListData.find((p) => p.id === selectedPosyandu);
    return { performance, posyandu };
  }, [selectedPosyandu]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
            📈 Kinerja & Tren Posyandu
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Monitoring dan perbandingan kinerja antar posyandu
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-xl bg-gradient-to-br from-primary to-blue-600 p-5 text-white">
          <p className="text-sm text-white/80">Rata-rata Skor</p>
          <p className="text-4xl font-bold">{avgScore}</p>
          <p className="mt-1 text-xs text-white/60">dari 100</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{categoryCounts.sangatBaik}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Sangat Baik</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{categoryCounts.baik}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Baik</p>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{categoryCounts.cukup}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Cukup</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{categoryCounts.kurang}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Kurang</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        {[
          { id: "ranking", label: "🏆 Ranking" },
          { id: "tren", label: "📊 Tren 6 Bulan" },
          { id: "detail", label: "📋 Detail Per Posyandu" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-3 font-medium transition ${
              activeTab === tab.id
                ? "bg-white text-primary dark:bg-gray-dark dark:text-primary"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        {/* Ranking Tab */}
        {activeTab === "ranking" && (
          <div className="space-y-6">
            {/* Top 3 */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                <span>🏆</span> Top 3 Posyandu Terbaik
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {top3.map((posyandu, index) => {
                  const posyanduInfo = posyanduListData.find((p) => p.id === posyandu.posyandu_id);
                  return (
                    <div
                      key={posyandu.posyandu_id}
                      className={`relative overflow-hidden rounded-xl p-6 text-center ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                          : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                          : "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                      }`}
                    >
                      <div className="mb-3 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold">{posyandu.nama_posyandu}</h4>
                      <p className="mt-1 text-sm text-white/80">{posyanduInfo?.nama_dusun}</p>
                      <p className="mt-4 text-5xl font-bold">{posyandu.skor_kinerja}</p>
                      <p className="text-sm text-white/80">skor kinerja</p>
                      <Link
                        href={`/monitoring/posyandu/${posyandu.posyandu_id}`}
                        className="mt-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/30"
                      >
                        Lihat Detail →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom 3 */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-red-600 dark:text-red-400">
                <span>⚠️</span> Perlu Perhatian Khusus
              </h3>
              <div className="space-y-3">
                {bottom3.map((posyandu) => {
                  const posyanduInfo = posyanduListData.find((p) => p.id === posyandu.posyandu_id);
                  return (
                    <div
                      key={posyandu.posyandu_id}
                      className="flex items-center justify-between rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-200 font-bold text-red-700 dark:bg-red-800 dark:text-red-300">
                          {sortedPosyandu.indexOf(posyandu) + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-dark dark:text-white">{posyandu.nama_posyandu}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{posyanduInfo?.nama_dusun}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">{posyandu.skor_kinerja}</p>
                        <p className="text-sm text-red-500 dark:text-red-400">{posyandu.kategori}</p>
                      </div>
                      <Link
                        href={`/monitoring/posyandu/${posyandu.posyandu_id}`}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Detail
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Posyandu List */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">📊 Semua Posyandu</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Posyandu</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Lokasi</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kehadiran</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Peng. Balita</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Peng. Bumil</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Skor</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kategori</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedPosyandu.map((posyandu, index) => {
                      const posyanduInfo = posyanduListData.find((p) => p.id === posyandu.posyandu_id);
                      return (
                        <tr key={posyandu.posyandu_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-dark dark:text-white">{posyandu.nama_posyandu}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{posyanduInfo?.nama_dusun}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div className={`h-full rounded-full ${
                                  posyandu.kehadiran >= 80 ? "bg-emerald-500" : posyandu.kehadiran >= 60 ? "bg-yellow-500" : "bg-red-500"
                                }`} style={{ width: `${posyandu.kehadiran}%` }} />
                              </div>
                              <span className="text-sm font-medium">{posyandu.kehadiran}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{posyandu.pengukuran_balita}%</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{posyandu.pengukuran_ibu_hamil}%</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xl font-bold ${
                              posyandu.skor_kinerja >= 80 ? "text-emerald-600" : posyandu.skor_kinerja >= 60 ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {posyandu.skor_kinerja}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              posyandu.kategori === "Sangat Baik"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : posyandu.kategori === "Baik"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : posyandu.kategori === "Cukup"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {posyandu.kategori}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tren Tab */}
        {activeTab === "tren" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">📊 Tren Kehadiran 6 Bulan Terakhir</h3>
              
              {/* Balita Trend Chart */}
              <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                  <span className="font-medium text-dark dark:text-white">Tren Kehadiran Balita</span>
                </div>
                <div className="flex items-end gap-2">
                  {monthlyTrendData.map((month, index) => {
                    const maxValue = Math.max(...monthlyTrendData.map((m) => m.balita));
                    const height = (month.balita / maxValue) * 200;
                    return (
                      <div key={index} className="flex-1 text-center">
                        <div
                          className="mx-auto w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all hover:from-emerald-700 hover:to-emerald-500"
                          style={{ height: `${height}px`, minHeight: "40px" }}
                          title={`${month.bulan}: ${month.balita} balita`}
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{month.bulan.slice(0, 3)}</p>
                        <p className="text-sm font-bold text-dark dark:text-white">{month.balita}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ibu Hamil Trend Chart */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-pink-500"></div>
                  <span className="font-medium text-dark dark:text-white">Tren Kehadiran Ibu Hamil</span>
                </div>
                <div className="flex items-end gap-2">
                  {monthlyTrendData.map((month, index) => {
                    const maxValue = Math.max(...monthlyTrendData.map((m) => m.ibu_hamil));
                    const height = (month.ibu_hamil / maxValue) * 200;
                    return (
                      <div key={index} className="flex-1 text-center">
                        <div
                          className="mx-auto w-full rounded-t bg-gradient-to-t from-pink-600 to-pink-400 transition-all hover:from-pink-700 hover:to-pink-500"
                          style={{ height: `${height}px`, minHeight: "40px" }}
                          title={`${month.bulan}: ${month.ibu_hamil} ibu hamil`}
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{month.bulan.slice(0, 3)}</p>
                        <p className="text-sm font-bold text-dark dark:text-white">{month.ibu_hamil}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Kehadiran Balita</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(monthlyTrendData.reduce((sum, m) => sum + m.balita, 0) / monthlyTrendData.length)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">per bulan</p>
              </div>
              <div className="rounded-lg bg-pink-50 p-4 dark:bg-pink-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Kehadiran Ibu Hamil</p>
                <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                  {Math.round(monthlyTrendData.reduce((sum, m) => sum + m.ibu_hamil, 0) / monthlyTrendData.length)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">per bulan</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">Trend Keseluruhan</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ↑ {Math.round(((monthlyTrendData[5].balita - monthlyTrendData[0].balita) / monthlyTrendData[0].balita) * 100)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">dalam 6 bulan</p>
              </div>
            </div>
          </div>
        )}

        {/* Detail Tab */}
        {activeTab === "detail" && (
          <div className="space-y-6">
            {/* Posyandu Selector */}
            <div className="flex flex-wrap gap-2">
              {posyanduListData.map((posyandu) => {
                const performance = posyanduPerformanceData.find((p) => p.posyandu_id === posyandu.id);
                return (
                  <button
                    key={posyandu.id}
                    onClick={() => setSelectedPosyandu(posyandu.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      selectedPosyandu === posyandu.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {posyandu.nama_posyandu}
                    {performance && performance.skor_kinerja < 60 && (
                      <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs">⚠️</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Posyandu Detail */}
            {selectedPosyanduDetail && selectedPosyanduDetail.performance && selectedPosyanduDetail.posyandu && (
              <div className="space-y-6">
                {/* Header */}
                <div className="rounded-xl bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
                  <h3 className="text-2xl font-bold">{selectedPosyanduDetail.performance.nama_posyandu}</h3>
                  <p className="text-white/80">{selectedPosyanduDetail.posyandu.nama_dusun}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{selectedPosyanduDetail.performance.skor_kinerja}</p>
                      <p className="text-sm text-white/80">Skor Kinerja</p>
                    </div>
                    <div className="h-16 w-px bg-white/30"></div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedPosyanduDetail.performance.kategori}</p>
                      <p className="text-sm text-white/80">Kategori</p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kehadiran</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedPosyanduDetail.performance.kehadiran}%</p>
                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${selectedPosyanduDetail.performance.kehadiran}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pengukuran Balita</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{selectedPosyanduDetail.performance.pengukuran_balita}%</p>
                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${selectedPosyanduDetail.performance.pengukuran_balita}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-pink-50 p-4 dark:bg-pink-900/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pengukuran Ibu Hamil</p>
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{selectedPosyanduDetail.performance.pengukuran_ibu_hamil}%</p>
                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-pink-500" style={{ width: `${selectedPosyanduDetail.performance.pengukuran_ibu_hamil}%` }} />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Balita</p>
                    <p className="text-2xl font-bold text-dark dark:text-white">{selectedPosyanduDetail.posyandu.total_balita}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Ibu Hamil</p>
                    <p className="text-2xl font-bold text-dark dark:text-white">{selectedPosyanduDetail.posyandu.total_ibu_hamil}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stunting</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{selectedPosyanduDetail.posyandu.status_stunting}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gizi Buruk</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{selectedPosyanduDetail.posyandu.status_gizi_buruk}</p>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/monitoring/posyandu/${selectedPosyanduDetail.posyandu.id}`}
                  className="block w-full rounded-lg bg-primary py-3 text-center font-medium text-white transition hover:bg-primary/90"
                >
                  Lihat Detail Lengkap Posyandu →
                </Link>
              </div>
            )}

            {!selectedPosyandu && (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2">Pilih posyandu untuk melihat detail kinerja</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KinerjaPosyanduPage;
