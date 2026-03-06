"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { KaderWorkload } from "@/types/dashboard-kepala-desa";

interface KaderManagementProps {
  workloadData: KaderWorkload[];
}

// Helper function untuk generate rekomendasi berdasarkan data
const generateRecommendations = (highWorkloadKader: KaderWorkload[]) => {
  const recommendations: string[] = [];
  
  if (highWorkloadKader.length === 0) return recommendations;

  // Hitung rata-rata beban kader tinggi
  const avgBebanTinggi = highWorkloadKader.reduce((sum, k) => sum + k.skor_beban_kerja, 0) / highWorkloadKader.length;
  
  // Hitung total balita yang bisa diredistribusi
  const totalBalitaOverload = highWorkloadKader.reduce((sum, k) => sum + k.total_balita_dibina, 0);
  const avgBalitaPerKader = Math.round(totalBalitaOverload / highWorkloadKader.length);
  
  // Rekomendasi 1: Redistribusi (jika ada kader dengan beban > 80)
  const kaderSangatOverload = highWorkloadKader.filter(k => k.skor_beban_kerja >= 80);
  if (kaderSangatOverload.length > 0) {
    const balitaToRedistribute = Math.round(avgBalitaPerKader * 0.25); // 25% dari rata-rata
    recommendations.push(`Redistribusi ${balitaToRedistribute}-${Math.round(avgBalitaPerKader * 0.3)} balita dari ${kaderSangatOverload.length} kader overload`);
  }

  // Rekomendasi 2: Rekrutmen (jika rasio kader:balita > 1:6)
  const totalBalita = highWorkloadKader.reduce((sum, k) => sum + k.total_balita_dibina, 0);
  const totalKader = highWorkloadKader.length;
  const ratio = totalBalita / totalKader;
  if (ratio > 5) {
    const kaderDibutuhkan = Math.ceil((totalBalita / 5) - totalKader);
    recommendations.push(`Rekrut ${kaderDibutuhkan} kader pendamping baru (rasio saat ini 1:${Math.round(ratio)})`);
  }

  // Rekomendasi 3: Kunjungan bergantian (jika ada kader dengan jarak > 30km)
  const kaderJarakJauh = highWorkloadKader.filter(k => k.jarak_kunjungan > 30);
  if (kaderJarakJauh.length > 0) {
    recommendations.push(`Optimalkan rute kunjungan untuk ${kaderJarakJauh.length} kader dengan jarak >30km`);
  }

  // Rekomendasi 4: Cuti/istirahat (jika jam kerja > 50 jam/minggu)
  const kaderLembur = highWorkloadKader.filter(k => (k.durasi_kerja_posyandu + k.durasi_kunjungan_rumah) > 50);
  if (kaderLembur.length > 0) {
    recommendations.push(`Wajibkan istirahat untuk ${kaderLembur.length} kader dengan jam kerja >50 jam/minggu`);
  }

  // Rekomendasi 5: Training (jika ada kader dengan produktivitas rendah)
  const kaderProduktivitasRendah = highWorkloadKader.filter(k => k.skor_beban_kerja < 60 && k.total_balita_dibina > 40);
  if (kaderProduktivitasRendah.length > 0) {
    recommendations.push(`Berikan training manajemen waktu untuk ${kaderProduktivitasRendah.length} kader`);
  }

  // Fallback jika tidak ada rekomendasi spesifik
  if (recommendations.length === 0) {
    recommendations.push("Monitor beban kerja kader secara berkala");
    recommendations.push("Pertahankan distribusi beban yang sudah baik");
  }

  return recommendations.slice(0, 4); // Max 4 rekomendasi
};

