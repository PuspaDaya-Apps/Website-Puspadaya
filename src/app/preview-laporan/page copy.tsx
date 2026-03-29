"use client";
import React, { useEffect, useState } from "react";
import {
  DashboardSummary,
  CriticalChild,
  PosyanduItem,
  PosyanduPerformance,
  MonthlyTrendData,
  KaderWorkload,
} from "@/types/dashboard-kepala-desa";
import {
  posyanduListData,
  dashboardSummaryData,
  monthlyTrendData,
  posyanduPerformanceData,
  kaderWorkloadData,
  criticalChildrenData,
} from "@/data/dummy-dashboard-kepala-desa";

const PreviewLaporanPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate statistics
  const totalPosyandu = posyanduListData.length;
  const avgPerformanceScore = Math.round(
    posyanduPerformanceData.reduce((sum, p) => sum + p.skor_kinerja, 0) /
      posyanduPerformanceData.length
  );
  const totalKader = kaderWorkloadData.length;
  const avgKaderWorkload = Math.round(
    kaderWorkloadData.reduce((sum, k) => sum + k.skor_beban_kerja, 0) /
      totalKader
  );

  // Category counts
  const performanceCategories = {
    sangatBaik: posyanduPerformanceData.filter(
      (p) => p.kategori === "Sangat Baik"
    ).length,
    baik: posyanduPerformanceData.filter((p) => p.kategori === "Baik").length,
    cukup: posyanduPerformanceData.filter((p) => p.kategori === "Cukup").length,
    kurang: posyanduPerformanceData.filter((p) => p.kategori === "Kurang").length,
  };

  const workloadCategories = {
    tinggi: kaderWorkloadData.filter((k) => k.kategori_beban === "Tinggi").length,
    sedang: kaderWorkloadData.filter((k) => k.kategori_beban === "Sedang").length,
    rendah: kaderWorkloadData.filter((k) => k.kategori_beban === "Rendah").length,
  };

  // Filter underperforming posyandu
  const underperformingPosyandu = posyanduPerformanceData
    .filter((p) => p.kategori === "Kurang" || p.kategori === "Cukup")
    .map((p) => posyanduListData.find((pos) => pos.id === p.posyandu_id)!)
    .filter(Boolean);

  // Filter high workload kader
  const highWorkloadKader = kaderWorkloadData.filter(
    (k) => k.kategori_beban === "Tinggi"
  );

  // Top 5 Posyandu
  const top5Posyandu = [...posyanduPerformanceData]
    .sort((a, b) => b.skor_kinerja - a.skor_kinerja)
    .slice(0, 5);

  // Bottom 5 Posyandu
  const bottom5Posyandu = [...posyanduPerformanceData]
    .sort((a, b) => a.skor_kinerja - b.skor_kinerja)
    .slice(0, 5);

  // Extract data from dashboardSummaryData
  const skdnData = dashboardSummaryData.skdn_data;
  const kehadiranKompetensi = dashboardSummaryData.kehadiran_kompetensi;
  const durasiJarak = dashboardSummaryData.durasi_jarak_agregat;
  const bebanKerjaTim = dashboardSummaryData.beban_kerja_tim;

  useEffect(() => {
    // Auto trigger print dialog after page loads
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleClose = () => {
    window.close();
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Controls - Hidden when printing */}
      <div className="no-print sticky top-0 z-50 border-b border-gray-300 bg-white shadow-lg">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Analytics - Kepala Desa</h1>
              <p className="text-sm text-gray-500">Periode: {currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PDF
            </button>
            <button onClick={handleClose} className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50">
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-[1600px] p-6 print:max-w-none print:p-0">
        
        {/* Header Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-after-page">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">LAPORAN ANALITIK POSYANDU</h1>
            <p className="mt-1 text-gray-600">Sistem Informasi Posyandu Terpadu</p>
            <p className="mt-2 text-sm text-gray-500">Dicetak: {currentDate}</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-gray-200 bg-blue-50 p-5">
              <p className="text-sm font-medium text-gray-600">Total Posyandu</p>
              <p className="mt-2 text-4xl font-bold text-blue-600">{totalPosyandu}</p>
              <div className="mt-2 h-1 w-full rounded-full bg-blue-200">
                <div className="h-1 rounded-full bg-blue-600" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-emerald-50 p-5">
              <p className="text-sm font-medium text-gray-600">Rata-rata Skor</p>
              <p className="mt-2 text-4xl font-bold text-emerald-600">{avgPerformanceScore}</p>
              <div className="mt-2 h-1 w-full rounded-full bg-emerald-200">
                <div className="h-1 rounded-full bg-emerald-600" style={{ width: `${avgPerformanceScore}%` }}></div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-purple-50 p-5">
              <p className="text-sm font-medium text-gray-600">Total Kader</p>
              <p className="mt-2 text-4xl font-bold text-purple-600">{totalKader}</p>
              <div className="mt-2 h-1 w-full rounded-full bg-purple-200">
                <div className="h-1 rounded-full bg-purple-600" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-red-50 p-5">
              <p className="text-sm font-medium text-gray-600">Kasus Kritis</p>
              <p className="mt-2 text-4xl font-bold text-red-600">{criticalChildrenData.length}</p>
              <div className="mt-2 h-1 w-full rounded-full bg-red-200">
                <div className="h-1 rounded-full bg-red-600" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            📊 DISTRIBUSI KINERJA POSYANDU
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="mx-auto h-32 w-32">
                <svg viewBox="0 0 36 36" className="h-full w-full">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${(performanceCategories.sangatBaik / totalPosyandu) * 100}, 100`}/>
                </svg>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600">{performanceCategories.sangatBaik}</p>
              <p className="text-sm text-gray-600">Sangat Baik</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-32 w-32">
                <svg viewBox="0 0 36 36" className="h-full w-full">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray={`${(performanceCategories.baik / totalPosyandu) * 100}, 100`}/>
                </svg>
              </div>
              <p className="mt-2 text-2xl font-bold text-blue-600">{performanceCategories.baik}</p>
              <p className="text-sm text-gray-600">Baik</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-32 w-32">
                <svg viewBox="0 0 36 36" className="h-full w-full">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray={`${(performanceCategories.cukup / totalPosyandu) * 100}, 100`}/>
                </svg>
              </div>
              <p className="mt-2 text-2xl font-bold text-yellow-600">{performanceCategories.cukup}</p>
              <p className="text-sm text-gray-600">Cukup</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-32 w-32">
                <svg viewBox="0 0 36 36" className="h-full w-full">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray={`${(performanceCategories.kurang / totalPosyandu) * 100}, 100`}/>
                </svg>
              </div>
              <p className="mt-2 text-2xl font-bold text-red-600">{performanceCategories.kurang}</p>
              <p className="text-sm text-gray-600">Kurang</p>
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            📈 TREN KEHADIRAN 6 BULAN TERAKHIR
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Kehadiran Balita</h3>
              <div className="flex items-end gap-2 rounded-lg bg-gray-50 p-4">
                {monthlyTrendData.map((month, idx) => {
                  const maxValue = Math.max(...monthlyTrendData.map((m) => m.balita));
                  const height = (month.balita / maxValue) * 200;
                  return (
                    <div key={idx} className="flex-1 text-center">
                      <div className="mx-auto w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600" style={{ height: `${Math.max(height, 20)}px` }} />
                      <p className="mt-2 text-xs font-medium text-gray-600">{month.bulan.slice(0, 3)}</p>
                      <p className="text-sm font-bold text-gray-900">{month.balita}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Kehadiran Ibu Hamil</h3>
              <div className="flex items-end gap-2 rounded-lg bg-gray-50 p-4">
                {monthlyTrendData.map((month, idx) => {
                  const maxValue = Math.max(...monthlyTrendData.map((m) => m.ibu_hamil));
                  const height = (month.ibu_hamil / maxValue) * 200;
                  return (
                    <div key={idx} className="flex-1 text-center">
                      <div className="mx-auto w-full rounded-t bg-pink-500 transition-all hover:bg-pink-600" style={{ height: `${Math.max(height, 20)}px` }} />
                      <p className="mt-2 text-xs font-medium text-gray-600">{month.bulan.slice(0, 3)}</p>
                      <p className="text-sm font-bold text-gray-900">{month.ibu_hamil}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Top & Bottom Performers */}
        <div className="mb-6 grid grid-cols-2 gap-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <div>
            <h2 className="mb-4 text-lg font-bold text-emerald-700 border-b border-emerald-200 pb-3">
              🏆 TOP 5 POSYANDU TERBAIK
            </h2>
            <div className="space-y-2">
              {top5Posyandu.map((pos, idx) => {
                const posyanduInfo = posyanduListData.find((p) => p.id === pos.posyandu_id);
                return (
                  <div key={pos.posyandu_id} className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-emerald-400' : 'bg-emerald-300'}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{pos.nama_posyandu}</p>
                        <p className="text-xs text-gray-600">{posyanduInfo?.nama_dusun}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{pos.skor_kinerja}</p>
                      <p className="text-xs text-gray-500">skor</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold text-red-700 border-b border-red-200 pb-3">
              ⚠️ BOTTOM 5 POSYANDU (PERLU PERHATIAN)
            </h2>
            <div className="space-y-2">
              {bottom5Posyandu.map((pos, idx) => {
                const posyanduInfo = posyanduListData.find((p) => p.id === pos.posyandu_id);
                return (
                  <div key={pos.posyandu_id} className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-200 font-bold text-red-700">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{pos.nama_posyandu}</p>
                        <p className="text-xs text-gray-600">{posyanduInfo?.nama_dusun}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{pos.skor_kinerja}</p>
                      <p className="text-xs text-gray-500">skor</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kader Workload Distribution */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            👥 DISTRIBUSI BEBAN KERJA KADER
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center">
              <div className="mb-3 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-200">
                  <span className="text-3xl font-bold text-red-700">{workloadCategories.tinggi}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-red-800">Beban Tinggi</p>
              <p className="mt-1 text-sm text-red-600">{Math.round((workloadCategories.tinggi / totalKader) * 100)}% dari total kader</p>
              <div className="mt-3 h-2 w-full rounded-full bg-red-200">
                <div className="h-2 rounded-full bg-red-600" style={{ width: `${(workloadCategories.tinggi / totalKader) * 100}%` }}></div>
              </div>
            </div>
            <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6 text-center">
              <div className="mb-3 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-200">
                  <span className="text-3xl font-bold text-yellow-700">{workloadCategories.sedang}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-yellow-800">Beban Sedang</p>
              <p className="mt-1 text-sm text-yellow-600">{Math.round((workloadCategories.sedang / totalKader) * 100)}% dari total kader</p>
              <div className="mt-3 h-2 w-full rounded-full bg-yellow-200">
                <div className="h-2 rounded-full bg-yellow-600" style={{ width: `${(workloadCategories.sedang / totalKader) * 100}%` }}></div>
              </div>
            </div>
            <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="mb-3 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-200">
                  <span className="text-3xl font-bold text-emerald-700">{workloadCategories.rendah}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-emerald-800">Beban Rendah</p>
              <p className="mt-1 text-sm text-emerald-600">{Math.round((workloadCategories.rendah / totalKader) * 100)}% dari total kader</p>
              <div className="mt-3 h-2 w-full rounded-full bg-emerald-200">
                <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${(workloadCategories.rendah / totalKader) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Kehadiran per Kompetensi */}
        <div className="mb-6 grid grid-cols-2 gap-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <div>
            <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
              👶 KEHADIRAN BALITA PER KOMPETENSI
            </h2>
            <div className="space-y-3">
              {kehadiranKompetensi.balita.detail.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-200 font-bold text-blue-700">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-gray-900">{item.kompetensi}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{item.jumlah}</p>
                    <p className="text-xs text-gray-500">balita</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
              🤰 KEHADIRAN IBU HAMIL PER KOMPETENSI
            </h2>
            <div className="space-y-3">
              {kehadiranKompetensi.ibu_hamil.detail.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-pink-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-200 font-bold text-pink-700">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{item.kompetensi}</span>
                      {item.aktivitas_kader && (
                        <p className="text-xs text-gray-600 mt-1">{item.aktivitas_kader.slice(0, 2).join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600">{item.jumlah}</p>
                    <p className="text-xs text-gray-500">ibu hamil</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Durasi dan Jarak Kerja */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            ⏱️ DURASI DAN JARAK KERJA KADER
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Durasi Kerja */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-4 text-base font-bold text-gray-700">Durasi Kerja</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Durasi Kerja Posyandu</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{durasiJarak.total_durasi_kerja_posyandu}</p>
                    <p className="text-xs text-gray-500">jam (total)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Durasi Kunjungan Rumah</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{durasiJarak.total_durasi_kunjungan_rumah}</p>
                    <p className="text-xs text-gray-500">jam (total)</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Rata-rata Durasi Posyandu</span>
                    <p className="text-xl font-bold text-gray-900">{durasiJarak.rata_rata_durasi_posyandu} jam/kader</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Rata-rata Durasi Kunjungan</span>
                  <p className="text-xl font-bold text-gray-900">{durasiJarak.rata_rata_durasi_kunjungan} jam/kader</p>
                </div>
              </div>
            </div>

            {/* Jarak Kerja */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-4 text-base font-bold text-gray-700">Jarak Kerja</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Jarak Kunjungan Rumah</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">{durasiJarak.total_jarak_kunjungan_rumah}</p>
                    <p className="text-xs text-gray-500">km (total)</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Rata-rata Jarak</span>
                    <p className="text-xl font-bold text-gray-900">{durasiJarak.rata_rata_jarak} km/kader</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-orange-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-orange-800">Skor Beban Kerja Rata-rata</span>
                    <p className="text-2xl font-bold text-orange-600">{bebanKerjaTim.skor_beban_rata_rata}</p>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-orange-200">
                    <div className="h-2 rounded-full bg-orange-600" style={{ width: `${bebanKerjaTim.skor_beban_rata_rata}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SKDN Data */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            📊 SKDN (Sistem Informasi Kesejahteraan Dasar)
          </h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 text-center">
              <p className="text-sm font-medium text-gray-600">S (Semua Balita)</p>
              <p className="mt-2 text-4xl font-bold text-blue-600">{skdnData.S}</p>
              <p className="mt-1 text-xs text-gray-500">Umur 0-59 bulan</p>
            </div>
            <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 text-center">
              <p className="text-sm font-medium text-gray-600">K (Kunjungan)</p>
              <p className="mt-2 text-4xl font-bold text-purple-600">{skdnData.K}</p>
              <p className="mt-1 text-xs text-gray-500">Balita yang datang</p>
            </div>
            <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
              <p className="text-sm font-medium text-gray-600">D (Ditimbang)</p>
              <p className="mt-2 text-4xl font-bold text-emerald-600">{skdnData.D}</p>
              <p className="mt-1 text-xs text-gray-500">Balita ditimbang</p>
            </div>
            <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6 text-center">
              <p className="text-sm font-medium text-gray-600">N (Naik BB)</p>
              <p className="mt-2 text-4xl font-bold text-orange-600">{skdnData.N}</p>
              <p className="mt-1 text-xs text-gray-500">Naik berat badan</p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-center">
              <p className="text-sm font-medium text-gray-600">Level SKDN</p>
              <p className="mt-2 text-4xl font-bold text-gray-600">4</p>
              <p className="mt-1 text-xs text-green-600 font-semibold">Posyandu Mandiri</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Persentase Kenaikan BB</span>
              <p className="text-2xl font-bold text-orange-600">{skdnData.persentase_kenaikan_bb}%</p>
            </div>
            <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
              <div className="h-3 rounded-full bg-orange-600" style={{ width: `${skdnData.persentase_kenaikan_bb}%` }}></div>
            </div>
          </div>
        </div>

        {/* Kunjungan Berdasarkan Usia */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            👶 KUNJUNGAN POSYANDU BERDASARKAN USIA
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center shadow-md">
              <div className="mb-3 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-200">
                  <span className="text-3xl font-bold text-blue-700">{dashboardSummaryData.infant_0_12_months}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-blue-800">Infant (0-12 Bulan)</p>
              <p className="mt-1 text-sm text-blue-600">Bayi berkunjung ke posyandu</p>
            </div>
            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center shadow-md">
              <div className="mb-3 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200">
                  <span className="text-3xl font-bold text-purple-700">{dashboardSummaryData.children_0_23_months}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-purple-800">Toddler (0-23 Bulan)</p>
              <p className="mt-1 text-sm text-purple-600">Anak bawah 2 tahun</p>
            </div>
            <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center shadow-md">
              <div className="mb-3 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-200">
                  <span className="text-3xl font-bold text-emerald-700">{dashboardSummaryData.children_0_59_months}</span>
                </div>
              </div>
              <p className="text-lg font-bold text-emerald-800">Under 5 (0-59 Bulan)</p>
              <p className="mt-1 text-sm text-emerald-600">Balita berkunjung</p>
            </div>
          </div>
        </div>

        {/* Data Wanita dan Ibu Hamil */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            👩 DATA WANITA DAN IBU HAMIL
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-gray-200 bg-pink-50 p-5 text-center">
              <p className="text-sm font-medium text-gray-600">Wanita Pasca Subur</p>
              <p className="mt-2 text-3xl font-bold text-pink-600">{dashboardSummaryData.women_post_fertile}</p>
              <p className="mt-1 text-xs text-gray-500">(&gt;49 tahun)</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-red-50 p-5 text-center">
              <p className="text-sm font-medium text-gray-600">Ibu Hamil KEK</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{dashboardSummaryData.pregnant_women_under_energized}</p>
              <p className="mt-1 text-xs text-gray-500">Kurang Energi Kronis</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-orange-50 p-5 text-center">
              <p className="text-sm font-medium text-gray-600">Ibu Hamil Risiko Tinggi</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">{dashboardSummaryData.high_risk_pregnant_women}</p>
              <p className="mt-1 text-xs text-gray-500">Perlu perhatian khusus</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-emerald-50 p-5 text-center">
              <p className="text-sm font-medium text-gray-600">Ibu Menyusui</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{dashboardSummaryData.breastfeeding_mothers}</p>
              <p className="mt-1 text-xs text-gray-500">ASI Eksklusif</p>
            </div>
          </div>
        </div>

        {/* Imunisasi */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            💉 CAKUPAN IMUNISASI
          </h2>
          <div className="grid grid-cols-5 gap-3">
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">BCG</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{dashboardSummaryData.infant_immunization_coverage.bcg}</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">DPT 1</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">{dashboardSummaryData.infant_immunization_coverage.dpt_1}</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">DPT 2</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">{dashboardSummaryData.infant_immunization_coverage.dpt_2}</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">DPT 3</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">{dashboardSummaryData.infant_immunization_coverage.dpt_3}</p>
            </div>
            <div className="rounded-lg bg-pink-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">Polio 1</p>
              <p className="mt-1 text-2xl font-bold text-pink-600">{dashboardSummaryData.infant_immunization_coverage.polio_1}</p>
            </div>
            <div className="rounded-lg bg-pink-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">Polio 2</p>
              <p className="mt-1 text-2xl font-bold text-pink-600">{dashboardSummaryData.infant_immunization_coverage.polio_2}</p>
            </div>
            <div className="rounded-lg bg-pink-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">Polio 3</p>
              <p className="mt-1 text-2xl font-bold text-pink-600">{dashboardSummaryData.infant_immunization_coverage.polio_3}</p>
            </div>
            <div className="rounded-lg bg-pink-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">Polio 4</p>
              <p className="mt-1 text-2xl font-bold text-pink-600">{dashboardSummaryData.infant_immunization_coverage.polio_4}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">Hepatitis</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{dashboardSummaryData.infant_immunization_coverage.hepatitis}</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4 text-center">
              <p className="text-xs font-medium text-gray-600">Campak</p>
              <p className="mt-1 text-2xl font-bold text-orange-600">{dashboardSummaryData.infant_immunization_coverage.campak}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Total Imunisasi</span>
              <p className="text-2xl font-bold text-gray-900">{dashboardSummaryData.infant_immunization_coverage.total_imunisasi}</p>
            </div>
            <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
              <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${dashboardSummaryData.infant_immunization_coverage.cakupan_persentase}%` }}></div>
            </div>
            <p className="mt-2 text-center text-sm font-medium text-gray-600">Cakupan: {dashboardSummaryData.infant_immunization_coverage.cakupan_persentase}%</p>
          </div>
        </div>

        {/* KB dan Asuransi */}
        <div className="mb-6 grid grid-cols-3 gap-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
            <div className="mb-3 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200">
                <span className="text-3xl font-bold text-blue-700">{dashboardSummaryData.kb_acceptors}</span>
              </div>
            </div>
            <p className="text-lg font-bold text-blue-800">Penerima KB</p>
            <p className="mt-1 text-sm text-blue-600">Jumlah akseptor</p>
          </div>
          <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center">
            <div className="mb-3 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-200">
                <span className="text-3xl font-bold text-emerald-700">{dashboardSummaryData.pregnant_women_with_insurance}</span>
              </div>
            </div>
            <p className="text-lg font-bold text-emerald-800">Ibu Hamil dengan Asuransi</p>
            <p className="mt-1 text-sm text-emerald-600">Jaminan kesehatan</p>
          </div>
          <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center">
            <div className="mb-3 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-200">
                <span className="text-3xl font-bold text-purple-700">{dashboardSummaryData.children_under_5_with_insurance}</span>
              </div>
            </div>
            <p className="text-lg font-bold text-purple-800">Balita dengan Asuransi</p>
            <p className="mt-1 text-sm text-purple-600">0-59 bulan</p>
          </div>
        </div>

        {/* Prevalensi Balita */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
            📊 JUMLAH DAN PREVALENSI BALITA
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-red-800">Stunting</h3>
                <span className="rounded-full bg-red-200 px-3 py-1 text-xs font-bold text-red-700">Kronis</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-red-600">{dashboardSummaryData.stunting_prevalence.jumlah}</p>
                  <p className="text-sm text-gray-600">balita stunting</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-700">{dashboardSummaryData.stunting_prevalence.prevalensi_persentase}%</p>
                  <p className="text-xs text-gray-500">prevalensi</p>
                </div>
              </div>
              <div className="mt-3 h-3 w-full rounded-full bg-red-200">
                <div className="h-3 rounded-full bg-red-600" style={{ width: `${dashboardSummaryData.stunting_prevalence.prevalensi_persentase}%` }}></div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-orange-800">Wasting</h3>
                <span className="rounded-full bg-orange-200 px-3 py-1 text-xs font-bold text-orange-700">Akut</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-orange-600">{dashboardSummaryData.wasting_prevalence.jumlah}</p>
                  <p className="text-sm text-gray-600">balita wasting</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-700">{dashboardSummaryData.wasting_prevalence.prevalensi_persentase}%</p>
                  <p className="text-xs text-gray-500">prevalensi</p>
                </div>
              </div>
              <div className="mt-3 h-3 w-full rounded-full bg-orange-200">
                <div className="h-3 rounded-full bg-orange-600" style={{ width: `${dashboardSummaryData.wasting_prevalence.prevalensi_persentase}%` }}></div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-yellow-800">Underweight</h3>
                <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-bold text-yellow-700">BB Rendah</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-yellow-600">{dashboardSummaryData.underweight_prevalence.jumlah}</p>
                  <p className="text-sm text-gray-600">balita underweight</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-yellow-700">{dashboardSummaryData.underweight_prevalence.prevalensi_persentase}%</p>
                  <p className="text-xs text-gray-500">prevalensi</p>
                </div>
              </div>
              <div className="mt-3 h-3 w-full rounded-full bg-yellow-200">
                <div className="h-3 rounded-full bg-yellow-600" style={{ width: `${dashboardSummaryData.underweight_prevalence.prevalensi_persentase}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Cases Table */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
          <h2 className="mb-4 text-lg font-bold text-red-700 border-b border-red-200 pb-3">
            🚨 DAFTAR KASUS KRITIS - ANAK DENGAN GIZI BURUK & STUNTING
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="px-4 py-3 text-left font-bold text-gray-700">No</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Nama Anak</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Nama Ibu</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Posyandu</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Usia (Bln)</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Status Gizi</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Stunting</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {criticalChildrenData.map((child, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{child.nama_anak}</td>
                    <td className="px-4 py-3 text-gray-700">{child.nama_ibu}</td>
                    <td className="px-4 py-3 text-gray-700">{child.posyandu_nama}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{child.usia_bulan}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded px-3 py-1 text-xs font-semibold ${
                        child.status_gizi === "Gizi Buruk" ? 'bg-red-100 text-red-800' :
                        child.status_gizi === "Gizi Kurang" ? 'bg-orange-100 text-orange-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {child.status_gizi}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {child.status_stunting === "Stunting" ? (
                        <span className="inline-flex items-center rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">✓ Ya</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded px-3 py-1 text-xs font-semibold ${
                        child.prioritas === "Sangat Tinggi" ? 'bg-red-100 text-red-800' :
                        child.prioritas === "Tinggi" ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {child.prioritas}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center print:break-before-page">
          <div className="mb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-base font-semibold text-gray-700">Laporan ini dibuat secara otomatis oleh</p>
          <p className="mt-2 text-xl font-bold text-blue-600">Sistem Informasi Posyandu Terpadu</p>
          <p className="mt-4 text-sm text-gray-500">{currentDate}</p>
        </div>

      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          .rounded-lg {
            break-inside: avoid;
          }

          table {
            break-inside: avoid;
          }

          tr {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default PreviewLaporanPage;
