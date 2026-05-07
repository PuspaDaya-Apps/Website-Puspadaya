"use client";
import React, { useEffect, useMemo, useState } from "react";
import { fetchDurasiKerjaPosyandu } from "@/app/api/dashboard-kepala-desa";
import { DurasiKerjaPosyanduData } from "@/types/kepala-desa";
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
  bulan?: number;
  tahun?: number;
  bulanLabel?: string;
  refreshSignal?: number;
}

const zeroMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agt",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const DurasiJarakAgregat: React.FC<DurasiJarakAgregatProps> = ({
  bulan,
  tahun,
  bulanLabel,
  refreshSignal,
}) => {
  const hasPeriodFilter = bulan != null && tahun != null;
  const [apiData, setApiData] = useState<DurasiKerjaPosyanduData | null>(null);
  const [isLoading, setIsLoading] = useState(hasPeriodFilter);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hasPeriodFilter) {
      setApiData(null);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      const hasExistingData = apiData !== null;

      if (!hasExistingData) {
        setIsLoading(true);
        setErrorMessage(null);
      }

      const result = await fetchDurasiKerjaPosyandu({ bulan, tahun });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setApiData(result.data);
        setErrorMessage(null);
      } else if (!hasExistingData) {
        setErrorMessage("Gagal memuat durasi kerja posyandu");
      }

      if (!hasExistingData) {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [bulan, tahun, hasPeriodFilter, refreshSignal]);

  const displayRingkasan = {
    total_durasi_kerja_posyandu: apiData?.ringkasan?.kerja_posyandu_jam ?? 0,
    total_durasi_kunjungan_rumah: apiData?.ringkasan?.kunjungan_rumah_jam ?? 0,
    total_jarak_kunjungan_rumah: apiData?.ringkasan?.jarak_tempuh_km ?? 0,
    rata_rata_durasi_posyandu: apiData?.ringkasan?.kerja_posyandu_jam ?? 0,
    rata_rata_durasi_kunjungan: apiData?.ringkasan?.kunjungan_rumah_jam ?? 0,
    rata_rata_jarak: apiData?.ringkasan?.jarak_tempuh_km ?? 0,
  };
  const isPeriodDataReady = !hasPeriodFilter || !!apiData;

  const durationData = useMemo(() => {
    const tren = apiData?.tren.durasi_kerja;

    if (tren && tren.length > 0) {
      return tren.map((item) => ({
        bulan: item.bulan,
        kerjaPosyandu: item.kerja_posyandu,
        kunjunganRumah: item.kunjungan_rumah,
      }));
    }

    return zeroMonths.map((bulan) => ({
      bulan,
      kerjaPosyandu: 0,
      kunjunganRumah: 0,
    }));
  }, [apiData]);

  const distanceData = useMemo(() => {
    const tren = apiData?.tren.jarak_tempuh;

    if (tren && tren.length > 0) {
      return tren.map((item) => ({
        bulan: item.bulan,
        jarak: item.km,
      }));
    }

    return zeroMonths.map((bulan) => ({
      bulan,
      jarak: 0,
    }));
  }, [apiData]);

  const customTooltip = ({ active, payload, label, unit }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="mb-2 font-semibold text-gray-700">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {entry.value} {unit}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              {bulan != null && tahun != null
                ? bulanLabel
                  ? ` - ${bulanLabel} ${tahun}`
                  : ` - bulan ${bulan} ${tahun}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Kerja Posyandu</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {isPeriodDataReady ? `${displayRingkasan.total_durasi_kerja_posyandu ?? 0} jam` : "Memuat..."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Kunjungan Rumah</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
              {isPeriodDataReady ? `${displayRingkasan.total_durasi_kunjungan_rumah ?? 0} jam` : "Memuat..."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Jarak Tempuh</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
              {isPeriodDataReady ? `${displayRingkasan.total_jarak_kunjungan_rumah ?? 0} km` : "Memuat..."}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Memuat durasi kerja posyandu...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Median Durasi Kerja (Jam)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip content={(props) => <>{customTooltip({ ...props, unit: "jam" })}</>} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="kerjaPosyandu"
                  name="Kerja Posyandu"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="kunjunganRumah"
                  name="Kunjungan Rumah"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Median Jarak Tempuh (Km)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={distanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip content={(props) => <>{customTooltip({ ...props, unit: "km" })}</>} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="jarak"
                  name="Jarak Tempuh"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
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
