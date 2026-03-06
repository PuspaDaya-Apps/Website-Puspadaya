"use client";
import React from "react";
import { KehadiranKompetensi } from "@/types/dashboard-kepala-desa";

interface StatistikKehadiranKompetensiProps {
  kehadiranKompetensi: KehadiranKompetensi;
}

const StatistikKehadiranKompetensi: React.FC<StatistikKehadiranKompetensiProps> = ({
  kehadiranKompetensi,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Kehadiran per Kompetensi
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Breakdown kehadiran balita dan ibu hamil berdasarkan kompetensi
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kehadiran Balita per Kompetensi */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Balita per Kompetensi
            </h3>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              Total: {kehadiranKompetensi.balita.total_hadir}
            </span>
          </div>
          <div className="space-y-3">
            {kehadiranKompetensi.balita.detail.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-indigo-50 p-4 transition hover:shadow-md dark:bg-indigo-900/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-dark dark:text-white">
                      {item.kompetensi}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Jumlah balita yang dilayani
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {item.jumlah}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {((item.jumlah / kehadiranKompetensi.balita.total_hadir) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-indigo-200 dark:bg-indigo-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    style={{
                      width: `${(item.jumlah / kehadiranKompetensi.balita.total_hadir) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kehadiran Ibu Hamil per Kompetensi */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Ibu Hamil per Kompetensi
            </h3>
            <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
              Total: {kehadiranKompetensi.ibu_hamil.total_hadir}
            </span>
          </div>
          <div className="space-y-3">
            {kehadiranKompetensi.ibu_hamil.detail.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-pink-50 p-4 transition hover:shadow-md dark:bg-pink-900/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-dark dark:text-white">
                      {item.kompetensi}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Jumlah ibu hamil yang dilayani
                    </p>
                    {item.aktivitas_kader && item.aktivitas_kader.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Aktivitas Kader:
                        </p>
                        <ul className="mt-1 space-y-1">
                          {item.aktivitas_kader.slice(0, 3).map((aktivitas: string, idx: number) => (
                            <li key={idx} className="flex items-start text-xs text-gray-600 dark:text-gray-400">
                              <span className="mr-1 text-pink-500">•</span>
                              {aktivitas}
                            </li>
                          ))}
                          {item.aktivitas_kader.length > 3 && (
                            <li className="text-xs text-gray-500 dark:text-gray-500">
                              +{item.aktivitas_kader.length - 3} aktivitas lainnya
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      {item.jumlah}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {((item.jumlah / kehadiranKompetensi.ibu_hamil.total_hadir) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-pink-200 dark:bg-pink-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600"
                    style={{
                      width: `${(item.jumlah / kehadiranKompetensi.ibu_hamil.total_hadir) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistikKehadiranKompetensi;
