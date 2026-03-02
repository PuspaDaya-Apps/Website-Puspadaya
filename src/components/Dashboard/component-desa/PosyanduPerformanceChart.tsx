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
import { PosyanduPerformance } from "@/types/dashboard-kepala-desa";

interface PosyanduPerformanceChartProps {
  performanceData: PosyanduPerformance[];
}

const PosyanduPerformanceChart: React.FC<PosyanduPerformanceChartProps> = ({
  performanceData,
}) => {
  // Sort by skor_kinerja descending
  const sortedData = [...performanceData].sort(
    (a, b) => b.skor_kinerja - a.skor_kinerja
  );

  // Get color based on category
  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case "Sangat Baik":
        return "#22AD5C"; // green
      case "Baik":
        return "#3C50E0"; // blue
      case "Cukup":
        return "#F59E0B"; // yellow/orange
      case "Kurang":
        return "#F23030"; // red
      default:
        return "#9CA3AF"; // gray
    }
  };

  const chartData = sortedData.map((item) => ({
    name: item.nama_posyandu.length > 15 
      ? item.nama_posyandu.substring(0, 15) + "..." 
      : item.nama_posyandu,
    fullName: item.nama_posyandu,
    skor: item.skor_kinerja,
    kehadiran: item.kehadiran,
    kategori: item.kategori,
    color: getCategoryColor(item.kategori),
  }));

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-dark dark:text-white">
          Kinerja Posyandu
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Peringkat posyandu berdasarkan skor kinerja keseluruhan
        </p>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#6b7280"
              tick={{ fill: "#6b7280" }}
            />
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
                  return [`${value}`, "Skor Kinerja"];
                }
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullName;
                }
                return label;
              }}
            />
            <Bar dataKey="skor" name="Skor Kinerja" radius={[0, 4, 4, 0]}>
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
          { label: "Sangat Baik", color: "#22AD5C" },
          { label: "Baik", color: "#3C50E0" },
          { label: "Cukup", color: "#F59E0B" },
          { label: "Kurang", color: "#F23030" },
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

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {performanceData.filter((p) => p.kategori === "Sangat Baik").length}
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Sangat Baik
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {performanceData.filter((p) => p.kategori === "Baik").length}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">Baik</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-900/20">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {performanceData.filter((p) => p.kategori === "Cukup").length}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300">Cukup</p>
        </div>
        <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {performanceData.filter((p) => p.kategori === "Kurang").length}
          </p>
          <p className="text-xs text-red-700 dark:text-red-300">Kurang</p>
        </div>
      </div>
    </div>
  );
};

export default PosyanduPerformanceChart;
