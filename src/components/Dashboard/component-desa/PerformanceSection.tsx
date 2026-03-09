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

  // Calculate max values for scaling
  const maxBalita = trendData.length > 0 ? Math.max(...trendData.map((d) => d.balita)) : 1;
  const maxIbuHamil = trendData.length > 0 ? Math.max(...trendData.map((d) => d.ibu_hamil)) : 1;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Tren & Kinerja
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Monitoring 12 bulan terakhir
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
              {attendanceChange >= 0 ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}{" "}
              {Math.abs(attendanceChange)}%
            </div>
          </div>

          {/* Modern Bar Chart Visualization */}
          <div className="space-y-6">
            {/* Balita Trend */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Balita</span>
                </div>
                <span className="text-lg font-bold text-dark dark:text-white">
                  {latestMonth?.balita.toLocaleString()}
                </span>
              </div>
              
              {/* Chart Container */}
              <div className="relative h-28 rounded-lg bg-gradient-to-b from-gray-50 to-white p-4 dark:from-gray-800/50 dark:to-gray-900/50">
                <div className="flex h-full items-end justify-between gap-1">
                  {trendData.length > 0 ? (
                    trendData.map((month, index) => {
                      const height = (month.balita / maxBalita) * 100;
                      return (
                        <div
                          key={index}
                          className="group relative flex flex-1 flex-col items-center justify-end"
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-10 z-10 mb-2 hidden whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-lg group-hover:block dark:bg-gray-700">
                            <div className="text-center">
                              <div>{month.bulan}</div>
                              <div className="text-emerald-300">{month.balita.toLocaleString()}</div>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900 dark:bg-gray-700"></div>
                          </div>
                          
                          {/* Bar */}
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-300 hover:from-emerald-600 hover:to-emerald-500"
                            style={{ 
                              height: `${Math.max(height, 8)}%`,
                              opacity: 0.8 + (height / 100) * 0.2
                            }}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      Tidak ada data tren
                    </div>
                  )}
                </div>
              </div>
              
              {/* Month Labels */}
              <div className="mt-2 flex justify-between">
                {trendData.map((month, index) => (
                  <span
                    key={index}
                    className="flex-1 text-center text-xs text-gray-500 dark:text-gray-400"
                    title={month.bulan}
                  >
                    {month.bulan.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200 dark:border-gray-700"></div>

            {/* Ibu Hamil Trend */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                    <svg className="h-4 w-4 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ibu Hamil</span>
                </div>
                <span className="text-lg font-bold text-dark dark:text-white">
                  {latestMonth?.ibu_hamil.toLocaleString()}
                </span>
              </div>
              
              {/* Chart Container */}
              <div className="relative h-28 rounded-lg bg-gradient-to-b from-gray-50 to-white p-4 dark:from-gray-800/50 dark:to-gray-900/50">
                <div className="flex h-full items-end justify-between gap-1">
                  {trendData.length > 0 ? (
                    trendData.map((month, index) => {
                      const height = (month.ibu_hamil / maxIbuHamil) * 100;
                      return (
                        <div
                          key={index}
                          className="group relative flex flex-1 flex-col items-center justify-end"
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-10 z-10 mb-2 hidden whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-lg group-hover:block dark:bg-gray-700">
                            <div className="text-center">
                              <div>{month.bulan}</div>
                              <div className="text-pink-300">{month.ibu_hamil.toLocaleString()}</div>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900 dark:bg-gray-700"></div>
                          </div>
                          
                          {/* Bar */}
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-pink-500 to-pink-400 transition-all duration-300 hover:from-pink-600 hover:to-pink-500"
                            style={{ 
                              height: `${Math.max(height, 8)}%`,
                              opacity: 0.8 + (height / 100) * 0.2
                            }}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      Tidak ada data tren
                    </div>
                  )}
                </div>
              </div>
              
              {/* Month Labels */}
              <div className="mt-2 flex justify-between">
                {trendData.map((month, index) => (
                  <span
                    key={index}
                    className="flex-1 text-center text-xs text-gray-500 dark:text-gray-400"
                    title={month.bulan}
                  >
                    {month.bulan.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ranking Posyandu */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Ranking Posyandu
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
                  className="group flex items-center gap-3 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent p-3 transition-all hover:shadow-md dark:from-emerald-900/20"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-white shadow-md transition-transform group-hover:scale-110 ${
                    index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : 
                    index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-600" : 
                    "bg-gradient-to-br from-orange-400 to-orange-600"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark dark:text-white">
                      {posyandu.nama_posyandu}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Kehadiran: {posyandu.kehadiran}%
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {posyandu.kategori}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
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
                  className="group flex items-center gap-3 rounded-lg bg-gradient-to-r from-red-50 to-transparent p-3 transition-all hover:shadow-md dark:from-red-900/20"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600 transition-transform group-hover:scale-110 dark:bg-gray-700 dark:text-gray-300">
                    {sortedByPerformance.indexOf(posyandu) + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark dark:text-white">
                      {posyandu.nama_posyandu}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Kehadiran: {posyandu.kehadiran}%
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {posyandu.kategori}
                      </span>
                    </div>
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
