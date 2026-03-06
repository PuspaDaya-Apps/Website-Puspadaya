"use client";
import React, { useState, useMemo } from "react";
import { PosyanduItem } from "@/types/dashboard-kepala-desa";

interface PosyanduSelectorProps {
  posyanduList: PosyanduItem[];
  selectedPosyandu: PosyanduItem | null;
  onSelectPosyandu: (posyandu: PosyanduItem) => void;
}

const PosyanduSelector: React.FC<PosyanduSelectorProps> = ({
  posyanduList,
  selectedPosyandu,
  onSelectPosyandu,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique kecamatan for filter
  const kecamatanList = useMemo(() => {
    const unique = Array.from(
      new Set(posyanduList.map((p) => p.nama_kecamatan))
    );
    return ["all", ...unique];
  }, [posyanduList]);

  // Filter posyandu based on search and kecamatan
  const filteredPosyandu = useMemo(() => {
    return posyanduList.filter((posyandu) => {
      const matchSearch =
        posyandu.nama_posyandu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        posyandu.nama_dusun.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKecamatan =
        filterKecamatan === "all" ||
        posyandu.nama_kecamatan === filterKecamatan;
      return matchSearch && matchKecamatan;
    });
  }, [posyanduList, searchTerm, filterKecamatan]);

  // Get status color
  const getStatusColor = (persentase: number) => {
    if (persentase >= 80) return "bg-emerald-500";
    if (persentase >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusLabel = (persentase: number) => {
    if (persentase >= 80) return "Sangat Aktif";
    if (persentase >= 60) return "Aktif";
    return "Kurang Aktif";
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Pilih Posyandu
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {selectedPosyandu
              ? `Terpilih: ${selectedPosyandu.nama_posyandu}`
              : "Silakan pilih posyandu untuk melihat detail"}
          </p>
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
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
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
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama posyandu atau dusun..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Kecamatan Filter */}
        <select
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
          value={filterKecamatan}
          onChange={(e) => setFilterKecamatan(e.target.value)}
        >
          {kecamatanList.map((kec) => (
            <option key={kec} value={kec}>
              {kec === "all"
                ? "Semua Kecamatan"
                : kec}
            </option>
          ))}
        </select>
      </div>

      {/* Posyandu Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosyandu.map((posyandu) => (
            <div
              key={posyandu.id}
              onClick={() => {
                onSelectPosyandu(posyandu);
                setIsOpen(false);
              }}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                selectedPosyandu?.id === posyandu.id
                  ? "border-primary bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold text-dark dark:text-white">
                  {posyandu.nama_posyandu}
                </h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium text-white ${getStatusColor(
                    posyandu.persentase_kehadiran
                  )}`}
                >
                  {getStatusLabel(posyandu.persentase_kehadiran)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {posyandu.nama_dusun}
                </p>
                <p className="flex items-center justify-between">
                  <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Balita:</span>
                  <span className="font-medium">{posyandu.total_balita}</span>
                </p>
                <p className="flex items-center justify-between">
                  <svg className="h-4 w-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Ibu Hamil:</span>
                  <span className="font-medium">{posyandu.total_ibu_hamil}</span>
                </p>
                <p className="flex items-center justify-between">
                  <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Kader:</span>
                  <span className="font-medium">{posyandu.total_kader}</span>
                </p>
              </div>

              {/* Progress Bar Kehadiran */}
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Kehadiran
                  </span>
                  <span className="font-medium text-dark dark:text-white">
                    {posyandu.persentase_kehadiran}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full rounded-full ${getStatusColor(
                      posyandu.persentase_kehadiran
                    )}`}
                    style={{ width: `${posyandu.persentase_kehadiran}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPosyandu.map((posyandu) => (
                <tr
                  key={posyandu.id}
                  onClick={() => {
                    onSelectPosyandu(posyandu);
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedPosyandu?.id === posyandu.id
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-dark dark:text-white">
                    {posyandu.nama_posyandu}
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
                          className={`h-full rounded-full ${getStatusColor(
                            posyandu.persentase_kehadiran
                          )}`}
                          style={{
                            width: `${posyandu.persentase_kehadiran}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-dark dark:text-white">
                        {posyandu.persentase_kehadiran}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium text-white ${getStatusColor(
                        posyandu.persentase_kehadiran
                      )}`}
                    >
                      {getStatusLabel(posyandu.persentase_kehadiran)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Result count */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Menampilkan {filteredPosyandu.length} dari {posyanduList.length}{" "}
        posyandu
      </div>
    </div>
  );
};

export default PosyanduSelector;
