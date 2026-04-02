"use client";
import React, { useMemo } from "react";
import { MonthlyTrendData, StatusGiziTrendData, IbuHamilBeresikoTrendData } from "@/types/dashboard-kepala-desa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceSectionProps {
  trendData: MonthlyTrendData[];
  statusGiziTrend: StatusGiziTrendData[];
  ibuHamilBeresikoTrend: IbuHamilBeresikoTrendData[];
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  trendData,
  statusGiziTrend,
  ibuHamilBeresikoTrend,
}) => {
  // Get latest values
  const latestBalita = trendData[trendData.length - 1]?.balita || 0;
  const latestIbuHamil = trendData[trendData.length - 1]?.ibu_hamil || 0;
  const latestStuntingPendek = statusGiziTrend[statusGiziTrend.length - 1]?.stunting_pendek || 0;
  const latestStuntingSangatPendek = statusGiziTrend[statusGiziTrend.length - 1]?.stunting_sangat_pendek || 0;
  const latestWasting = statusGiziTrend[statusGiziTrend.length - 1]?.wasting || 0;
  const latestUnderweight = statusGiziTrend[statusGiziTrend.length - 1]?.underweight || 0;
  const latestKEK = ibuHamilBeresikoTrend[ibuHamilBeresikoTrend.length - 1]?.kek || 0;

  // Calculate totals for status gizi
  const totalStatusGizi = latestStuntingPendek + latestStuntingSangatPendek + latestWasting + latestUnderweight;

  // Transform data for charts
  const combinedTrendData = useMemo(() => {
    return trendData.map((item) => ({
      name: item.bulan,
      balita: item.balita,
      ibuHamil: item.ibu_hamil,
    }));
  }, [trendData]);

  const statusGiziChartData = useMemo(() => {
    return statusGiziTrend.map((item) => ({
      name: item.bulan,
      stuntingPendek: item.stunting_pendek,
      stuntingSangatPendek: item.stunting_sangat_pendek,
      wasting: item.wasting,
      underweight: item.underweight,
    }));
  }, [statusGiziTrend]);

  const ibuHamilBeresikoChartData = useMemo(() => {
    return ibuHamilBeresikoTrend.map((item) => ({
      name: item.bulan,
      kek: item.kek,
    }));
  }, [ibuHamilBeresikoTrend]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-white p-3 shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
          <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Tren Data
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Analisis perkembangan dan pola data kesehatan wilayah Anda
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tren Kehadiran Balita */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark dark:text-white">
                  Tren Kehadiran Balita
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Data 12 bulan terakhir</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hari Ini</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {latestBalita.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="balita"
                  name="Balita"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tren Kehadiran Ibu Hamil */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-600">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark dark:text-white">
                  Tren Kehadiran Ibu Hamil
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Data 12 bulan terakhir</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hari Ini</p>
              <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
                {latestIbuHamil.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="ibuHamil"
                  name="Ibu Hamil"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tren Status Gizi Balita */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark dark:text-white">
                  Tren Status Gizi Balita
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Data 12 bulan terakhir</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hari Ini</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{totalStatusGizi}</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statusGiziChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={50}
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="stuntingPendek"
                  name="Stunting Pendek"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="stuntingSangatPendek"
                  name="Sangat Pendek"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="wasting"
                  name="Wasting"
                  stroke="#eab308"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="underweight"
                  name="Underweight"
                  stroke="#d97706"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tren Jumlah Ibu Hamil Beresiko */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-600">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark dark:text-white">
                  Tren Ibu Hamil KEK
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Data 12 bulan terakhir</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hari Ini</p>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{latestKEK}</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ibuHamilBeresikoChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="kek"
                  name="KEK"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
