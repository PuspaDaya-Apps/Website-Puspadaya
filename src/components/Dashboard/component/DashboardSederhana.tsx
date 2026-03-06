"use client";
import React from "react";
import { DashboardSummary, CriticalChild, PosyanduItem, KaderWorkload } from "@/types/dashboard-kepala-desa";
import { useSeniorMode } from "@/contexts/SeniorModeContext";

interface DashboardSederhanaProps {
  summary: DashboardSummary;
  criticalChildren: CriticalChild[];
  posyanduList: PosyanduItem[];
  highWorkloadKader: KaderWorkload[];
  onPrintReport: () => void;
}

const DashboardSederhana: React.FC<DashboardSederhanaProps> = ({
  summary,
  criticalChildren,
  posyanduList,
  highWorkloadKader,
  onPrintReport,
}) => {
  const { isSeniorMode, fontSize, highContrast } = useSeniorMode();

  // Font size classes based on setting
  const getFontSize = (size: "small" | "medium" | "large" | "xlarge") => {
    if (fontSize === "xlarge") {
      return {
        small: "text-lg",
        medium: "text-2xl",
        large: "text-4xl",
        xlarge: "text-6xl",
      }[size];
    }
    if (fontSize === "large") {
      return {
        small: "text-base",
        medium: "text-xl",
        large: "text-3xl",
        xlarge: "text-5xl",
      }[size];
    }
    return {
      small: "text-sm",
      medium: "text-lg",
      large: "text-2xl",
      xlarge: "text-4xl",
    }[size];
  };

  // High contrast classes
  const getContrastClass = (color: string) => {
    if (highContrast) {
      return color.replace("gray", "black");
    }
    return color;
  };

  return (
    <div className={`space-y-6 p-4 ${isSeniorMode ? "bg-white" : ""}`}>
      {/* Header */}
      <div className={`rounded-xl p-6 shadow-md ${highContrast ? "bg-white border-4 border-black" : "bg-white"}`}>
        <h1 className={`${getFontSize("xlarge")} font-bold text-black`}>
          Dashboard Kepala Desa
        </h1>
        <p className={`${getFontSize("small")} text-gray-700 mt-2`}>
          Monitor kesehatan balita dan ibu hamil di wilayah Anda
        </p>
      </div>

      {/* CRITICAL ALERTS - Prioritas Utama */}
      {criticalChildren.length > 0 && (
        <div className={`rounded-xl p-6 shadow-md ${highContrast ? "bg-red-50 border-4 border-red-600" : "bg-red-50"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className={`${getFontSize("large")} font-bold text-red-800`}>
                PERHATIAN: {criticalChildren.length} Anak Perlu Bantuan Segera
              </h2>
              <p className={`${getFontSize("small")} text-red-700 mt-1`}>
                Anak dengan gizi buruk dan stunting yang memerlukan tindakan
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {criticalChildren.slice(0, 5).map((child) => (
              <div key={child.id} className="rounded-lg bg-white p-4 border-2 border-red-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${getFontSize("medium")} font-bold text-black`}>
                      {child.nama_anak}
                    </p>
                    <p className={`${getFontSize("small")} text-gray-700`}>
                      {child.posyandu_nama} • Usia: {child.usia_bulan} bulan
                    </p>
                    <p className={`${getFontSize("small")} text-gray-700`}>
                      👤 Ibu: {child.nama_ibu}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`${getFontSize("large")} font-bold text-red-600`}>
                      {child.berat_badan} kg
                    </p>
                    <p className={`${getFontSize("small")} text-gray-600`}>
                      {child.tinggi_badan} cm
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 METRIC UTAMA */}
      <div className={`${highContrast ? "bg-white border-4 border-black" : "bg-white"} rounded-xl p-6 shadow-md`}>
        <h2 className={`${getFontSize("large")} font-bold text-black mb-4`}>
          Data Penting Bulan Ini
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total Posyandu */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-blue-600 bg-blue-50" : "border-blue-200 bg-blue-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-blue-800`}>
              Total Posyandu
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-blue-600 mt-2`}>
              {summary.total_posyandu}
            </p>
            <p className={`${getFontSize("small")} text-blue-700 mt-1`}>
              {summary.posyandu_aktif} aktif
            </p>
          </div>

          {/* Total Balita */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-green-600 bg-green-50" : "border-green-200 bg-green-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-green-800`}>
              Total Balita
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-green-600 mt-2`}>
              {summary.total_balita}
            </p>
            <p className={`${getFontSize("small")} text-green-700 mt-1`}>
              {summary.children_0_59_months} berkunjung
            </p>
          </div>

          {/* Kehadiran */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-purple-600 bg-purple-50" : "border-purple-200 bg-purple-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-purple-800`}>
              Rata-rata Kehadiran
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-purple-600 mt-2`}>
              {summary.rata_rata_kehadiran}%
            </p>
            <p className={`${getFontSize("small")} text-purple-700 mt-1`}>
              dari total balita
            </p>
          </div>

          {/* Stunting */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-red-600 bg-red-50" : "border-red-200 bg-red-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-red-800`}>
              Kasus Stunting
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-red-600 mt-2`}>
              {summary.kasus_stunting}
            </p>
            <p className={`${getFontSize("small")} text-red-700 mt-1`}>
              {summary.stunting_prevalence.prevalensi_persentase}% dari balita
            </p>
          </div>

          {/* Gizi Buruk */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-orange-600 bg-orange-50" : "border-orange-200 bg-orange-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-orange-800`}>
              Gizi Buruk
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-orange-600 mt-2`}>
              {summary.kasus_gizi_buruk}
            </p>
            <p className={`${getFontSize("small")} text-orange-700 mt-1`}>
              perlu tindakan
            </p>
          </div>
        </div>
      </div>

      {/* KADER DENGAN BEBAN TINGGI */}
      {highWorkloadKader.length > 0 && (
        <div className={`${highContrast ? "bg-white border-4 border-orange-600" : "bg-white"} rounded-xl p-6 shadow-md`}>
          <h2 className={`${getFontSize("large")} font-bold text-black mb-4`}>
            {highWorkloadKader.length} Kader Dengan Beban Kerja Tinggi
          </h2>
          <div className="space-y-3">
            {highWorkloadKader.slice(0, 3).map((kader) => (
              <div key={kader.id} className="rounded-lg bg-orange-50 p-4 border-2 border-orange-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${getFontSize("medium")} font-bold text-black`}>
                      {kader.nama_kader}
                    </p>
                    <p className={`${getFontSize("small")} text-gray-700`}>
                      {kader.posyandu_nama}
                    </p>
                    <p className={`${getFontSize("small")} text-gray-700`}>
                      {kader.total_balita_dibina} balita • {kader.total_ibu_hamil_dibina} ibu hamil
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`${getFontSize("large")} font-bold text-red-600`}>
                      Skor: {kader.skor_beban_kerja}
                    </p>
                    <p className={`${getFontSize("small")} text-gray-600`}>
                      {kader.durasi_kerja_posyandu + kader.durasi_kunjungan_rumah} jam/minggu
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKDN CHART - Simplified */}
      <div className={`${highContrast ? "bg-white border-4 border-black" : "bg-white"} rounded-xl p-6 shadow-md`}>
        <h2 className={`${getFontSize("large")} font-bold text-black mb-4`}>
          Statistik Gizi Balita (SKDN)
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4 text-center border-2 border-blue-300">
            <p className={`${getFontSize("small")} text-blue-800`}>Balita Baru</p>
            <p className={`${getFontSize("xlarge")} font-bold text-blue-600`}>{summary.skdn_data.N}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center border-2 border-green-300">
            <p className={`${getFontSize("small")} text-green-800`}>Naik BB</p>
            <p className={`${getFontSize("xlarge")} font-bold text-green-600`}>{summary.skdn_data.D}</p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4 text-center border-2 border-yellow-300">
            <p className={`${getFontSize("small")} text-yellow-800`}>Tidak Naik BB</p>
            <p className={`${getFontSize("xlarge")} font-bold text-yellow-600`}>{summary.skdn_data.K}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center border-2 border-red-300">
            <p className={`${getFontSize("small")} text-red-800`}>Tidak Hadir</p>
            <p className={`${getFontSize("xlarge")} font-bold text-red-600`}>{summary.skdn_data.S}</p>
          </div>
        </div>
        <div className={`mt-4 rounded-lg p-4 ${highContrast ? "bg-green-50 border-2 border-green-600" : "bg-green-50"}`}>
          <p className={`${getFontSize("medium")} font-bold text-green-800`}>
            ✅ Kenaikan Berat Badan Sesuai: {summary.skdn_data.persentase_kenaikan_bb}%
          </p>
        </div>
      </div>

      {/* TOMBOL AKSI CEPAT */}
      <div className={`${highContrast ? "bg-white border-4 border-black" : "bg-white"} rounded-xl p-6 shadow-md`}>
        <h2 className={`${getFontSize("large")} font-bold text-black mb-4`}>
          Aksi Cepat
        </h2>
        <button
          onClick={onPrintReport}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span className={`${getFontSize("small")} font-medium`}>Download Laporan PDF</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSederhana;
