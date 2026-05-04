"use client";
import React, { useEffect, useMemo, useState } from "react";
import { fetchLogAktivitasKader } from "@/app/api/dashboard-kepala-desa";
import { RecentActivity as RecentActivityType } from "@/types/dashboard-kepala-desa";
import { LogAktivitasKaderData } from "@/types/kepala-desa";

interface RecentActivityTableProps {
  bulan: number;
  tahun: number;
  bulanLabel?: string;
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  bulan,
  tahun,
}) => {
  const [apiData, setApiData] = useState<LogAktivitasKaderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setApiData(null);

      const result = await fetchLogAktivitasKader({ bulan, tahun });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setApiData(result.data);
      } else {
        setErrorMessage("Gagal memuat data aktivitas terbaru");
      }

      setIsLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [bulan, tahun]);

  const activities = useMemo<RecentActivityType[]>(() => {
    const apiActivities = apiData?.aktivitas ?? [];

    return apiActivities.map((item, index) => ({
      id: `${item.tanggal}-${item.posyandu}-${index}`,
      posyandu_nama: item.posyandu,
      activity_type: item.aktivitas.replace(/\s+/g, "_").toLowerCase() as RecentActivityType["activity_type"],
      description: item.deskripsi,
      tanggal: item.tanggal,
      kader_nama: item.kader,
    }));
  }, [apiData]);

  const getActivityInfo = (type: string) => {
    switch (type) {
      case "pengukuran_balita":
        return {
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Tanggal
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Posyandu
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Aktivitas
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Deskripsi
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Kader
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            <tr>
              <td className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400" colSpan={5}>
                Memuat data aktivitas terbaru...
              </td>
            </tr>
          ) : errorMessage ? (
            <tr>
              <td className="px-4 py-6 text-sm text-red-700 dark:text-red-300" colSpan={5}>
                {errorMessage}
              </td>
            </tr>
          ) : activities.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400" colSpan={5}>
                Tidak ada aktivitas untuk ditampilkan
              </td>
            </tr>
          ) : (
            activities.slice(0, 10).map((activity) => {
              const activityInfo = getActivityInfo(activity.activity_type);

              return (
                <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(activity.tanggal)}
                  </td>
                  <td className="px-4 py-3 font-medium text-dark dark:text-white">
                    {activity.posyandu_nama}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        activity.activity_type === "pengukuran_balita"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : activity.activity_type === "pengukuran_ibu_hamil"
                          ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                          : activity.activity_type === "kuesioner"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : activity.activity_type === "laporan"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {activityInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {activity.kader_nama}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
