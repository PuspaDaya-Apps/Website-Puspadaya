"use client";
import React, { useState } from "react";
import { RecentActivity as RecentActivityType } from "@/types/dashboard-kepala-desa";

interface RecentActivityTableProps {
  activities: RecentActivityType[];
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  activities,
}) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(10);

  // Get activity type icon and color
  const getActivityInfo = (type: string) => {
    switch (type) {
      case "pengukuran_balita":
        return {
          icon: (
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
          color: "bg-blue-500",
          label: "Pengukuran Balita",
        };
      case "pengukuran_ibu_hamil":
        return {
          icon: (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          ),
          color: "bg-pink-500",
          label: "Pengukuran Ibu Hamil",
        };
      case "kuesioner":
        return {
          icon: (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          color: "bg-amber-500",
          label: "Kuesioner",
        };
      case "laporan":
        return {
          icon: (
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
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          color: "bg-emerald-500",
          label: "Laporan",
        };
      default:
        return {
          icon: (
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color: "bg-gray-500",
          label: "Lainnya",
        };
    }
  };

  // Format date to Indonesian locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    if (filterType === "all") return true;
    return activity.activity_type === filterType;
  });

  // Get unique activity types for filter
  const activityTypes = Array.from(
    new Set(activities.map((a) => a.activity_type))
  );

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-dark dark:text-white">
            Aktivitas Terbaru
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Riwayat aktivitas dari semua posyandu
          </p>
        </div>

        {/* Filter Dropdown */}
        <select
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Semua Aktivitas</option>
          {activityTypes.map((type) => (
            <option key={type} value={type}>
              {getActivityInfo(type).label}
            </option>
          ))}
        </select>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.slice(0, visibleCount).map((activity, index) => {
          const activityInfo = getActivityInfo(activity.activity_type);

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              {/* Icon */}
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${activityInfo.color} text-white`}
              >
                {activityInfo.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-dark dark:text-white">
                      {activity.description}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{activity.posyandu_nama}</span>{" "}
                      • Kader: {activity.kader_nama}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(activity.tanggal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Tidak ada aktivitas untuk ditampilkan
          </p>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredActivities.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivityTable;
