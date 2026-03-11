"use client";
import React from "react";
import { PosyanduItem, DashboardSummary, CriticalChild, PosyanduPerformance, MonthlyTrendData, KaderWorkload } from "@/types/dashboard-kepala-desa";

interface DashboardPDFPreviewProps {
  summary: DashboardSummary;
  criticalChildren: CriticalChild[];
  posyanduList: PosyanduItem[];
  posyanduPerformance: PosyanduPerformance[];
  monthlyTrendData: MonthlyTrendData[];
  kaderWorkload: KaderWorkload[];
  highWorkloadKader: KaderWorkload[];
  underperformingPosyandu: PosyanduItem[];
  onClose: () => void;
  onPrint: () => void;
}

const DashboardPDFPreview: React.FC<DashboardPDFPreviewProps> = ({
  summary,
  criticalChildren,
  posyanduList,
  posyanduPerformance,
  monthlyTrendData,
  kaderWorkload,
  highWorkloadKader,
  underperformingPosyandu,
  onClose,
  onPrint,
}) => {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
  month: "long",
    year: "numeric",
  });

  // Calculate statistics
  const totalPosyandu = posyanduList.length;
  const avgPerformanceScore = Math.round(
    posyanduPerformance.reduce((sum, p) => sum + p.skor_kinerja, 0) / posyanduPerformance.length
  );
  const totalKader = kaderWorkload.length;
  const avgKaderWorkload = Math.round(
    kaderWorkload.reduce((sum, k) => sum + k.skor_beban_kerja, 0) / totalKader
  );

  // Category counts
  const performanceCategories = {
    sangatBaik: posyanduPerformance.filter((p) => p.kategori === "Sangat Baik").length,
    baik: posyanduPerformance.filter((p) => p.kategori === "Baik").length,
    cukup: posyanduPerformance.filter((p) => p.kategori === "Cukup").length,
    kurang: posyanduPerformance.filter((p) => p.kategori === "Kurang").length,
  };

  const workloadCategories = {
    tinggi: kaderWorkload.filter((k) => k.kategori_beban === "Tinggi").length,
    sedang: kaderWorkload.filter((k) => k.kategori_beban === "Sedang").length,
    rendah: kaderWorkload.filter((k) => k.kategori_beban === "Rendah").length,
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:static print:block print:bg-white">
      <div className="flex h-[90vh] w-full max-w-7xl flex-col rounded-2xl bg-white shadow-2xl print:h-auto print:w-full print:max-w-none print:shadow-none">
        {/* Header - Hidden when printing */}
        <div className="no-print flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white print:hidden">
          <div>
            <h2 className="text-2xl font-bold">Preview Laporan Dashboard</h2>
            <p className="text-sm text-blue-100">Kepala Desa - {currentDate}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onPrint}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6 print:static print:h-auto print:overflow-visible print:bg-white print:p-0">
          <div id="pdf-preview-content" className="mx-auto max-w-5xl space-y-6 print:mx-0 print:w-full print:space-y-4">
            {/* Title Page */}
            <div className="rounded-xl bg-white p-8 shadow-md print:break-after-page">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-dark print:text-2xl">LAPORAN DASHBOARD KEPALA DESA</h1>
                <p className="mt-2 text-lg text-gray-600 print:text-base">Sistem Informasi Posyandu Terpadu</p>
                <div className="mt-6 border-t border-b border-gray-200 py-4 print:py-2">
                  <p className="text-gray-600 print:text-sm">Dicetak pada:</p>
                  <p className="text-xl font-bold text-dark print:text-lg">{currentDate}</p>
                </div>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="rounded-xl bg-white p-6 shadow-md print:break-inside-avoid">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark print:text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 print:bg-blue-50">📊</span>
                Ringkasan Indikator Utama
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{totalPosyandu}</p>
                  <p className="text-sm text-gray-600">Total Posyandu</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-600">{avgPerformanceScore}</p>
                  <p className="text-sm text-gray-600">Rata-rata Skor Kinerja</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">{totalKader}</p>
                  <p className="text-sm text-gray-600">Total Kader</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4 text-center">
                  <p className="text-3xl font-bold text-orange-600">{avgKaderWorkload}</p>
                  <p className="text-sm text-gray-600">Rata-rata Beban Kader</p>
                </div>
              </div>
            </div>

            {/* Performance Categories */}
            <div className="rounded-xl bg-white p-6 shadow-md print:break-inside-avoid">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark print:text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 print:bg-emerald-50">🏆</span>
                Kategori Kinerja Posyandu
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-600">{performanceCategories.sangatBaik}</p>
                  <p className="text-sm text-gray-600">Sangat Baik</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{performanceCategories.baik}</p>
                  <p className="text-sm text-gray-600">Baik</p>
                </div>
                <div className="rounded-lg bg-yellow-50 p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{performanceCategories.cukup}</p>
                  <p className="text-sm text-gray-600">Cukup</p>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{performanceCategories.kurang}</p>
                  <p className="text-sm text-gray-600">Kurang</p>
                </div>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="rounded-xl bg-white p-6 shadow-md print:break-inside-avoid">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark print:text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 print:bg-red-50">⚠️</span>
                Alert Kritis
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg bg-red-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-red-800">Anak dengan Gizi Buruk & Stunting</p>
                      <p className="text-sm text-red-600">Memerlukan intervensi segera</p>
                    </div>
                    <p className="text-3xl font-bold text-red-600">{criticalChildren.length}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-orange-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-orange-800">Posyandu Underperforming</p>
                      <p className="text-sm text-orange-600">Kinerja Cukup/Kurang</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{underperformingPosyandu.length}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-yellow-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-yellow-800">Kader dengan Beban Tinggi</p>
                      <p className="text-sm text-yellow-600">Perlu perhatian khusus</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">{highWorkloadKader.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top & Bottom Posyandu */}
            <div className="rounded-xl bg-white p-6 shadow-md print:break-inside-avoid">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark print:text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 print:bg-indigo-50">📈</span>
                Ranking Kinerja Posyandu
              </h3>

              {/* Top 3 */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-bold text-emerald-600 print:text-xs">🏆 Top 3 Posyandu Terbaik</h4>
                <div className="space-y-2">
                  {posyanduPerformance
                    .sort((a, b) => b.skor_kinerja - a.skor_kinerja)
                    .slice(0, 3)
                    .map((pos, idx) => {
                      const posyanduInfo = posyanduList.find((p) => p.id === pos.posyandu_id);
                      return (
                        <div key={pos.posyandu_id} className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 font-bold text-emerald-700">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-bold text-dark">{pos.nama_posyandu}</p>
                              <p className="text-sm text-gray-600">{posyanduInfo?.nama_dusun}</p>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-emerald-600">{pos.skor_kinerja}</p>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Bottom 3 */}
              <div>
                <h4 className="mb-3 text-sm font-bold text-red-600 print:text-xs">⚠️ Perlu Perhatian Khusus</h4>
                <div className="space-y-2">
                  {posyanduPerformance
                    .sort((a, b) => a.skor_kinerja - b.skor_kinerja)
                    .slice(0, 3)
                    .map((pos, idx) => {
                      const posyanduInfo = posyanduList.find((p) => p.id === pos.posyandu_id);
                      return (
                        <div key={pos.posyandu_id} className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-200 font-bold text-red-700">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-bold text-dark">{pos.nama_posyandu}</p>
                              <p className="text-sm text-gray-600">{posyanduInfo?.nama_dusun}</p>
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-red-600">{pos.skor_kinerja}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="rounded-xl bg-white p-6 shadow-md print:break-inside-avoid">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark print:text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 print:bg-blue-50">📉</span>
                Tren Kehadiran 6 Bulan Terakhir
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-bold text-emerald-600 print:text-xs">Kehadiran Balita</h4>
                  <div className="flex items-end gap-2">
                    {monthlyTrendData.map((month, idx) => {
                      const maxValue = Math.max(...monthlyTrendData.map((m) => m.balita));
                      const height = (month.balita / maxValue) * 100;
                      return (
                        <div key={idx} className="flex-1 text-center">
                          <div
                            className="mx-auto w-full rounded-t bg-emerald-500"
                            style={{ height: `${Math.max(height, 10)}px` }}
                          />
                          <p className="mt-1 text-xs text-gray-600">{month.bulan.slice(0, 3)}</p>
                          <p className="text-sm font-bold text-dark">{month.balita}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-bold text-pink-600 print:text-xs">Kehadiran Ibu Hamil</h4>
                  <div className="flex items-end gap-2">
                    {monthlyTrendData.map((month, idx) => {
                      const maxValue = Math.max(...monthlyTrendData.map((m) => m.ibu_hamil));
                      const height = (month.ibu_hamil / maxValue) * 100;
                      return (
                        <div key={idx} className="flex-1 text-center">
                          <div
                            className="mx-auto w-full rounded-t bg-pink-500"
                            style={{ height: `${Math.max(height, 10)}px` }}
                          />
                          <p className="mt-1 text-xs text-gray-600">{month.bulan.slice(0, 3)}</p>
                          <p className="text-sm font-bold text-dark">{month.ibu_hamil}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Kader Workload */}
            <div className="rounded-xl bg-white p-6 shadow-md print:break-inside-avoid">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark print:text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 print:bg-purple-50">👥</span>
                Beban Kerja Kader
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-red-50 p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{workloadCategories.tinggi}</p>
                  <p className="text-sm text-gray-600">Beban Tinggi</p>
                </div>
                <div className="rounded-lg bg-yellow-50 p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{workloadCategories.sedang}</p>
                  <p className="text-sm text-gray-600">Beban Sedang</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-600">{workloadCategories.rendah}</p>
                  <p className="text-sm text-gray-600">Beban Rendah</p>
                </div>
              </div>
            </div>

            {/* Critical Children List */}
            <div className="rounded-xl bg-white p-6 shadow-md print:break-inside-avoid">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark print:text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 print:bg-red-50">🚨</span>
                Daftar Anak dengan Gizi Buruk & Stunting
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 print:px-2">Nama Anak</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 print:px-2">Nama Ibu</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 print:px-2">Posyandu</th>
                      <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 print:px-2">Usia (Bulan)</th>
                      <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 print:px-2">Status Gizi</th>
                      <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 print:px-2">Stunting</th>
                      <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 print:px-2">Prioritas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {criticalChildren.map((child, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 print:break-inside-avoid">
                        <td className="px-3 py-2 font-medium text-dark print:px-2">{child.nama_anak}</td>
                        <td className="px-3 py-2 text-sm text-gray-600 print:px-2">{child.nama_ibu}</td>
                        <td className="px-3 py-2 text-sm text-gray-600 print:px-2">{child.posyandu_nama}</td>
                        <td className="px-3 py-2 text-center text-sm text-gray-600 print:px-2">{child.usia_bulan}</td>
                        <td className="px-3 py-2 text-center print:px-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            child.status_gizi === "Gizi Buruk"
                              ? "bg-red-100 text-red-800"
                              : child.status_gizi === "Gizi Kurang"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {child.status_gizi}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center print:px-2">
                          {child.status_stunting === "Stunting" ? (
                            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">Stunting</span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center print:px-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            child.prioritas === "Sangat Tinggi"
                              ? "bg-red-100 text-red-800"
                              : child.prioritas === "Tinggi"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
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
            <div className="rounded-xl bg-gray-50 p-6 text-center print:break-before-page">
              <p className="text-sm text-gray-600 print:text-xs">
                Laporan ini dibuat secara otomatis oleh Sistem Informasi Posyandu Terpadu
              </p>
              <p className="mt-2 text-xs text-gray-500 print:text-[10px]">
                {currentDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPDFPreview;