const KaderManagement: React.FC<KaderManagementProps> = ({ workloadData }) => {
  // Filter and sort kader by workload
  const highWorkloadKader = useMemo(() => {
    return workloadData
      .filter((k) => k.kategori_beban === "Tinggi")
      .sort((a, b) => b.skor_beban_kerja - a.skor_beban_kerja);
  }, [workloadData]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = workloadData.length;
    const avgWorkload = Math.round(
      workloadData.reduce((sum, k) => sum + k.skor_beban_kerja, 0) / total
    );
    const highCount = workloadData.filter((k) => k.kategori_beban === "Tinggi").length;
    const mediumCount = workloadData.filter((k) => k.kategori_beban === "Sedang").length;
    const lowCount = workloadData.filter((k) => k.kategori_beban === "Rendah").length;
    const totalJamKerja = workloadData.reduce((sum, k) => sum + k.durasi_kerja_posyandu + k.durasi_kunjungan_rumah, 0);
    const totalJarak = Math.round(workloadData.reduce((sum, k) => sum + k.jarak_kunjungan, 0));

    return { total, avgWorkload, highCount, mediumCount, lowCount, totalJamKerja, totalJarak };
  }, [workloadData]);

  // Get workload category color
  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case "Tinggi":
        return "bg-red-500";
      case "Sedang":
        return "bg-yellow-500";
      case "Rendah":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get workload score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600 dark:text-red-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
            <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Manajemen Kader
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Analisis beban kerja dan distribusi
            </p>
          </div>
        </div>
        <Link
          href="/monitoring/kader"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Lihat Detail Kader →
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg bg-violet-50 p-3 text-center dark:bg-violet-900/20">
          <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.total}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Kader</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.avgWorkload}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Rata-rata Beban</p>
        </div>
        <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.highCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Beban Tinggi</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-3 text-center dark:bg-yellow-900/20">
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mediumCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Beban Sedang</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.lowCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Beban Rendah</p>
        </div>
        <div className="rounded-lg bg-pink-50 p-3 text-center dark:bg-pink-900/20">
          <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.totalJarak}km</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Jarak</p>
        </div>
      </div>

      {/* High Workload Alert */}
      {highWorkloadKader.length > 0 && (
        <div className="mt-6 rounded-xl bg-red-50 p-5 dark:bg-red-900/20">
          <div className="mb-4 flex items-center gap-3">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                Kader dengan Beban Kerja Tinggi
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Perlu perhatian untuk mencegah burnout
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {highWorkloadKader.map((kader) => (
              <div
                key={kader.id}
                className="flex flex-col gap-3 rounded-lg bg-white p-4 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {kader.nama_kader.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-dark dark:text-white">
                      {kader.nama_kader}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {kader.posyandu_nama} • {kader.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {kader.total_balita_dibina} balita • {kader.total_ibu_hamil_dibina} ibu hamil
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(kader.skor_beban_kerja)}`}>
                      {kader.skor_beban_kerja}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">skor beban</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {kader.durasi_kerja_posyandu + kader.durasi_kunjungan_rumah} jam
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">total kerja</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-dark dark:text-white">
                      {kader.jarak_kunjungan} km
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">jarak</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Recommendations */}
          <div className="mt-4 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Rekomendasi Berdasarkan Data:
            </h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-amber-700 dark:text-amber-300">
              {generateRecommendations(highWorkloadKader).map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Workload Distribution Chart - Enhanced */}
      <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h3 className="mb-6 text-lg font-semibold text-dark dark:text-white">
          Distribusi Beban Kerja Kader
        </h3>
        
        {/* Progress Bars dengan Detail */}
        <div className="mb-6 space-y-4">
          {/* Beban Tinggi */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                <span className="text-sm font-medium text-dark dark:text-white">Beban Tinggi</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-red-600 dark:text-red-400">{stats.highCount}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({((stats.highCount / stats.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                style={{ width: `${(stats.highCount / stats.total) * 100}%` }}
              >
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Beban Sedang */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                <span className="text-sm font-medium text-dark dark:text-white">Beban Sedang</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.mediumCount}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({((stats.mediumCount / stats.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500"
                style={{ width: `${(stats.mediumCount / stats.total) * 100}%` }}
              >
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Beban Rendah */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                <span className="text-sm font-medium text-dark dark:text-white">Beban Rendah</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.lowCount}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({((stats.lowCount / stats.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${(stats.lowCount / stats.total) * 100}%` }}
              >
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards dengan Icon */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-4 text-center dark:from-red-900/20 dark:to-red-900/10">
            <div className="mb-2 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.highCount}</p>
            <p className="text-xs text-red-700 dark:text-red-300">Tinggi</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 text-center dark:from-yellow-900/20 dark:to-yellow-900/10">
            <div className="mb-2 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-white shadow-lg">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mediumCount}</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">Sedang</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 text-center dark:from-emerald-900/20 dark:to-emerald-900/10">
            <div className="mb-2 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.lowCount}</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Rendah</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaderManagement;
