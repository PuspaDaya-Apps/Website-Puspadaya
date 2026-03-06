"use client";
import React, { useState, useMemo } from "react";
import { CriticalChild } from "@/types/dashboard-kepala-desa";

interface CriticalChildrenListProps {
  children: CriticalChild[];
}

const CriticalChildrenList: React.FC<CriticalChildrenListProps> = ({
  children,
}) => {
  const [filterPosyandu, setFilterPosyandu] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedPosyandu, setExpandedPosyandu] = useState<string | null>(null);

  // Get unique posyandu names for filter
  const posyanduList = useMemo(() => {
    return Array.from(new Set(children.map((c) => c.posyandu_nama)));
  }, [children]);

  // Group children by posyandu and sort by priority
  const groupedByPosyandu = useMemo(() => {
    const groups: Record<string, CriticalChild[]> = {};

    children.forEach((child) => {
      if (!groups[child.posyandu_nama]) {
        groups[child.posyandu_nama] = [];
      }
      groups[child.posyandu_nama].push(child);
    });

    // Sort each group by priority
    Object.keys(groups).forEach((posyandu) => {
      groups[posyandu].sort((a, b) => {
        const priorityOrder = {
          "Sangat Tinggi": 0,
          "Tinggi": 1,
          "Sedang": 2,
        };
        return priorityOrder[a.prioritas] - priorityOrder[b.prioritas];
      });
    });

    return groups;
  }, [children]);

  // Filter children
  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      const matchPosyandu =
        filterPosyandu === "all" || child.posyandu_nama === filterPosyandu;
      const matchStatus =
        filterStatus === "all" ||
        child.status_gizi === filterStatus ||
        (filterStatus === "stunting" && child.status_stunting === "Stunting");
      return matchPosyandu && matchStatus;
    });
  }, [children, filterPosyandu, filterStatus]);

  // Sort by priority
  const sortedChildren = [...filteredChildren].sort((a, b) => {
    const priorityOrder: Record<string, number> = {
      "Sangat Tinggi": 0,
      "Tinggi": 1,
      "Sedang": 2,
    };
    return (priorityOrder[a.prioritas] || 3) - (priorityOrder[b.prioritas] || 3);
  });

  // Get priority color
  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case "Sangat Tinggi":
        return "bg-red-500";
      case "Tinggi":
        return "bg-orange-500";
      case "Sedang":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get status badge color
  const getStatusColor = (status_gizi: string) => {
    switch (status_gizi) {
      case "Gizi Buruk":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Gizi Kurang":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "Gizi Baik":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Gizi Lebih":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  // Calculate stats
  const stats = {
    total: children.length,
    gizi_buruk: children.filter((c) => c.status_gizi === "Gizi Buruk").length,
    gizi_kurang: children.filter((c) => c.status_gizi === "Gizi Kurang").length,
    stunting: children.filter((c) => c.status_stunting === "Stunting").length,
    prioritas_tinggi: children.filter(
      (c) => c.prioritas === "Sangat Tinggi" || c.prioritas === "Tinggi"
    ).length,
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-dark dark:text-white">
            Daftar Anak dengan Gizi Buruk & Stunting
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Prioritas penanganan berdasarkan status gizi dan stunting
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
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

          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="Gizi Buruk">Gizi Buruk</option>
            <option value="Gizi Kurang">Gizi Kurang</option>
            <option value="stunting">Stunting</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.gizi_buruk}
          </p>
          <p className="text-xs text-red-700 dark:text-red-300">Gizi Buruk</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-3 text-center dark:bg-orange-900/20">
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.gizi_kurang}
          </p>
          <p className="text-xs text-orange-700 dark:text-orange-300">
            Gizi Kurang
          </p>
        </div>
        <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-900/20">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.stunting}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300">Stunting</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-3 text-center dark:bg-purple-900/20">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.prioritas_tinggi}
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            Prioritas Tinggi
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.total}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">Total</p>
        </div>
      </div>

      {/* List by Posyandu */}
      <div className="space-y-4">
        {Object.entries(groupedByPosyandu).map(([posyandu, posyanduChildren]) => {
          const isExpanded = expandedPosyandu === posyandu;
          const displayChildren = isExpanded
            ? posyanduChildren
            : posyanduChildren.slice(0, 5);

          return (
            <div
              key={posyandu}
              className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Posyandu Header */}
              <div
                className="flex cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 dark:bg-gray-800"
                onClick={() =>
                  setExpandedPosyandu(isExpanded ? null : posyandu)
                }
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <h3 className="font-semibold text-dark dark:text-white">
                    {posyandu}
                  </h3>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {posyanduChildren.length} anak
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    Gizi Buruk:{" "}
                    {
                      posyanduChildren.filter(
                        (c) => c.status_gizi === "Gizi Buruk"
                      ).length
                    }
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Stunting:{" "}
                    {
                      posyanduChildren.filter(
                        (c) => c.status_stunting === "Stunting"
                      ).length
                    }
                  </span>
                </div>
              </div>

              {/* Children List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayChildren.map((child) => (
                  <div
                    key={child.id}
                    className="grid grid-cols-1 gap-3 p-4 transition hover:bg-gray-50 dark:hover:bg-gray-800 sm:grid-cols-12"
                  >
                    {/* Priority Indicator */}
                    <div className="flex items-center gap-2 sm:col-span-1">
                      <div
                        className={`h-3 w-3 rounded-full ${getPriorityColor(
                          child.prioritas
                        )}`}
                      />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {child.prioritas}
                      </span>
                    </div>

                    {/* Child Info */}
                    <div className="sm:col-span-3">
                      <p className="font-medium text-dark dark:text-white">
                        {child.nama_anak}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {child.usia_bulan} bulan • {child.jenis_kelamin}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Ibu: {child.nama_ibu}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="sm:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {child.dusun}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(child.tanggal_pengukuran)}
                      </p>
                    </div>

                    {/* Measurements */}
                    <div className="sm:col-span-2">
                      <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>BB: {child.berat_badan}kg</span>
                        <span>TB: {child.tinggi_badan}cm</span>
                      </div>
                    </div>

                    {/* Status Badges + WhatsApp Action */}
                    <div className="flex flex-col items-end gap-2 sm:col-span-4">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            child.status_gizi
                          )}`}
                        >
                          {child.status_gizi}
                        </span>
                        {child.status_stunting === "Stunting" && (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Stunting
                          </span>
                        )}
                        {child.status_wasting === "Wasting" && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Wasting
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {!isExpanded && posyanduChildren.length > 5 && (
                <div className="border-t border-gray-200 bg-gray-50 p-2 text-center dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={() => setExpandedPosyandu(posyandu)}
                    className="text-sm font-medium text-primary hover:text-blue-700"
                  >
                    Lihat {posyanduChildren.length - 5} anak lainnya
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredChildren.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Tidak ada data anak dengan kriteria yang dipilih
          </p>
        </div>
      )}
    </div>
  );
};

export default CriticalChildrenList;
