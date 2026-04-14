"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PosyanduPerformance, CriticalChild, KaderWorkload } from "@/types/dashboard-kepala-desa";
import { posyanduPerformanceData, posyanduListData, criticalChildrenData, kaderWorkloadData, monthlyTrendData } from "@/data/dummy-dashboard-kepala-desa";

const KinerjaPosyanduPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ranking" | "detail">("ranking");
  const [selectedPosyandu, setSelectedPosyandu] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "balita" | "kader" | "kinerja">("overview");

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
    
    // Filter data for this posyandu
    const criticalChildren = criticalChildrenData.filter((c) => c.posyandu_id === selectedPosyandu);
    const kaderList = kaderWorkloadData.filter((k) => k.posyandu_id === selectedPosyandu);
    
    // Calculate stats
    const stats = posyandu ? {
      total_balita: posyandu.total_balita,
      total_ibu_hamil: posyandu.total_ibu_hamil,
      total_kader: posyandu.total_kader,
      kehadiran_balita: posyandu.kehadiran_balita_bulan_ini,
      kehadiran_ibu_hamil: posyandu.kehadiran_ibu_hamil_bulan_ini,
      persentase_kehadiran: posyandu.persentase_kehadiran,
      status_stunting: posyandu.status_stunting,
      status_gizi_buruk: posyandu.status_gizi_buruk,
      normal: posyandu.total_balita - posyandu.status_stunting - posyandu.status_gizi_buruk,
    } : null;
    
    return { performance, posyandu, criticalChildren, kaderList, stats };
  }, [selectedPosyandu]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
              Kinerja & Tren Posyandu
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Monitoring, perbandingan, dan analisis kinerja antar posyandu secara komprehensif
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Total Posyandu:</span>{" "}
              <span className="font-medium text-dark dark:text-white">{posyanduPerformanceData.length}</span>
            </div>
            <div className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
              <span className="font-medium">Rata-rata Skor: {avgScore}/100</span>
            </div>
          </div>
        </div>
      </div>
      

      {/* Summary Stats */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
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
      </div>

      {/* Tabs & Content */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700 pb-4">
          {[
            { id: "ranking", label: "🏆 Ranking" },
            { id: "detail", label: "📋 Detail Per Posyandu" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
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
                    onClick={() => {
                      setSelectedPosyandu(posyandu.id);
                      setDetailTab("overview");
                    }}
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
            {selectedPosyanduDetail && selectedPosyanduDetail.performance && selectedPosyanduDetail.posyandu && selectedPosyanduDetail.stats && (
              <div className="space-y-6">
                {/* Header */}
                <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-dark md:text-3xl dark:text-white">
                        {selectedPosyanduDetail.posyandu.nama_posyandu}
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {selectedPosyanduDetail.posyandu.nama_dusun}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Total Balita:</span>{" "}
                        <span className="font-medium text-dark dark:text-white">{selectedPosyanduDetail.stats.total_balita}</span>
                      </div>
                      <div className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
                        <span className="font-medium">Kader: {selectedPosyanduDetail.stats.total_kader}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                  <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{selectedPosyanduDetail.stats.total_balita}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Balita</p>
                  </div>
                  <div className="rounded-xl bg-pink-50 p-4 text-center dark:bg-pink-900/20">
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{selectedPosyanduDetail.stats.total_ibu_hamil}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Hamil</p>
                  </div>
                  <div className="rounded-xl bg-violet-50 p-4 text-center dark:bg-violet-900/20">
                    <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{selectedPosyanduDetail.stats.total_kader}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Kader</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedPosyanduDetail.stats.kehadiran_balita}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hadir Balita</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-900/20">
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{selectedPosyanduDetail.stats.kehadiran_ibu_hamil}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hadir Ibu Hamil</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{selectedPosyanduDetail.stats.status_stunting}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Stunting</p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{selectedPosyanduDetail.stats.status_gizi_buruk}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Gizi Buruk</p>
                  </div>
                  <div className="rounded-xl bg-teal-50 p-4 text-center dark:bg-teal-900/20">
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{selectedPosyanduDetail.stats.normal}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Normal</p>
                  </div>
                </div>

                {/* Sub Tabs */}
                <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                  {[
                    { id: "overview", label: "📊 Overview" },
                    { id: "balita", label: "👶 Data Balita" },
                    { id: "kader", label: "👥 Kader" },
                    { id: "kinerja", label: "📈 Kinerja" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id as typeof detailTab)}
                      className={`whitespace-nowrap rounded-t-lg px-4 py-3 font-medium transition ${
                        detailTab === tab.id
                          ? "bg-white text-primary dark:bg-gray-dark dark:text-primary"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sub Tab Content */}
                <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                  {/* Overview Tab */}
                  {detailTab === "overview" && (
                    <div className="space-y-6">
                      {/* Kehadiran Progress */}
                      <div>
                        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">📊 Tingkat Kehadiran</h3>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Persentase Kehadiran</span>
                            <span className={`text-2xl font-bold ${
                              selectedPosyanduDetail.stats!.persentase_kehadiran >= 80 ? "text-emerald-600" : selectedPosyanduDetail.stats!.persentase_kehadiran >= 60 ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {selectedPosyanduDetail.stats!.persentase_kehadiran}%
                            </span>
                          </div>
                          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-full rounded-full transition-all ${
                                selectedPosyanduDetail.stats!.persentase_kehadiran >= 80 ? "bg-emerald-500" : selectedPosyanduDetail.stats!.persentase_kehadiran >= 60 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${selectedPosyanduDetail.stats!.persentase_kehadiran}%` }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Gizi Chart */}
                      <div>
                        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">📊 Status Gizi Balita</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
                            <div className="mb-2 flex justify-center">
                              <div className="relative h-20 w-20">
                                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="40" fill="none" stroke="#fecaca" strokeWidth="12" />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="12"
                                    strokeDasharray={`${(selectedPosyanduDetail.stats!.status_stunting / selectedPosyanduDetail.stats!.total_balita) * 251.2} 251.2`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-lg font-bold text-red-600 dark:text-red-400">{selectedPosyanduDetail.stats!.status_stunting}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-red-700 dark:text-red-300">Stunting</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{((selectedPosyanduDetail.stats!.status_stunting / selectedPosyanduDetail.stats!.total_balita) * 100).toFixed(1)}%</p>
                          </div>
                          <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                            <div className="mb-2 flex justify-center">
                              <div className="relative h-20 w-20">
                                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="40" fill="none" stroke="#fed7aa" strokeWidth="12" />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#f97316"
                                    strokeWidth="12"
                                    strokeDasharray={`${(selectedPosyanduDetail.stats!.status_gizi_buruk / selectedPosyanduDetail.stats!.total_balita) * 251.2} 251.2`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{selectedPosyanduDetail.stats!.status_gizi_buruk}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Gizi Buruk</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{((selectedPosyanduDetail.stats!.status_gizi_buruk / selectedPosyanduDetail.stats!.total_balita) * 100).toFixed(1)}%</p>
                          </div>
                          <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
                            <div className="mb-2 flex justify-center">
                              <div className="relative h-20 w-20">
                                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="40" fill="none" stroke="#a7f3d0" strokeWidth="12" />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="12"
                                    strokeDasharray={`${(selectedPosyanduDetail.stats!.normal / selectedPosyanduDetail.stats!.total_balita) * 251.2} 251.2`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selectedPosyanduDetail.stats!.normal}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Normal</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{((selectedPosyanduDetail.stats!.normal / selectedPosyanduDetail.stats!.total_balita) * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Critical Children Alert */}
                      {selectedPosyanduDetail.criticalChildren.length > 0 && (
                        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                          <div className="mb-3 flex items-center gap-2">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                              ⚠️ Kasus Kritis di Posyandu Ini
                            </h3>
                          </div>
                          <div className="space-y-2">
                            {selectedPosyanduDetail.criticalChildren.slice(0, 5).map((child) => (
                              <div key={child.id} className="flex items-center justify-between rounded bg-white p-3 dark:bg-gray-800">
                                <div>
                                  <p className="font-medium text-dark dark:text-white">{child.nama_anak}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {child.usia_bulan} bulan • {child.status_gizi} {child.status_stunting === "Stunting" && "• Stunting"}
                                  </p>
                                </div>
                                <Link
                                  href="/monitoring/kasus-kritis"
                                  className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700"
                                >
                                  Detail
                                </Link>
                              </div>
                            ))}
                          </div>
                          <Link
                            href="/monitoring/kasus-kritis"
                            className="mt-3 block text-center text-sm font-medium text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
                          >
                            Lihat semua {selectedPosyanduDetail.criticalChildren.length} kasus kritis →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Balita Tab */}
                  {detailTab === "balita" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-dark dark:text-white">👶 Daftar Balita dengan Kondisi Khusus</h3>
                      {selectedPosyanduDetail.criticalChildren.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Usia</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Ibu</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">BB/TB</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {selectedPosyanduDetail.criticalChildren.map((child) => (
                                <tr key={child.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <td className="px-4 py-3 font-medium text-dark dark:text-white">{child.nama_anak}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{child.usia_bulan} bulan</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{child.nama_ibu}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    {child.berat_badan}kg / {child.tinggi_badan}cm
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                        child.status_gizi === "Gizi Buruk"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                          : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                      }`}>
                                        {child.status_gizi}
                                      </span>
                                      {child.status_stunting === "Stunting" && (
                                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                          Stunting
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Link
                                      href="/monitoring/kasus-kritis"
                                      className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                    >
                                      Detail
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="mt-2">Tidak ada balita dengan kondisi khusus di posyandu ini</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Kader Tab */}
                  {detailTab === "kader" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-dark dark:text-white">👥 Daftar Kader Posyandu</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {selectedPosyanduDetail.kaderList.map((kader) => (
                          <div key={kader.id} className="rounded-lg border border-gray-200 p-4 transition hover:shadow-md dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                                {kader.nama_kader.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-dark dark:text-white">{kader.nama_kader}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{kader.role}</p>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>👶 {kader.total_balita_dibina} balita</span>
                                  <span>🤰 {kader.total_ibu_hamil_dibina} ibu hamil</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  kader.kategori_beban === "Tinggi"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : kader.kategori_beban === "Sedang"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                }`}>
                                  {kader.kategori_beban}
                                </span>
                                <p className="mt-1 text-sm font-bold text-dark dark:text-white">{kader.skor_beban_kerja} skor</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kinerja Tab */}
                  {detailTab === "kinerja" && selectedPosyanduDetail.performance && (
                    <div className="space-y-6">
                      {/* Performance Score */}
                      <div className="rounded-lg bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/80">Skor Kinerja</p>
                            <p className="text-5xl font-bold">{selectedPosyanduDetail.performance.skor_kinerja}</p>
                            <p className="mt-2 text-white/80">{selectedPosyanduDetail.performance.kategori}</p>
                          </div>
                          <div className="relative h-32 w-32">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="white"
                                strokeWidth="8"
                                strokeDasharray={`${(selectedPosyanduDetail.performance.skor_kinerja / 100) * 251.2} 251.2`}
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Kehadiran</p>
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedPosyanduDetail.performance.kehadiran}%</p>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${selectedPosyanduDetail.performance.kehadiran}%` }} />
                          </div>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pengukuran Balita</p>
                          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{selectedPosyanduDetail.performance.pengukuran_balita}%</p>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${selectedPosyanduDetail.performance.pengukuran_balita}%` }} />
                          </div>
                        </div>
                        <div className="rounded-lg bg-pink-50 p-4 dark:bg-pink-900/20">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Pengukuran Ibu Hamil</p>
                          <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{selectedPosyanduDetail.performance.pengukuran_ibu_hamil}%</p>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div className="h-full rounded-full bg-pink-500" style={{ width: `${selectedPosyanduDetail.performance.pengukuran_ibu_hamil}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Monthly Trend */}
                      <div>
                        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">📊 Tren Kehadiran 6 Bulan Terakhir</h3>
                        <div className="flex items-end gap-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                          {monthlyTrendData.map((month, index) => {
                            const maxValue = Math.max(...monthlyTrendData.map((m) => m.balita));
                            const height = (month.balita / maxValue) * 100;
                            return (
                              <div key={index} className="flex-1 text-center">
                                <div
                                  className="mx-auto w-full max-w-[50px] rounded-t bg-gradient-to-t from-primary to-blue-400 transition-all hover:from-primary/80 hover:to-blue-300"
                                  style={{ height: `${height}%`, minHeight: "30px" }}
                                  title={`${month.bulan}: ${month.balita} balita`}
                                />
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{month.bulan.slice(0, 3)}</p>
                                <p className="text-xs font-medium text-dark dark:text-white">{month.balita}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
