"use client";
import React, { useState } from "react";
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
import { KaderWorkload } from "@/types/dashboard-kepala-desa";

interface KaderWorkloadChartProps {
  workloadData: KaderWorkload[];
}

const KaderWorkloadChart: React.FC<KaderWorkloadChartProps> = ({
  workloadData,
}) => {
  const [sortBy, setSortBy] = useState<"skor" | "nama">("skor");
  const [filterStatus, setFilterStatus] = useState<"all" | "aktif" | "non_aktif">("all");

  // Filter and sort data
  const processedData = workloadData
    .filter((kader) => {
      if (filterStatus === "all") return true;
      return kader.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === "skor") return b.skor_beban_kerja - a.skor_beban_kerja;
      return a.nama_kader.localeCompare(b.nama_kader);
    })
    .slice(0, 15); // Show top 15

  // Get color based on workload category
  const getBebanColor = (kategori: string) => {
    switch (kategori) {
      case "Tinggi":
        return "#F23030"; // red
      case "Sedang":
        return "#F59E0B"; // amber/orange
      case "Rendah":
        return "#22AD5C"; // green
      default:
        return "#9CA3AF"; // gray
    }
  };

  const getBebanLabel = (skor: number) => {
    if (skor >= 80) return "Tinggi";
    if (skor >= 60) return "Sedang";
    return "Rendah";
  };

  const chartData = processedData.map((kader) => ({
    name: kader.nama_kader.length > 15 
      ? kader.nama_kader.substring(0, 15) + "..." 
      : kader.nama_kader,
    fullName: kader.nama_kader,
    skor: kader.skor_beban_kerja,
    posyandu: kader.posyandu_nama,
    kategori: getBebanLabel(kader.skor_beban_kerja),
    color: getBebanColor(getBebanLabel(kader.skor_beban_kerja)),
    durasi_posyandu: kader.durasi_kerja_posyandu,
    durasi_kunjungan: kader.durasi_kunjungan_rumah,
  }));

  // Calculate summary stats
  const avgWorkload = Math.round(
    workloadData.reduce((acc, k) => acc + k.skor_beban_kerja, 0) /
      workloadData.length
  );

  const highWorkloadCount = workloadData.filter((k) => k.skor_beban_kerja >= 80).length;
  const mediumWorkloadCount = workloadData.filter(
    (k) => k.skor_beban_kerja >= 60 && k.skor_beban_kerja < 80
  ).length;
  const lowWorkloadCount = workloadData.filter((k) => k.skor_beban_kerja < 60).length;

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-dark dark:text-white">
            Beban Kerja Kader
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Analisis beban kerja berdasarkan durasi dan jarak tempuh
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "skor" | "nama")}
          >
            <option value="skor">Urut: Skor</option>
            <option value="nama">Urut: Nama</option>
          </select>

          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "aktif" | "non_aktif")
            }
          >
            <option value="all">Semua Kader</option>
            <option value="aktif">Aktif</option>
            <option value="non_aktif">Non Aktif</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {workloadData.length}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">Total Kader</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-3 text-center dark:bg-purple-900/20">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {avgWorkload}
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            Rata-rata Beban
          </p>
        </div>
        <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {highWorkloadCount}
          </p>
          <p className="text-xs text-red-700 dark:text-red-300">Beban Tinggi</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {lowWorkloadCount}
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Beban Rendah
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 100]} stroke="#6b7280" tick={{ fill: "#6b7280" }} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number, name: string, props: any) => {
                if (name === "skor") {
                  return [`${value}`, "Skor Beban Kerja"];
                }
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `${payload[0].payload.fullName} - ${payload[0].payload.posyandu}`;
                }
                return label;
              }}
            />
            <Bar dataKey="skor" name="Skor Beban Kerja" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="skor"
                position="right"
                style={{
                  fill: "#111827",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {[
          { label: "Beban Tinggi (≥80)", color: "#F23030" },
          { label: "Beban Sedang (60-79)", color: "#F59E0B" },
          { label: "Beban Rendah (<60)", color: "#22AD5C" },
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Workload Distribution */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-dark dark:text-white">
          Distribusi Beban Kerja
        </h3>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Beban Tinggi
              </span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {highWorkloadCount} kader ({Math.round((highWorkloadCount / workloadData.length) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-red-500"
                style={{ width: `${(highWorkloadCount / workloadData.length) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Beban Sedang
              </span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {mediumWorkloadCount} kader ({Math.round((mediumWorkloadCount / workloadData.length) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${(mediumWorkloadCount / workloadData.length) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Beban Rendah
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {lowWorkloadCount} kader ({Math.round((lowWorkloadCount / workloadData.length) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${(lowWorkloadCount / workloadData.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaderWorkloadChart;
