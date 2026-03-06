"use client";
import React from "react";
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

export interface SKDNData {
  S: number; // Semua Balita (total balita di wilayah)
  K: number; // Kunjung (balita yang datang)
  D: number; // Ditimbang (balita yang ditimbang)
  N: number; // Naik BB (balita yang naik berat badan)
  total: number;
  persentase_kenaikan_bb: number;
}

interface SKDNBarChartProps {
  skdnData: SKDNData;
}

const SKDNBarChart: React.FC<SKDNBarChartProps> = ({ skdnData }) => {
  // Data untuk Bar Chart
  const chartData = [
    {
      nama: "Semua Balita (S)",
      nilai: skdnData.S,
      warna: "#3B82F6", // blue-500
      deskripsi: "Total balita di wilayah (0-59 bulan)",
    },
    {
      nama: "Kunjung (K)",
      nilai: skdnData.K,
      warna: "#10B981", // green-500
      deskripsi: "Balita yang datang ke posyandu",
    },
    {
      nama: "Ditimbang (D)",
      nilai: skdnData.D,
      warna: "#F59E0B", // yellow-500
      deskripsi: "Balita yang ditimbang berat badan",
    },
    {
      nama: "Naik BB (N)",
      nilai: skdnData.N,
      warna: "#EF4444", // red-500
      deskripsi: "Balita yang naik berat badan",
    },
  ];

  // Hitung total dari data
  const total = skdnData.total || chartData.reduce((sum, item) => sum + item.nilai, 0);
  const persentaseKenaikan = skdnData.persentase_kenaikan_bb || 0;

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Statistik SKDN
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Indikator Kinerja Posyandu (S-K-D-N)
            </p>
          </div>
        </div>
        
        {/* Badge Persentase Kenaikan BB */}
        <div className={`rounded-lg px-4 py-2 ${
          persentaseKenaikan >= 80
            ? "bg-green-100 dark:bg-green-900/30"
            : persentaseKenaikan >= 60
            ? "bg-yellow-100 dark:bg-yellow-900/30"
            : "bg-red-100 dark:bg-red-900/30"
        }`}>
          <p className={`text-sm font-medium ${
            persentaseKenaikan >= 80
              ? "text-green-700 dark:text-green-400"
              : persentaseKenaikan >= 60
              ? "text-yellow-700 dark:text-yellow-400"
              : "text-red-700 dark:text-red-400"
          }`}>
            Kenaikan BB Sesuai KBM
          </p>
          <p className={`text-2xl font-bold ${
            persentaseKenaikan >= 80
              ? "text-green-600 dark:text-green-400"
              : persentaseKenaikan >= 60
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-red-600 dark:text-red-400"
          }`}>
            {persentaseKenaikan.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
          <p className="text-xs text-gray-600 dark:text-gray-400">Semua (S)</p>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{skdnData.S}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
          <p className="text-xs text-gray-600 dark:text-gray-400">Kunjung (K)</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{skdnData.K}</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
          <p className="text-xs text-gray-600 dark:text-gray-400">Ditimbang (D)</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{skdnData.D}</p>
        </div>
        <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-xs text-gray-600 dark:text-gray-400">Naik BB (N)</p>
          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{skdnData.N}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{ 
                value: 'Jumlah Balita', 
                position: 'bottom',
                fill: '#374151',
                fontSize: 14,
                fontWeight: 600
              }}
            />
            <YAxis
              type="category"
              dataKey="nama"
              stroke="#6b7280"
              tick={{ fill: "#374151", fontSize: 11, fontWeight: 500 }}
              width={130}
            />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value} balita`,
                props.payload.nama,
              ]}
              labelFormatter={(label) => `Kategori: ${label}`}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="nilai" radius={[0, 4, 4, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.warna} />
              ))}
              <LabelList
                dataKey="nilai"
                position="right"
                fill="#374151"
                fontSize={12}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Keterangan */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${item.warna}20` }}
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: item.warna }}
              />
            </div>
            <div>
              <p className="font-medium text-dark dark:text-white">{item.nama}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.deskripsi}</p>
              <p className="mt-1 text-lg font-bold" style={{ color: item.warna }}>
                {item.nilai} balita
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/10 dark:to-indigo-900/10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cakupan Penimbangan (D/S)
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {skdnData.S > 0 ? ((skdnData.D / skdnData.S) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Target: ≥50% untuk Posyandu Purnama/Mandiri
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cakupan Kunjungan (K/S)
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {skdnData.S > 0 ? ((skdnData.K / skdnData.S) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Target: ≥50% untuk kinerja baik
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Persentase Kenaikan BB (N/D)
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {skdnData.D > 0 ? ((skdnData.N / skdnData.D) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Balita yang naik BB dari yang ditimbang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKDNBarChart;
