"use client";
import React from "react";
import { DurasiJarakAgregat } from "@/types/dashboard-kepala-desa";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  LabelList,
} from "recharts";

interface DurasiJarakAgregatProps {
  durasiJarak: DurasiJarakAgregat;
}

const DurasiJarakAgregat: React.FC<DurasiJarakAgregatProps> = ({ durasiJarak }) => {
  // Data untuk Chart
  const chartData = [
    {
      name: "Kerja Posyandu",
      value: durasiJarak.total_durasi_kerja_posyandu,
      unit: "jam",
      color: "#3b82f6",
    },
    {
      name: "Kunjungan Rumah",
      value: durasiJarak.total_durasi_kunjungan_rumah,
      unit: "jam",
      color: "#8b5cf6",
    },
    {
      name: "Jarak Tempuh",
      value: durasiJarak.total_jarak_kunjungan_rumah,
      unit: "km",
      color: "#ec4899",
    },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
          <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Durasi Kerja dan Jarak Tempuh (Agregat Tim)
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total waktu dan jarak yang ditempuh semua kader
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info Summary */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-lg bg-blue-50 p-4 transition hover:shadow-md dark:bg-blue-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-blue-700 dark:text-blue-300">
                  Durasi Kerja di Posyandu
                </h3>
                <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {durasiJarak.total_durasi_kerja_posyandu} jam
                </p>
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  Rata-rata: {durasiJarak.rata_rata_durasi_posyandu.toFixed(1)} jam/kader
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-violet-50 p-4 transition hover:shadow-md dark:bg-violet-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-800">
                <svg className="h-6 w-6 text-violet-600 dark:text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-violet-700 dark:text-violet-300">
                  Durasi Kunjungan Rumah
                </h3>
                <p className="mt-1 text-2xl font-bold text-violet-900 dark:text-violet-100">
                  {durasiJarak.total_durasi_kunjungan_rumah} jam
                </p>
                <p className="mt-2 text-sm text-violet-600 dark:text-violet-400">
                  Rata-rata: {durasiJarak.rata_rata_durasi_kunjungan.toFixed(1)} jam/kader
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-pink-50 p-4 transition hover:shadow-md dark:bg-pink-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-800">
                <svg className="h-6 w-6 text-pink-600 dark:text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-pink-700 dark:text-pink-300">
                  Jarak Total Kunjungan Rumah
                </h3>
                <p className="mt-1 text-2xl font-bold text-pink-900 dark:text-pink-100">
                  {durasiJarak.total_jarak_kunjungan_rumah} km
                </p>
                <p className="mt-2 text-sm text-pink-600 dark:text-pink-400">
                  Rata-rata: {durasiJarak.rata_rata_jarak.toFixed(1)} km/kader
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Visual */}
        <div className="flex h-80 flex-col justify-between lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
              <Tooltip
                formatter={(value: number, _: string, props: any) => [
                  `${value} ${props.payload.unit}`,
                  "",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" name="" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(label: any) => `${label} ${chartData[0].unit}`}
                  fill="#374151"
                  fontSize={12}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DurasiJarakAgregat;
