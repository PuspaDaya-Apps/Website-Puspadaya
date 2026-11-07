"use client";
import React from "react";
import { useInformasiDataDesa } from "@/hooks/dashboard";

interface KeyMetricsProps {
  bulan: number;
  tahun: number;
  bulanLabel?: string;
}

type MetricColor =
  | "blue"
  | "emerald"
  | "pink"
  | "violet"
  | "amber"
  | "red"
  | "orange"
  | "green"
  | "cyan"
  | "rose";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: MetricColor;
}

// Setiap kelas ditulis utuh sebagai teks. Tailwind memindai kode sumber, jadi
// nama kelas yang dirakit saat runtime (mis. "text-".replace(...)) tidak pernah
// ikut digenerate dan elemennya tampil tanpa warna sama sekali.
const COLOR_CLASSES: Record<
  MetricColor,
  { bg: string; text: string; iconBg: string; dot: string }
> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-800",
    dot: "bg-blue-600 dark:bg-blue-400",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-800",
    dot: "bg-emerald-600 dark:bg-emerald-400",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/20",
    text: "text-pink-600 dark:text-pink-400",
    iconBg: "bg-pink-100 dark:bg-pink-800",
    dot: "bg-pink-600 dark:bg-pink-400",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-800",
    dot: "bg-violet-600 dark:bg-violet-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-800",
    dot: "bg-amber-600 dark:bg-amber-400",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-800",
    dot: "bg-red-600 dark:bg-red-400",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-800",
    dot: "bg-orange-600 dark:bg-orange-400",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-800",
    dot: "bg-green-600 dark:bg-green-400",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    text: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-100 dark:bg-cyan-800",
    dot: "bg-cyan-600 dark:bg-cyan-400",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-800",
    dot: "bg-rose-600 dark:bg-rose-400",
  },
};

// Di luar KeyMetrics: komponen yang didefinisikan di dalam body induknya akan
// menjadi tipe baru tiap render, sehingga React melepas lalu memasang ulang
// seluruh kartunya alih-alih memperbaruinya.
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  const warna = COLOR_CLASSES[color];

  return (
    <div className={`relative overflow-hidden rounded-xl ${warna.bg} p-5 transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${warna.text}`}>{value}</p>
            {subtitle && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${warna.iconBg} ${warna.text}`}
        >
          {icon}
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 ${warna.dot}`}
      />
    </div>
  );
};

const KeyMetrics: React.FC<KeyMetricsProps> = ({ bulan, tahun, bulanLabel }) => {
  const { data: informasiDataDesa, isError } = useInformasiDataDesa({ bulan, tahun });
  const data = informasiDataDesa ?? null;
  const errorMessage = isError ? "Gagal memuat informasi data desa" : null;

  const cards: MetricCardProps[] = [
    {
      title: "Total Posyandu",
      value: data?.ringkasan?.total_posyandu ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "blue",
    },
    {
      title: "Total Kader",
      value: data?.ringkasan?.total_kader ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "violet",
    },
    {
      title: "Bayi Baru Lahir",
      value: data?.ringkasan?.bayi_baru_lahir ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "cyan",
    },
    {
      title: "Total Balita",
      value: data?.ringkasan?.total_balita ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "emerald",
    },
    {
      title: "Kasus Stunting Pendek",
      value: data?.kasus_gizi?.stunting_pendek ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "red",
    },
    {
      title: "Kasus Stunting Sangat Pendek",
      value: data?.kasus_gizi?.stunting_sangat_pendek ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6 6" />
        </svg>
      ),
      color: "rose",
    },
    {
      title: "Kasus Wasting",
      value: data?.kasus_gizi?.wasting ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6 6" />
        </svg>
      ),
      color: "orange",
    },
    {
      title: "Kasus Underweight",
      value: data?.kasus_gizi?.underweight ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "amber",
    },
    {
      title: "Total Ibu Hamil",
      value: data?.ibu_hamil?.total ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "pink",
    },
    {
      title: "Ibu Hamil Anemia",
      value: data?.ibu_hamil?.anemia ?? 0,
      icon: (
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "rose",
    },
  ];


  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Informasi Data Desa
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Data utama untuk monitoring wilayah
              {bulanLabel ? ` - ${bulanLabel} ${tahun}` : ` - bulan ${bulan} ${tahun}`}
            </p>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default KeyMetrics;
