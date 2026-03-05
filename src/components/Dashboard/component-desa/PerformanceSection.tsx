"use client";
import React from "react";
import Link from "next/link";
import { MonthlyTrendData, PosyanduPerformance } from "@/types/dashboard-kepala-desa";

interface PerformanceSectionProps {
  trendData: MonthlyTrendData[];
  performanceData: PosyanduPerformance[];
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  trendData,
  performanceData,
}) => {
  // Get top 3 and bottom 3 posyandu
  const sortedByPerformance = [...performanceData].sort(
    (a, b) => b.skor_kinerja - a.skor_kinerja
  );
  const top3 = sortedByPerformance.slice(0, 3);
  const bottom3 = sortedByPerformance.slice(-3).reverse();

  // Calculate average attendance trend
  const latestMonth = trendData[trendData.length - 1];
  const previousMonth = trendData[trendData.length - 2];
  const attendanceChange = latestMonth && previousMonth
    ? Math.round(((latestMonth.balita - previousMonth.balita) / previousMonth.balita) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              📈 Tren & Kinerja
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Monitoring 6 bulan terakhir
            </p>
          </div>
        </div>
        <Link
          href="/monitoring/kinerja-posyandu"
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
        >
          Lihat Detail →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Trend Chart */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Tren Kehadiran Bulanan
            </h3>
            <div className={`flex items-center gap-1 text-sm font-medium ${attendanceChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {attendanceChange >= 0 ? "↑" : "↓"} {Math.abs(attendanceChange)}%
            </div>
          </div>

          {/* Simple Bar Chart Visualization */}
          <div className="space-y-4">
            {/* Balita Trend */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                  Balita
                </span>
                <span className="font-medium text-dark dark:text-white">
                  {latestMonth?.balita.toLocaleString()}
                </span>
              </div>
              <div className="flex items-end gap-1">
                {trendData.map((month, index) => {
                  const maxHeight = Math.max(...trendData.map((d) => d.balita));
                  const height = (month.balita / maxHeight) * 100;
                  return (
                    <div key={index} className="flex-1 text-center">
                      <div
                        className="mx-auto w-full max-w-[40px] rounded-t bg-emerald-500 transition-all hover:bg-emerald-600"
                        style={{ height: `${height}%`, minHeight: "20px" }}
                        title={`${month.bulan}: ${month.balita}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                {trendData.map((month, index) => (
                  <span key={index} className="flex-1 text-center">
                    {month.bulan.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            {/* Ibu Hamil Trend */}
            <div className="pt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="h-3 w-3 rounded-full bg-pink-500"></span>
                  Ibu Hamil
                </span>
                <span className="font-medium text-dark dark:text-white">
                  {latestMonth?.ibu_hamil.toLocaleString()}
                </span>
              </div>
              <div className="flex items-end gap-1">
                {trendData.map((month, index) => {
                  const maxHeight = Math.max(...trendData.map((d) => d.ibu_hamil));
                  const height = (month.ibu_hamil / maxHeight) * 100;
                  return (
                    <div key={index} className="flex-1 text-center">
                      <div
                        className="mx-auto w-full max-w-[40px] rounded-t bg-pink-500 transition-all hover:bg-pink-600"
                        style={{ height: `${height}%`, minHeight: "20px" }}
                        title={`${month.bulan}: ${month.ibu_hamil}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Ranking Posyandu */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            🏆 Ranking Posyandu
          </h3>

          {/* Top 3 */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              ⭐ Top 3 Performa Terbaik
            </h4>
            <div className="space-y-2">
              {top3.map((posyandu, index) => (
                <div
                  key={posyandu.posyandu_id}
                  className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${
                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark dark:text-white">
                      {posyandu.nama_posyandu}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Kehadiran: {posyandu.kehadiran}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {posyandu.skor_kinerja}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      skor
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom 3 */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-red-600 dark:text-red-400">
              ⚠️ Perlu Perhatian
            </h4>
            <div className="space-y-2">
              {bottom3.map((posyandu, index) => (
                <div
                  key={posyandu.posyandu_id}
                  className="flex items-center gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-bold text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                    {sortedByPerformance.indexOf(posyandu) + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark dark:text-white">
                      {posyandu.nama_posyandu}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Kehadiran: {posyandu.kehadiran}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {posyandu.skor_kinerja}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      skor
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
