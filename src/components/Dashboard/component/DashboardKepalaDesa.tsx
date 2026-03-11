"use client";
import React, { useState, useEffect } from "react";
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
import { useSeniorMode } from "@/contexts/SeniorModeContext";

// New hierarchical components
import CriticalAlerts from "../component-desa/CriticalAlerts";
import KeyMetrics from "../component-desa/KeyMetrics";
import PosyanduOverview from "../component-desa/PosyanduOverview";
import PerformanceSection from "../component-desa/PerformanceSection";
import KaderManagement from "../component-desa/KaderManagement";
import AdditionalMetrics from "../component-desa/AdditionalMetrics";
import StatistikKehadiranKompetensi from "../component-desa/StatistikKehadiranKompetensi";
import DurasiJarakAgregat from "../component-desa/DurasiJarakAgregat";
import BebanKerjaTimSummary from "../component-desa/BebanKerjaTimSummary";
import SKDNBarChart from "../component-desa/SKDNBarChart";
import ExpandableDataSection from "../component-desa/ExpandableDataSection";

// Senior-friendly components
import DashboardSederhana from "./DashboardSederhana";
import AccessibilityControls from "./AccessibilityControls";
import CriticalChildrenList from "../component-desa/CriticalChildrenList";

const DashboardKepalaDesa: React.FC = () => {
  const [selectedPosyandu, setSelectedPosyandu] = useState<PosyanduItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isSeniorMode } = useSeniorMode();

  // Filter underperforming posyandu (kategori "Kurang" or "Cukup")
  const underperformingPosyandu = posyanduPerformanceData
    .filter((p) => p.kategori === "Kurang" || p.kategori === "Cukup")
    .map((p) => posyanduListData.find((pos) => pos.id === p.posyandu_id)!)
    .filter(Boolean);

  // Filter high workload kader
  const highWorkloadKader = kaderWorkloadData.filter((k) => k.kategori_beban === "Tinggi");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Print report function - Open in new tab
  const handlePrintReport = () => {
    window.open("/preview-laporan", "_blank");
  };

  // Show PDF Preview
  const handleShowPDFPreview = () => {
    window.open("/preview-laporan", "_blank");
  };

  // If senior mode is enabled, show simplified dashboard
  if (isSeniorMode) {
    return (
      <>
        <AccessibilityControls onPrint={handleShowPDFPreview} />
        <DashboardSederhana
          summary={dashboardSummaryData}
          criticalChildren={criticalChildrenData}
          posyanduList={posyanduListData}
          highWorkloadKader={highWorkloadKader}
          onPrintReport={handlePrintReport}
        />
      </>
    );
  }

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
      {/* Accessibility Controls - Always visible */}
      <AccessibilityControls onPrint={handleShowPDFPreview} />

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
                {selectedPosyandu.nama_dusun}, {selectedPosyandu.nama_kecamatan}, {selectedPosyandu.nama_kabupaten_kota}
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

      {/* LEVEL 3: STATISTIK KEHADIRAN PER KOMPETENSI */}
      <StatistikKehadiranKompetensi kehadiranKompetensi={dashboardSummaryData.kehadiran_kompetensi} />

      {/* LEVEL 3: DURASI DAN JARAK AGREGAT */}
      <DurasiJarakAgregat durasiJarak={dashboardSummaryData.durasi_jarak_agregat} />

      {/* LEVEL 3: BEBAN KERJA TIM SUMMARY */}
      <BebanKerjaTimSummary bebanKerjaTim={dashboardSummaryData.beban_kerja_tim} />

      {/* LEVEL 3: ADDITIONAL METRICS - Data Kependudukan & SKDN */}
      <AdditionalMetrics summary={dashboardSummaryData} />

      {/* LEVEL 3: SKDN BAR CHART */}
      <SKDNBarChart skdnData={dashboardSummaryData.skdn_data} />

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
              Daftar Anak dengan Gizi Buruk & Stunting
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
    </div>
  );
};

export default DashboardKepalaDesa;
