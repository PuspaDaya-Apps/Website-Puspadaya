"use client";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

interface DurasiJarakAgregatProps {
  durasiJarak: {
    total_durasi_kerja_posyandu: number;
    total_durasi_kunjungan_rumah: number;
    total_jarak_kunjungan_rumah: number;
    rata_rata_durasi_posyandu: number;
    rata_rata_durasi_kunjungan: number;
    rata_rata_jarak: number;
  };
}

const DurasiJarakAgregat: React.FC<DurasiJarakAgregatProps> = ({ durasiJarak }) => {
  // Sample monthly trend data for duration (12 months)
  const durationData = useMemo(() => [
    { bulan: "Jan", kerjaPosyandu: 18, kunjunganRumah: 12 },
    { bulan: "Feb", kerjaPosyandu: 20, kunjunganRumah: 14 },
    { bulan: "Mar", kerjaPosyandu: 22, kunjunganRumah: 15 },
    { bulan: "Apr", kerjaPosyandu: 21, kunjunganRumah: 16 },
    { bulan: "Mei", kerjaPosyandu: 24, kunjunganRumah: 18 },
    { bulan: "Jun", kerjaPosyandu: 23, kunjunganRumah: 17 },
    { bulan: "Jul", kerjaPosyandu: 25, kunjunganRumah: 19 },
    { bulan: "Agt", kerjaPosyandu: 26, kunjunganRumah: 20 },
    { bulan: "Sep", kerjaPosyandu: 24, kunjunganRumah: 18 },
    { bulan: "Okt", kerjaPosyandu: 27, kunjunganRumah: 21 },
    { bulan: "Nov", kerjaPosyandu: 28, kunjunganRumah: 22 },
    { bulan: "Des", kerjaPosyandu: durasiJarak.total_durasi_kerja_posyandu, kunjunganRumah: durasiJarak.total_durasi_kunjungan_rumah },
  ], [durasiJarak]);

  // Sample monthly trend data for distance (12 months)
  const distanceData = useMemo(() => [
    { bulan: "Jan", jarak: 145 },
    { bulan: "Feb", jarak: 158 },
    { bulan: "Mar", jarak: 162 },
    { bulan: "Apr", jarak: 170 },
    { bulan: "Mei", jarak: 175 },
    { bulan: "Jun", jarak: 168 },
    { bulan: "Jul", jarak: 182 },
    { bulan: "Agt", jarak: 188 },
    { bulan: "Sep", jarak: 176 },
    { bulan: "Okt", jarak: 195 },
    { bulan: "Nov", jarak: 202 },
    { bulan: "Des", jarak: durasiJarak.total_jarak_kunjungan_rumah },
  ], [durasiJarak]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label, unit }: any) => {
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
              <span className="font-medium text-gray-900">{entry.value} {unit}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-dark dark:text-white">
              Durasi Kerja Posyandu
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tren kerja posyandu, kunjungan rumah, dan jarak tempuh kader
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Kerja Posyandu</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {durasiJarak.total_durasi_kerja_posyandu} jam
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Kunjungan Rumah</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
              {durasiJarak.total_durasi_kunjungan_rumah} jam
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Jarak Tempuh</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
              {durasiJarak.total_jarak_kunjungan_rumah} km
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Durasi Kerja Chart */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Median Durasi Kerja (Jam)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={(props) => <CustomTooltip {...props} unit="jam" />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="kerjaPosyandu"
                  name="Kerja Posyandu"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="kunjunganRumah"
                  name="Kunjungan Rumah"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jarak Tempuh Chart */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Median Jarak Tempuh (Km)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={distanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={(props) => <CustomTooltip {...props} unit="km" />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="jarak"
                  name="Jarak Tempuh"
                  stroke="#ec4899"
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

export default DurasiJarakAgregat;
