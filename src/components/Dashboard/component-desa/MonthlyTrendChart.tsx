"use client";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { MonthlyTrendData } from "@/types/dashboard-kepala-desa";

interface MonthlyTrendChartProps {
  trendData: MonthlyTrendData[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ trendData }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-dark dark:text-white">
          Tren Kehadiran Bulanan
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Grafik kehadiran balita, ibu hamil, dan kader selama 6 bulan terakhir
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorBalita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3C50E0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3C50E0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorIbuHamil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F23030" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F23030" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorKader" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22AD5C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22AD5C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="bulan"
              stroke="#6b7280"
              tick={{ fill: "#6b7280" }}
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
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="balita"
              name="👶 Balita"
              stroke="#3C50E0"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorBalita)"
            />
            <Area
              type="monotone"
              dataKey="ibu_hamil"
              name="Ibu Hamil"
              stroke="#F23030"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIbuHamil)"
            />
            <Area
              type="monotone"
              dataKey="kader"
              name="Kader"
              stroke="#22AD5C"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorKader)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rata-rata Balita
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(
              trendData.reduce((acc, curr) => acc + curr.balita, 0) /
                trendData.length
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rata-rata Ibu Hamil
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {Math.round(
              trendData.reduce((acc, curr) => acc + curr.ibu_hamil, 0) /
                trendData.length
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rata-rata Kader
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {Math.round(
              trendData.reduce((acc, curr) => acc + curr.kader, 0) /
                trendData.length
            )}
          </p>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <h3 className="mb-2 text-sm font-semibold text-dark dark:text-white">
          Analisis Tren
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {(() => {
            const latest = trendData[trendData.length - 1];
            const previous = trendData[trendData.length - 2];
            const balitaChange = latest.balita - previous.balita;
            const ibuHamilChange = latest.ibu_hamil - previous.ibu_hamil;

            return (
              <>
                <div className="flex justify-between">
                  <span>Balita (vs bulan lalu):</span>
                  <span
                    className={`font-medium ${
                      balitaChange >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {balitaChange >= 0 ? "+" : ""}
                    {balitaChange}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ibu Hamil (vs bulan lalu):</span>
                  <span
                    className={`font-medium ${
                      ibuHamilChange >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {ibuHamilChange >= 0 ? "+" : ""}
                    {ibuHamilChange}
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;
