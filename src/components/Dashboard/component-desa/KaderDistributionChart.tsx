"use client";
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { KaderWorkload } from "@/types/dashboard-kepala-desa";

interface KaderDistributionChartProps {
  workloadData: KaderWorkload[];
}

const KaderDistributionChart: React.FC<KaderDistributionChartProps> = ({
  workloadData,
}) => {
  // Group by posyandu
  const byPosyandu = React.useMemo(() => {
    const groups: Record<string, number> = {};
    workloadData.forEach((kader) => {
      if (!groups[kader.posyandu_nama]) {
        groups[kader.posyandu_nama] = 0;
      }
      groups[kader.posyandu_nama]++;
    });

    return Object.entries(groups).map(([name, value]) => ({
      name,
      value,
    }));
  }, [workloadData]);

  // Group by role
  const byRole = React.useMemo(() => {
    const groups: Record<string, number> = {};
    workloadData.forEach((kader) => {
      if (!groups[kader.role]) {
        groups[kader.role] = 0;
      }
      groups[kader.role]++;
    });

    return Object.entries(groups).map(([name, value]) => ({
      name,
      value,
    }));
  }, [workloadData]);

  // Active vs Non-active
  const byStatus = React.useMemo(() => {
    const aktif = workloadData.filter((k) => k.status === "aktif").length;
    const nonAktif = workloadData.filter((k) => k.status === "non_aktif")
      .length;

    return [
      { name: "Aktif", value: aktif, color: "#22AD5C" },
      { name: "Non Aktif", value: nonAktif, color: "#9CA3AF" },
    ];
  }, [workloadData]);

  // Top 5 posyandu with most kader
  const topPosyandu = [...byPosyandu]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = [
    "#3C50E0",
    "#F23030",
    "#22AD5C",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#F97316",
  ];

  const pieColors = [
    "#3C50E0",
    "#F23030",
    "#22AD5C",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#F97316",
    "#14B8A6",
    "#A855F7",
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Kader per Posyandu (Pie Chart) */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Distribusi Kader per Posyandu
        </h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byPosyandu}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`
                }
              >
                {byPosyandu.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {byPosyandu.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Kader by Role (Bar Chart) */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Distribusi Kader per Role
        </h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={byRole}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" name="Jumlah Kader" fill="#3C50E0" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
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

        {/* Stats */}
        <div className="mt-4 space-y-2">
          {byRole.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(item.value / workloadData.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-dark dark:text-white">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Kader (Active/Non-active) */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Status Keaktifan Kader
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Pie Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="col-span-2 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Kader Aktif
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {byStatus[0].value}
                  </p>
                </div>
              </div>
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((byStatus[0].value / workloadData.length) * 100)}%
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Kader Non Aktif
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {byStatus[1].value}
                  </p>
                </div>
              </div>
              <span className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {Math.round((byStatus[1].value / workloadData.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Posyandu with Most Kader */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Top 5 Posyandu dengan Kader Terbanyak
        </h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topPosyandu}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
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
              />
              <Bar dataKey="value" name="Jumlah Kader" fill="#3C50E0" radius={[0, 4, 4, 0]}>
                <LabelList
                  dataKey="value"
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
      </div>
    </div>
  );
};

export default KaderDistributionChart;
