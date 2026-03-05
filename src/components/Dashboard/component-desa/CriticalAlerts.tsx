"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { CriticalChild, PosyanduItem, KaderWorkload } from "@/types/dashboard-kepala-desa";

interface CriticalAlertsProps {
  criticalChildren: CriticalChild[];
  underperformingPosyandu: PosyanduItem[];
  highWorkloadKader: KaderWorkload[];
}

interface AlertCardProps {
  title: string;
  icon: React.ReactNode;
  mainValue: number | string;
  mainLabel: string;
  trendValue?: number | string;
  trendLabel?: string;
  trendDirection?: "up" | "down" | "neutral";
  color: "red" | "orange" | "yellow" | "blue";
  onClick?: () => void;
}

const CriticalAlerts: React.FC<CriticalAlertsProps> = ({
  criticalChildren,
  underperformingPosyandu,
  highWorkloadKader,
}) => {
  // Calculate stats
  const stats = useMemo(() => {
    const giziBurukCount = criticalChildren.filter(
      (c) => c.status_gizi === "Gizi Buruk"
    ).length;
    const stuntingCount = criticalChildren.filter(
      (c) => c.status_stunting === "Stunting"
    ).length;
    const newCasesThisMonth = criticalChildren.filter((c) => {
      const measurementDate = new Date(c.tanggal_pengukuran);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - measurementDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 30;
    }).length;

    return {
      giziBuruk: giziBurukCount,
      stunting: stuntingCount,
      newCases: newCasesThisMonth,
      underperformingPosyandu: underperformingPosyandu.length,
      highWorkloadKader: highWorkloadKader.length,
    };
  }, [criticalChildren, underperformingPosyandu, highWorkloadKader]);

  const AlertCard: React.FC<AlertCardProps> = ({
    title,
    icon,
    mainValue,
    mainLabel,
    trendValue,
    trendLabel,
    trendDirection = "neutral",
    color,
    onClick,
  }) => {
    const colorClasses = {
      red: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
      orange:
        "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800",
      yellow:
        "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
      blue: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    };

    const textColors = {
      red: "text-red-600 dark:text-red-400",
      orange: "text-orange-600 dark:text-orange-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
      blue: "text-blue-600 dark:text-blue-400",
    };

    const trendIcons = {
      up: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      down: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      neutral: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      ),
    };

    return (
      <div
        onClick={onClick}
        className={`cursor-pointer rounded-xl border p-5 transition-all hover:shadow-lg ${colorClasses[color]}`}
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${textColors[color]}`}>
              {icon}
            </div>
            <div>
              <h3 className={`font-semibold ${textColors[color]}`}>{title}</h3>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-4xl font-bold text-dark dark:text-white">{mainValue}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{mainLabel}</p>
        </div>

        {trendValue !== undefined && trendLabel && (
          <div className="flex items-center gap-2 text-sm">
            <span className={trendDirection === "up" ? "text-red-500" : trendDirection === "down" ? "text-emerald-500" : "text-gray-500"}>
              {trendIcons[trendDirection]}
            </span>
            <span className="font-medium text-dark dark:text-white">{trendValue}</span>
            <span className="text-gray-600 dark:text-gray-400">{trendLabel}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              ⚠️ Prioritas Utama
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Memerlukan tindakan segera hari ini
            </p>
          </div>
        </div>
        <Link
          href="/monitoring/kasus-kritis"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          Lihat Semua Kasus →
        </Link>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Gizi Buruk Alert */}
        <AlertCard
          title="Gizi Buruk"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          mainValue={stats.giziBuruk}
          mainLabel="kasus aktif"
          trendValue={stats.newCases}
          trendLabel="kasus baru bulan ini"
          trendDirection="up"
          color="red"
        />

        {/* Stunting Alert */}
        <AlertCard
          title="Stunting"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          mainValue={stats.stunting}
          mainLabel="kasus aktif"
          trendDirection="down"
          color="orange"
        />

        {/* Posyandu Bermasalah Alert */}
        <AlertCard
          title="Posyandu Bermasalah"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
          mainValue={stats.underperformingPosyandu}
          mainLabel="posyandu perlu pembinaan"
          color="yellow"
        />

        {/* Kader Burnout Alert */}
        <AlertCard
          title="Kader Overload"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          mainValue={stats.highWorkloadKader}
          mainLabel="kader beban tinggi"
          color="blue"
        />
      </div>
    </div>
  );
};

export default CriticalAlerts;
