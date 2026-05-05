"use client";
import React, { useEffect, useMemo, useState } from "react";
import { fetchStatistikSkdn } from "@/app/api/dashboard-kepala-desa";
import { StatistikSkdnData } from "@/types/kepala-desa";
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
  S: number;
  K: number;
  D: number;
  N: number;
  total: number;
  persentase_kenaikan_bb: number;
  persentase_kenaikan_bb_sesuai_kbm?: number;
}

interface SKDNBarChartProps {
  skdnData: SKDNData;
  bulan: number;
  tahun: number;
  bulanLabel?: string;
}

const SKDNBarChart: React.FC<SKDNBarChartProps> = ({
  bulan,
  tahun,
  bulanLabel,
}) => {
  const [apiData, setApiData] = useState<StatistikSkdnData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setApiData(null);

      const result = await fetchStatistikSkdn({ bulan, tahun });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setApiData(result.data);
      } else {
        setErrorMessage("Gagal memuat statistik SKDN");
      }

      setIsLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [bulan, tahun]);

  const displayData = useMemo(() => {
    const jumlah = apiData?.skdn.jumlah;
    const indikator = apiData?.skdn.indikator;

    return {
      S: jumlah?.sasaran_balita ?? 0,
      K: jumlah?.kunjungan ?? 0,
      D: jumlah?.ditimbang ?? 0,
      N: jumlah?.naik_bb ?? 0,
      total: jumlah?.sasaran_balita ?? 0,
      persentase_kenaikan_bb: indikator?.kenaikan_bb_persen ?? 0,
      persentase_kenaikan_bb_sesuai_kbm:
        indikator?.kenaikan_bb_sesuai_kbm_persen ?? 0,
    };
  }, [apiData]);

  const chartData = [
    {
      nama: "Semua Balita (S)",
      nilai: displayData.S,
      warna: "#3B82F6",
      deskripsi: "Total balita di wilayah (0-59 bulan)",
    },
    {
      nama: "Kunjung (K)",
      nilai: displayData.K,
      warna: "#10B981",
      deskripsi: "Balita yang datang ke posyandu",
    },
    {
      nama: "Ditimbang (D)",
      nilai: displayData.D,
      warna: "#F59E0B",
      deskripsi: "Balita yang ditimbang berat badan",
    },
    {
      nama: "Naik BB (N)",
      nilai: displayData.N,
      warna: "#EF4444",
      deskripsi: "Balita yang naik berat badan",
    },
  ];

  const persentaseKenaikan = displayData.persentase_kenaikan_bb || 0;
  const persentaseKenaikanSesuaiKbm =
    displayData.persentase_kenaikan_bb_sesuai_kbm || 0;

  const riskClass = (value: number) =>
    value >= 80
      ? "bg-emerald-100 dark:bg-emerald-900/30"
      : value >= 60
      ? "bg-amber-100 dark:bg-amber-900/30"
      : "bg-rose-100 dark:bg-rose-900/30";

  const textClass = (value: number) =>
    value >= 80
      ? "text-emerald-700 dark:text-emerald-400"
      : value >= 60
      ? "text-amber-700 dark:text-amber-400"
      : "text-rose-700 dark:text-rose-400";

  const title = bulanLabel
    ? `Statistik SKDN - ${bulanLabel} ${tahun}`
    : `Statistik SKDN - bulan ${bulan} ${tahun}`;

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Statistik SKDN
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {title}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-stretch gap-3">
          <div
            className={`flex w-36 flex-col justify-between rounded-lg px-4 py-3 ${riskClass(
              persentaseKenaikan
            )}`}
          >
            <div>
              <p className={`text-xs font-medium ${textClass(persentaseKenaikan)}`}>
                Kenaikan BB
              </p>
            </div>
            <p
              className={`mt-2 text-2xl font-bold ${textClass(
                persentaseKenaikan
              )}`}
            >
              {persentaseKenaikan.toFixed(1)}%
            </p>
          </div>

          <div
            className={`flex w-36 flex-col justify-between rounded-lg px-4 py-3 ${riskClass(
              persentaseKenaikanSesuaiKbm
            )}`}
          >
            <div>
              <p
                className={`text-xs font-medium ${textClass(
                  persentaseKenaikanSesuaiKbm
                )}`}
              >
                Kenaikan BB
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Sesuai KBM
              </p>
            </div>
            <p
              className={`mt-2 text-2xl font-bold ${textClass(
                persentaseKenaikanSesuaiKbm
              )}`}
            >
              {persentaseKenaikanSesuaiKbm.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Memuat statistik SKDN...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

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
                value: "Jumlah Balita",
                position: "bottom",
                fill: "#374151",
                fontSize: 14,
                fontWeight: 600,
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
              formatter={(value: number, _name: string, props: any) => [
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.deskripsi}
              </p>
              <p className="mt-1 text-lg font-bold" style={{ color: item.warna }}>
                {item.nilai} balita
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/10 dark:to-indigo-900/10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cakupan Penimbangan (D/S)
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {displayData.S > 0
                ? ((displayData.D / displayData.S) * 100).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Target: &ge;80% untuk Posyandu Purnama/Mandiri
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cakupan Kunjungan (K/S)
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {displayData.S > 0
                ? ((displayData.K / displayData.S) * 100).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Target: &ge;50% untuk kinerja baik
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKDNBarChart;
