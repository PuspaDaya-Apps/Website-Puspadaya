"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTrenDataPosyandu } from "@/app/api/dashboard-kepala-desa";
import { PosyanduItem } from "@/types/dashboard-kepala-desa";
import { TrenDataPosyanduItem } from "@/types/kepala-desa";
import { createPosyanduDetailToken } from "@/utils/posyanduDetailToken";

interface PosyanduOverviewProps {
  posyanduList: PosyanduItem[];
  selectedPosyandu: PosyanduItem | null;
  onSelectPosyandu: (posyandu: PosyanduItem) => void;
  onTotalPosyanduChange?: (total: number) => void;
  bulan: number;
  tahun: number;
  bulanLabel?: string;
  refreshSignal?: number;
}

const PosyanduOverview: React.FC<PosyanduOverviewProps> = ({
  selectedPosyandu,
  onSelectPosyandu,
  onTotalPosyanduChange,
  bulan,
  tahun,
  bulanLabel,
  refreshSignal,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [trenData, setTrenData] = useState<TrenDataPosyanduItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const itemsPerPage = 12;
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  useEffect(() => {
    let isMounted = true;

    const loadTrenData = async () => {
      const hasExistingData = trenData !== null;

      if (!hasExistingData) {
        setIsLoading(true);
        setErrorMessage(null);
      }

      const result = await fetchTrenDataPosyandu({ bulan, tahun });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setTrenData(result.data.posyandu ?? []);
        setErrorMessage(null);
      } else if (!hasExistingData) {
        setErrorMessage("Gagal memuat tren data posyandu");
      }

      if (!hasExistingData) {
        setIsLoading(false);
      }
    };

    loadTrenData();

    return () => {
      isMounted = false;
    };
  }, [bulan, tahun, refreshSignal]);

  const mergedPosyanduList = useMemo(() => {
    return (
      trenData?.map((item, index) => ({
        id: item.id ?? `${item.nama}-${index + 1}`.replace(/\s+/g, "-").toLowerCase(),
        nama_posyandu: item.nama,
        nama_dusun: item.dusun,
        nama_kecamatan: "",
        nama_kabupaten_kota: "",
        total_balita: item.balita ?? 0,
        total_ibu_hamil: item.ibu_hamil ?? 0,
        total_kader: item.kader ?? 0,
        kehadiran_balita_bulan_ini: 0,
        kehadiran_ibu_hamil_bulan_ini: 0,
        status_stunting: 0,
        status_gizi_buruk: 0,
        persentase_kehadiran: item.kehadiran ?? 0,
        skor_kinerja: item.skor ?? 0,
        kategori_kinerja: item.kategori ?? "-",
        ranking: item.ranking ?? 0,
        last_updated: "",
      })) ?? []
    );
  }, [trenData]);

  useEffect(() => {
    onTotalPosyanduChange?.(mergedPosyanduList.length);
  }, [mergedPosyanduList.length, onTotalPosyanduChange]);

  // Filter posyandu based on search
  const filteredPosyandu = mergedPosyanduList.filter(
    (posyandu) =>
      posyandu.nama_posyandu.toLowerCase().includes(normalizedSearchTerm) ||
      posyandu.nama_dusun.toLowerCase().includes(normalizedSearchTerm) ||
      posyandu.nama_kecamatan.toLowerCase().includes(normalizedSearchTerm) ||
      posyandu.nama_kabupaten_kota.toLowerCase().includes(normalizedSearchTerm)
  );

  const totalPages = Math.max(1, Math.ceil(filteredPosyandu.length / itemsPerPage));
  const paginatedPosyandu = filteredPosyandu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, bulan, tahun]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Get status color
  const getStatusColor = (persentase: number) => {
    if (persentase >= 80) return "bg-emerald-500";
    if (persentase >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRankingBadgeColor = (kategori: string) => {
    switch (kategori) {
      case "Sangat Baik":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Baik":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Cukup":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "-":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const openPosyanduDetail = (posyandu: PosyanduItem) => {
    onSelectPosyandu(posyandu);
    const token = createPosyanduDetailToken({
      idPosyandu: posyandu.id,
      bulan,
      tahun,
    });
    router.push(`/monitoring/posyandu/${token}`);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Daftar Posyandu
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {bulanLabel ? `Periode ${bulanLabel} ${tahun}` : `Periode bulan ${bulan} ${tahun}`}
              {" "}
              {selectedPosyandu
                ? `Terpilih: ${selectedPosyandu.nama_posyandu}`
                : "Klik posyandu untuk melihat detail"}
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg p-2 transition ${
              viewMode === "grid"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            }`}
            aria-label="Grid view"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-lg p-2 transition ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            }`}
            aria-label="List view"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama posyandu atau dusun..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2 rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="Hapus pencarian"
            >
              Hapus
            </button>
          )}
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Memuat tren data posyandu...
        </div>
      ) : errorMessage ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && filteredPosyandu.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Tidak ada posyandu yang cocok dengan pencarian.
        </div>
      )}

      {/* Posyandu Grid/List */}
      {!isLoading && filteredPosyandu.length > 0 && viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedPosyandu.map((posyandu) => (
            <button
              key={posyandu.id}
              type="button"
              onClick={() => openPosyanduDetail(posyandu)}
              className={`group block w-full cursor-pointer rounded-xl border-2 p-4 text-left transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedPosyandu?.id === posyandu.id
                  ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <div className="mb-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-dark transition-colors group-hover:text-primary dark:text-white">
                    {posyandu.nama_posyandu}
                  </h3>
                  {/* <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    Rank #{posyandu.ranking}
                  </span> */}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Lokasi">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{posyandu.nama_dusun}</span>
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Balita">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Balita</span>
                  </div>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{posyandu.total_balita}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Ibu Hamil">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ibu Hamil</span>
                  </div>
                  <span className="font-medium text-pink-600 dark:text-pink-400">{posyandu.total_ibu_hamil}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Kader">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Kader</span>
                  </div>
                  <span className="font-medium text-purple-600 dark:text-purple-400">{posyandu.total_kader}</span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Skor</span>
                  <span className="font-semibold text-dark dark:text-white">{posyandu.skor_kinerja}</span>
                </div> */}
                {/* <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Kategori</span>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getRankingBadgeColor(posyandu.kategori_kinerja)}`}>
                    {posyandu.kategori_kinerja}
                  </span>
                </div> */}
              </div>

              {/* Progress Bar Kehadiran */}
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Persentase Kehadiran</span>
                  <span className="font-medium text-dark dark:text-white">
                    {posyandu.persentase_kehadiran}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full rounded-full ${getStatusColor(posyandu.persentase_kehadiran)} transition-all duration-300 group-hover:scale-x-105`}
                    style={{ width: `${posyandu.persentase_kehadiran}%` }}
                  />
                </div>
              </div>

              {/* Click hint */}
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Detail Posyandu</span>
              </div>
            </button>
          ))}
        </div>
      ) : !isLoading && filteredPosyandu.length > 0 ? (
        /* List View */
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Posyandu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Lokasi
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Balita
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Ibu Hamil
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Kader
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Kehadiran
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Skor
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Kategori
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Ranking
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedPosyandu.map((posyandu) => (
                <tr
                  key={posyandu.id}
                  className={`cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedPosyandu?.id === posyandu.id
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : ""
                  }`}
                  onClick={() => onSelectPosyandu(posyandu)}
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openPosyanduDetail(posyandu);
                      }}
                      className="font-medium text-primary hover:underline dark:text-blue-400"
                    >
                      {posyandu.nama_posyandu}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {posyandu.nama_dusun}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                    {posyandu.total_balita}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                    {posyandu.total_ibu_hamil}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                    {posyandu.total_kader}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-full rounded-full ${getStatusColor(posyandu.persentase_kehadiran)}`}
                          style={{ width: `${posyandu.persentase_kehadiran}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-dark dark:text-white">
                        {posyandu.persentase_kehadiran}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-dark dark:text-white">
                    {posyandu.skor_kinerja}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getRankingBadgeColor(posyandu.kategori_kinerja)}`}>
                      {posyandu.kategori_kinerja}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-dark dark:text-white">
                    #{posyandu.ranking}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Result count */}
      {!isLoading && (
        <div className="mt-4 flex flex-col items-center gap-3 text-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Menampilkan {paginatedPosyandu.length} dari {filteredPosyandu.length} posyandu
          </div>

          {filteredPosyandu.length > itemsPerPage && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-dark transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-white"
              >
                Sebelumnya
              </button>

              <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-dark dark:bg-gray-800 dark:text-white">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-dark transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-white"
              >
                Berikutnya
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PosyanduOverview;
