"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { KaderWorkload } from "@/types/dashboard-kepala-desa";
import { kaderWorkloadData } from "@/data/dummy-dashboard-kepala-desa";

const KaderManagementPage: React.FC = () => {
  const [filterBeban, setFilterBeban] = useState<string>("all");
  const [filterPosyandu, setFilterPosyandu] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKader, setSelectedKader] = useState<KaderWorkload | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get unique posyandu names for filter
  const posyanduList = useMemo(() => {
    return Array.from(new Set(kaderWorkloadData.map((k) => k.posyandu_nama)));
  }, []);

  // Filter kader
  const filteredKader = useMemo(() => {
    return kaderWorkloadData.filter((kader) => {
      const matchBeban = filterBeban === "all" || kader.kategori_beban === filterBeban;
      const matchPosyandu = filterPosyandu === "all" || kader.posyandu_nama === filterPosyandu;
      const matchSearch =
        kader.nama_kader.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kader.posyandu_nama.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBeban && matchPosyandu && matchSearch;
    });
  }, [filterBeban, filterPosyandu, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = kaderWorkloadData.length;
    const avgWorkload = Math.round(
      kaderWorkloadData.reduce((sum, k) => sum + k.skor_beban_kerja, 0) / total
    );
    const highCount = kaderWorkloadData.filter((k) => k.kategori_beban === "Tinggi").length;
    const mediumCount = kaderWorkloadData.filter((k) => k.kategori_beban === "Sedang").length;
    const lowCount = kaderWorkloadData.filter((k) => k.kategori_beban === "Rendah").length;
    const totalJamKerja = kaderWorkloadData.reduce((sum, k) => sum + k.durasi_kerja_posyandu + k.durasi_kunjungan_rumah, 0);
    const totalJarak = Math.round(kaderWorkloadData.reduce((sum, k) => sum + k.jarak_kunjungan, 0));
    const totalBalitaDibina = kaderWorkloadData.reduce((sum, k) => sum + k.total_balita_dibina, 0);
    const totalIbuHamilDibina = kaderWorkloadData.reduce((sum, k) => sum + k.total_ibu_hamil_dibina, 0);

    return { total, avgWorkload, highCount, mediumCount, lowCount, totalJamKerja, totalJarak, totalBalitaDibina, totalIbuHamilDibina };
  }, []);

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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
              Manajemen Kader
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Analisis beban kerja dan distribusi kader posyandu
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-xl bg-violet-50 p-4 text-center dark:bg-violet-900/20">
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{stats.total}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Kader</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.avgWorkload}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Rata-rata Beban</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.highCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Beban Tinggi</p>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mediumCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Beban Sedang</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.lowCount}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Beban Rendah</p>
        </div>
        <div className="rounded-xl bg-pink-50 p-4 text-center dark:bg-pink-900/20">
          <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{stats.totalJamKerja}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Jam Kerja</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-900/20">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.totalJarak}km</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Jarak</p>
        </div>
        <div className="rounded-xl bg-teal-50 p-4 text-center dark:bg-teal-900/20">
          <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.totalBalitaDibina}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Balita Dibina</p>
        </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cari Kader
            </label>
            <input
              type="text"
              placeholder="Nama kader atau posyandu..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-9 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kategori Beban
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={filterBeban}
              onChange={(e) => setFilterBeban(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Posyandu
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={filterPosyandu}
              onChange={(e) => setFilterPosyandu(e.target.value)}
            >
              <option value="all">Semua Posyandu</option>
              {posyanduList.map((posyandu) => (
                <option key={posyandu} value={posyandu}>
                  {posyandu}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* High Workload Alert */}
      {stats.highCount > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="mb-4 rounded-xl border-2 border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div className="mb-4 flex items-center gap-3">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-300">
                  {stats.highCount} Kader dengan Beban Kerja Tinggi
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400">Perlu perhatian dan tindakan segera</p>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
              <h4 className="mb-3 font-semibold text-amber-800 dark:text-amber-300">Rekomendasi Tindakan:</h4>
              <ul className="grid grid-cols-1 gap-2 text-sm text-amber-700 dark:text-amber-300 sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Pertimbangkan redistribusi balita dari kader overload ke kader dengan beban rendah</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Rekrut 1-2 kader pendamping untuk posyandu dengan beban tinggi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Jadwalkan kunjungan rumah bergantian antar kader</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">4.</span>
                  <span>Optimalkan rute kunjungan untuk mengurangi jarak tempuh</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Kader List */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kader</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Posyandu</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Balita</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Ibu Hamil</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Jam Kerja</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Jarak</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Beban</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredKader.map((kader) => (
                <tr key={kader.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                        {kader.nama_kader.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-dark dark:text-white">{kader.nama_kader}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Status: {kader.status}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{kader.posyandu_nama}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {kader.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{kader.total_balita_dibina}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{kader.total_ibu_hamil_dibina}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                    {kader.durasi_kerja_posyandu + kader.durasi_kunjungan_rumah} jam
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{kader.jarak_kunjungan} km</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${getCategoryColor(kader.kategori_beban)}`}></div>
                      <span className={`text-sm font-medium ${
                        kader.kategori_beban === "Tinggi"
                          ? "text-red-600 dark:text-red-400"
                          : kader.kategori_beban === "Sedang"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {kader.kategori_beban}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedKader(kader);
                        setShowModal(true);
                      }}
                      className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredKader.length === 0 && (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Tidak ada data yang sesuai dengan filter</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedKader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-dark">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  {selectedKader.nama_kader.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-dark dark:text-white">{selectedKader.nama_kader}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedKader.role} • {selectedKader.posyandu_nama}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Workload Info */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Beban Kerja</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Kategori Beban</span>
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                      selectedKader.kategori_beban === "Tinggi"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : selectedKader.kategori_beban === "Sedang"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}>
                      {selectedKader.kategori_beban}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Skor Beban</span>
                    <span className={`text-xl font-bold ${getScoreColor(selectedKader.skor_beban_kerja)}`}>
                      {selectedKader.skor_beban_kerja}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="text-sm font-medium capitalize text-dark dark:text-white">{selectedKader.status}</span>
                  </div>
                </div>
              </div>

              {/* Assignment Info */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Tugas Pembinaan</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Balita</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedKader.total_balita_dibina}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Ibu Hamil</span>
                    <span className="text-xl font-bold text-pink-600 dark:text-pink-400">{selectedKader.total_ibu_hamil_dibina}</span>
                  </div>
                </div>
              </div>

              {/* Time Info */}
              <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Distribusi Waktu</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Kerja Posyandu</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedKader.durasi_kerja_posyandu} jam</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Kunjungan Rumah</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedKader.durasi_kunjungan_rumah} jam</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-emerald-200 pt-2 dark:border-emerald-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Total</span>
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                      {selectedKader.durasi_kerja_posyandu + selectedKader.durasi_kunjungan_rumah} jam
                    </span>
                  </div>
                </div>
              </div>

              {/* Distance Info */}
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Jarak Tempuh</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Kunjungan</span>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{selectedKader.jarak_kunjungan} km</span>
                </div>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Rata-rata {(selectedKader.jarak_kunjungan / (selectedKader.total_balita_dibina + selectedKader.total_ibu_hamil_dibina)).toFixed(1)} km per kunjungan
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaderManagementPage;
