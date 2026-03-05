"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PosyanduItem, DashboardSummary as DashboardSummaryType } from "@/types/dashboard-kepala-desa";
import {
  posyanduListData,
  dashboardSummaryData,
  monthlyTrendData,
  posyanduPerformanceData,
  recentActivityData,
  kaderWorkloadData,
  criticalChildrenData,
} from "@/data/dummy-dashboard-kepala-desa";

// New hierarchical components
import CriticalAlerts from "../component-desa/CriticalAlerts";
import KeyMetrics from "../component-desa/KeyMetrics";
import PosyanduOverview from "../component-desa/PosyanduOverview";
import PerformanceSection from "../component-desa/PerformanceSection";
import KaderManagement from "../component-desa/KaderManagement";
import ExpandableDataSection from "../component-desa/ExpandableDataSection";

// Existing components to keep
import CriticalChildrenList from "../component-desa/CriticalChildrenList";
import WhatsAppButton from "../component-desa/WhatsAppButton";
import ReportPreviewModal from "../component-desa/ReportPreviewModal";
import { WHATSAPP_TEMPLATES } from "@/types/whatsapp";

const DashboardKepalaDesa: React.FC = () => {
  const [selectedPosyandu, setSelectedPosyandu] = useState<PosyanduItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  // Filter underperforming posyandu (kategori "Kurang" or "Cukup")
  const underperformingPosyandu = posyanduPerformanceData
    .filter((p) => p.kategori === "Kurang" || p.kategori === "Cukup")
    .map((p) => posyanduListData.find((pos) => pos.id === p.posyandu_id)!)
    .filter(Boolean);

  // Filter high workload kader
  const highWorkloadKader = kaderWorkloadData.filter((k) => k.kategori_beban === "Tinggi");

  // WhatsApp template data
  const monthlyReportData = {
    periode: "Maret 2026",
    total_posyandu: dashboardSummaryData.total_posyandu.toString(),
    kehadiran_balita: dashboardSummaryData.children_0_59_months.toString(),
    persentase_balita: dashboardSummaryData.rata_rata_kehadiran.toString(),
    kehadiran_ibu_hamil: dashboardSummaryData.total_ibu_hamil.toString(),
    persentase_ibu_hamil: "82",
    kasus_stunting: dashboardSummaryData.kasus_stunting.toString(),
    trend_stunting: "⬇️ (-3)",
    kasus_gizi_buruk: dashboardSummaryData.kasus_gizi_buruk.toString(),
    trend_gizi_buruk: "⬇️ (-2)",
    ranking_posyandu: "1. Kenanga 4 (92)\n2. Melati 1 (85)\n3. Kamboja 7 (82)",
    perhatian: "Posyandu Matahari 8 perlu pembinaan",
    link_download: "[Link PDF]",
  };

  const burnoutAlertData = {
    nama_penerima: "Kepala Desa",
    nama_kader: highWorkloadKader[0]?.nama_kader || "Siti Nurhaliza",
    nama_posyandu: highWorkloadKader[0]?.posyandu_nama || "Kenanga 4",
    skor_beban: (highWorkloadKader[0]?.skor_beban_kerja || 92).toString(),
    jam_kerja: ((highWorkloadKader[0]?.durasi_kerja_posyandu || 20) + (highWorkloadKader[0]?.durasi_kunjungan_rumah || 15)).toString(),
    total_balita: (highWorkloadKader[0]?.total_balita_dibina || 60).toString(),
    trend_beban: "Meningkat 40%",
    rekomendasi: "1. Redistribusi 15 balita\n2. Wajibkan cuti 1 minggu\n3. Rekrut 2 kader pendamping",
  };

  useEffect(() => {
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
                {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
              <span className="font-medium">{posyanduListData.length} Posyandu</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 1: CRITICAL ALERTS - Prioritas Tertinggi */}
      <CriticalAlerts
        criticalChildren={criticalChildrenData}
        underperformingPosyandu={underperformingPosyandu}
        highWorkloadKader={highWorkloadKader}
      />

      {/* LEVEL 2: KEY METRICS - Indikator Kunci */}
      <KeyMetrics summary={dashboardSummaryData} />

      {/* LEVEL 3: POSYANDU OVERVIEW - Daftar Posyandu */}
      <PosyanduOverview
        posyanduList={posyanduListData}
        selectedPosyandu={selectedPosyandu}
        onSelectPosyandu={setSelectedPosyandu}
      />

      {/* Selected Posyandu Detail Banner */}
      {selectedPosyandu && (
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                {selectedPosyandu.nama_posyandu}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                📍 {selectedPosyandu.nama_dusun}, {selectedPosyandu.nama_kecamatan}, {selectedPosyandu.nama_kabupaten_kota}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedPosyandu.total_balita}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Balita</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{selectedPosyandu.total_ibu_hamil}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Hamil</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{selectedPosyandu.total_kader}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Kader</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3: PERFORMANCE & TRENDS */}
      <PerformanceSection
        trendData={monthlyTrendData}
        performanceData={posyanduPerformanceData}
      />

      {/* LEVEL 3: KADER MANAGEMENT */}
      <KaderManagement workloadData={kaderWorkloadData} />

      {/* LEVEL 4: CRITICAL CHILDREN LIST (Detailed View) */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              ⚠️ Daftar Anak dengan Gizi Buruk & Stunting
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Detail lengkap anak yang memerlukan intervensi segera
            </p>
          </div>
        </div>
        {/* eslint-disable-next-line react/no-children-prop */}
        <CriticalChildrenList children={criticalChildrenData} />
      </div>

      {/* LEVEL 4: EXPANDABLE DATA SECTIONS */}
      <ExpandableDataSection
        posyanduList={posyanduListData}
        summary={dashboardSummaryData}
        activities={recentActivityData}
      />

      {/* Quick Actions Sidebar */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">⚡ Aksi Cepat</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-left transition hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
          >
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="font-medium text-dark dark:text-white">Buat Laporan PDF</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Laporan komprehensif</p>
            </div>
          </button>

          <button className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-left transition hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30">
            <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <p className="font-medium text-dark dark:text-white">Kelola Kader</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Data kader aktif</p>
            </div>
          </button>

          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="mb-3 flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <p className="font-medium text-green-800 dark:text-green-300">WhatsApp Actions</p>
            </div>
            <div className="space-y-2">
              <WhatsAppButton
                phoneNumber="081234567890"
                template={WHATSAPP_TEMPLATES.find(t => t.id === "monthly_report")}
                templateData={monthlyReportData}
                buttonVariant="primary"
                buttonText="📊 Kirim Laporan"
                className="w-full text-sm"
              />
              <WhatsAppButton
                phoneNumber="081234567890"
                template={WHATSAPP_TEMPLATES.find(t => t.id === "burnout_alert")}
                templateData={burnoutAlertData}
                buttonVariant="secondary"
                buttonText="⚠️ Alert Kader Burnout"
                className="w-full text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportPreviewModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
    </div>
  );
};

export default DashboardKepalaDesa;
