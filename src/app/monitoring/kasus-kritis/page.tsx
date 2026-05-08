 "use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchDataKasusKritis, fetchDataKasusKritisBalita, fetchDetailDataKasusKritis, type DashboardKepalaDesaQueryParams } from "@/app/api/dashboard-kinerja-kepala-desa";
import { KinerjaPosyanduKasusKritisData, KinerjaPosyanduKasusKritisDaftarPrioritasItem, KinerjaPosyanduDetailKasusKritisData, TrenDataPosyanduItem } from "@/types/kepala-desa";
import { fetchTrenDataPosyandu } from "@/app/api/dashboard-kepala-desa";
import { buildPageStateCacheKey, readPageStateCache, writePageStateCache } from "@/utils/pageStateCache";

interface CurrentUserLocation {
  kabupaten_kota?: { nama_kabupaten_kota?: string };
  desa_kelurahan?: { nama_desa_kelurahan?: string };
}

interface KasusKritisPageSnapshot {
  filterPosyanduId: string;
  filterStatusGizi: string;
  filterStatusPrioritas: string;
  searchTerm: string;
  currentPosyanduPage: number;
  currentPrioritasPage: number;
  posyanduOptions: TrenDataPosyanduItem[];
  apiData: KinerjaPosyanduKasusKritisData | null;
  daftarPrioritasData: KinerjaPosyanduKasusKritisDaftarPrioritasItem[] | null;
  selectedDetailData: KinerjaPosyanduDetailKasusKritisData | null;
}

type PosyanduCaseSummary = {
  posyandu_nama: string;
  total_balita: number;
  wasting_count: number;
  underweight_count: number;
  stunting_count: number;
  normal_count: number;
};

const InfoCard = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
    <div className="flex items-start gap-3">
      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Data Tidak Tersedia</p>
        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">{message}</p>
      </div>
    </div>
  </div>
);

const getLocation = (): Pick<DashboardKepalaDesaQueryParams, "kabupatenKota" | "desa"> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem("current_user");
    if (!raw) return {};
    const user = JSON.parse(raw) as CurrentUserLocation;
    return {
      kabupatenKota: user?.kabupaten_kota?.nama_kabupaten_kota,
      desa: user?.desa_kelurahan?.nama_desa_kelurahan,
    };
  } catch {
    return {};
  }
};

const KasusKritisPage: React.FC = () => {
  const [filterPosyanduId, setFilterPosyanduId] = useState<string>("");
  const [filterStatusGizi, setFilterStatusGizi] = useState<string>("");
  const [filterStatusPrioritas, setFilterStatusPrioritas] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPosyanduPage, setCurrentPosyanduPage] = useState(1);
  const [currentPrioritasPage, setCurrentPrioritasPage] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);
  const currentDate = new Date();
  const currentBulan = currentDate.getMonth() + 1;
  const currentTahun = currentDate.getFullYear();
  const pageCacheKey = useMemo(
    () =>
      buildPageStateCacheKey(
        "monitoring-kasus-kritis",
        `${currentBulan}-${currentTahun}-${filterPosyanduId}-${filterStatusGizi}-${filterStatusPrioritas}`
      ),
    [currentBulan, currentTahun, filterPosyanduId, filterStatusGizi, filterStatusPrioritas]
  );
  const cachedPageState = useMemo(
    () => readPageStateCache<KasusKritisPageSnapshot>(pageCacheKey),
    [pageCacheKey]
  );
  const [posyanduOptions, setPosyanduOptions] = useState<TrenDataPosyanduItem[]>(cachedPageState?.data.posyanduOptions ?? []);
  const [apiData, setApiData] = useState<KinerjaPosyanduKasusKritisData | null>(cachedPageState?.data.apiData ?? null);
  const [apiLoading, setApiLoading] = useState(!cachedPageState?.data.apiData);
  const [daftarPrioritasData, setDaftarPrioritasData] = useState<KinerjaPosyanduKasusKritisDaftarPrioritasItem[] | null>(cachedPageState?.data.daftarPrioritasData ?? null);
  const [daftarPrioritasLoading, setDaftarPrioritasLoading] = useState(!cachedPageState?.data.daftarPrioritasData);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState<KinerjaPosyanduDetailKasusKritisData | null>(cachedPageState?.data.selectedDetailData ?? null);
  const hasHydratedCacheRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const hasExistingData = apiData !== null;

      if (!hasExistingData) {
        setApiLoading(true);
      }

      const result = await fetchDataKasusKritisBalita({
        bulan: currentBulan,
        tahun: currentTahun,
        ...getLocation(),
      });
      if (!isMounted) return;
      if (result.successCode === 200 && result.data) {
        setApiData(result.data);
      } else if (!hasExistingData) {
        setApiData(null);
      }
      if (!hasExistingData) {
        setApiLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [currentBulan, currentTahun, refreshTick]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const hasExistingData = posyanduOptions.length > 0;
      const result = await fetchTrenDataPosyandu({ bulan: currentBulan, tahun: currentTahun });
      if (!isMounted) return;
      if (result.successCode === 200 && result.data?.posyandu) {
        setPosyanduOptions(result.data.posyandu.filter((p) => p.id));
      } else if (!hasExistingData) {
        setPosyanduOptions([]);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [currentBulan, currentTahun, refreshTick]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const hasExistingData = daftarPrioritasData !== null;
      if (!hasExistingData) {
        setDaftarPrioritasLoading(true);
      }

      const extraParams: Record<string, string> = {};
      if (filterPosyanduId) extraParams.id_posyandu = filterPosyanduId;
      if (filterStatusGizi) extraParams.status_gizi = filterStatusGizi;
      if (filterStatusPrioritas) extraParams.status_prioritas = filterStatusPrioritas;
      const result = await fetchDataKasusKritis({
        bulan: currentBulan,
        tahun: currentTahun,
        ...getLocation(),
        extraParams,
      });
      if (!isMounted) return;
      if (result.successCode === 200 && result.data?.daftar_prioritas) {
        setDaftarPrioritasData(result.data.daftar_prioritas);
      } else if (!hasExistingData) {
        setDaftarPrioritasData(null);
      }
      if (!hasExistingData) {
        setDaftarPrioritasLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [currentBulan, currentTahun, filterPosyanduId, filterStatusGizi, filterStatusPrioritas, refreshTick]);

  useEffect(() => {
    setCurrentPrioritasPage(1);
  }, [filterPosyanduId, filterStatusGizi, filterStatusPrioritas]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRefreshTick((value) => value + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const snapshot = cachedPageState?.data;
    if (!snapshot || hasHydratedCacheRef.current) {
      return;
    }

    hasHydratedCacheRef.current = true;
    setFilterPosyanduId(snapshot.filterPosyanduId);
    setFilterStatusGizi(snapshot.filterStatusGizi);
    setFilterStatusPrioritas(snapshot.filterStatusPrioritas);
    setSearchTerm(snapshot.searchTerm);
    setCurrentPosyanduPage(snapshot.currentPosyanduPage);
    setCurrentPrioritasPage(snapshot.currentPrioritasPage);
    setPosyanduOptions(snapshot.posyanduOptions ?? []);
    setApiData(snapshot.apiData ?? null);
    setDaftarPrioritasData(snapshot.daftarPrioritasData ?? null);
    setSelectedDetailData(snapshot.selectedDetailData ?? null);
    setApiLoading(snapshot.apiData == null);
    setDaftarPrioritasLoading(snapshot.daftarPrioritasData == null);
  }, [cachedPageState]);

  useEffect(() => {
    writePageStateCache<KasusKritisPageSnapshot>(pageCacheKey, {
      filterPosyanduId,
      filterStatusGizi,
      filterStatusPrioritas,
      searchTerm,
      currentPosyanduPage,
      currentPrioritasPage,
      posyanduOptions,
      apiData,
      daftarPrioritasData,
      selectedDetailData,
    });
  }, [
    pageCacheKey,
    filterPosyanduId,
    filterStatusGizi,
    filterStatusPrioritas,
    searchTerm,
    currentPosyanduPage,
    currentPrioritasPage,
    posyanduOptions,
    apiData,
    daftarPrioritasData,
    selectedDetailData,
  ]);

  const getDisplayStatusColor = (status: string) => {
    switch (status) {
      case "Wasting":    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Underweight": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "Stunting":   return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Normal":     return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:           return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case "Sangat Tinggi": return "bg-red-500";
      case "Tinggi":        return "bg-orange-500";
      case "Sedang":        return "bg-yellow-500";
      default:              return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDetailClick = async (idAnak: string) => {
    setShowDetailModal(true);
    setDetailLoading(true);
    setSelectedDetailData(null);
    const result = await fetchDetailDataKasusKritis({
      bulan: currentBulan,
      tahun: currentTahun,
      ...getLocation(),
      extraParams: { id_anak: idAnak },
    });
    if (result.successCode === 200 && result.data) {
      setSelectedDetailData(result.data);
    }
    setDetailLoading(false);
  };

  const filteredDaftarPrioritas = useMemo(() => {
    if (!daftarPrioritasData) return null;
    if (!searchTerm) return daftarPrioritasData;
    const q = searchTerm.toLowerCase();
    return daftarPrioritasData.filter(
      (item) =>
        item.anak.nama.toLowerCase().includes(q) ||
        item.anak.ibu.toLowerCase().includes(q) ||
        item.lokasi.dusun.toLowerCase().includes(q)
    );
  }, [daftarPrioritasData, searchTerm]);

  const stats = useMemo(() => {
    if (apiData?.ringkasan) {
      const r = apiData.ringkasan;
      return {
        total: r.total_kasus,
        wasting: r.wasting,
        underweight: r.underweight,
        stunting: r.stunting,
        sangat_tinggi: r.prioritas.sangat_tinggi,
        tinggi: r.prioritas.tinggi,
        sedang: r.prioritas.sedang,
      };
    }
    return { total: 0, wasting: 0, underweight: 0, stunting: 0, sangat_tinggi: 0, tinggi: 0, sedang: 0 };
  }, [apiData]);

  const perPosyanduStats = useMemo<PosyanduCaseSummary[]>(() => {
    if (apiData?.kasus_kritis && apiData.kasus_kritis.length > 0) {
      return apiData.kasus_kritis.map((item) => ({
        posyandu_nama: item.nama_posyandu,
        total_balita: item.total_anak,
        wasting_count: item.wasting,
        underweight_count: item.underweight,
        stunting_count: item.stunting,
        normal_count: item.normal,
      }));
    }
    return [];
  }, [apiData]);

  const itemsPerPosyanduPage = 10;
  const totalPosyanduPages = Math.max(1, Math.ceil(perPosyanduStats.length / itemsPerPosyanduPage));
  const safePosyanduPage = Math.min(currentPosyanduPage, totalPosyanduPages);
  const paginatedPerPosyanduStats = useMemo(() => {
    const startIndex = (safePosyanduPage - 1) * itemsPerPosyanduPage;
    return perPosyanduStats.slice(startIndex, startIndex + itemsPerPosyanduPage);
  }, [perPosyanduStats, safePosyanduPage]);

  useEffect(() => {
    setCurrentPosyanduPage(1);
  }, [apiData]);

  useEffect(() => {
    if (currentPosyanduPage > totalPosyanduPages) {
      setCurrentPosyanduPage(totalPosyanduPages);
    }
  }, [currentPosyanduPage, totalPosyanduPages]);

  const visibleStart = perPosyanduStats.length === 0 ? 0 : (safePosyanduPage - 1) * itemsPerPosyanduPage + 1;
  const visibleEnd = Math.min(safePosyanduPage * itemsPerPosyanduPage, perPosyanduStats.length);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPosyanduPages <= maxVisible) {
      for (let page = 1; page <= totalPosyanduPages; page += 1) {
        pages.push(page);
      }
      return pages;
    }

    pages.push(1);

    const left = Math.max(2, safePosyanduPage - 1);
    const right = Math.min(totalPosyanduPages - 1, safePosyanduPage + 1);

    if (left > 2) {
      pages.push("...");
    }

    for (let page = left; page <= right; page += 1) {
      pages.push(page);
    }

    if (right < totalPosyanduPages - 1) {
      pages.push("...");
    }

    pages.push(totalPosyanduPages);
    return pages;
  };

  const itemsPerPrioritasPage = 15;
  const totalPrioritasPages = Math.max(1, Math.ceil((filteredDaftarPrioritas?.length ?? 0) / itemsPerPrioritasPage));
  const safePrioritasPage = Math.min(currentPrioritasPage, totalPrioritasPages);
  const paginatedDaftarPrioritas = useMemo(() => {
    if (!filteredDaftarPrioritas) return null;
    const startIndex = (safePrioritasPage - 1) * itemsPerPrioritasPage;
    return filteredDaftarPrioritas.slice(startIndex, startIndex + itemsPerPrioritasPage);
  }, [filteredDaftarPrioritas, safePrioritasPage]);

  useEffect(() => {
    if (currentPrioritasPage > totalPrioritasPages) {
      setCurrentPrioritasPage(totalPrioritasPages);
    }
  }, [currentPrioritasPage, totalPrioritasPages]);

  const visiblePrioritasStart = filteredDaftarPrioritas && filteredDaftarPrioritas.length > 0
    ? (safePrioritasPage - 1) * itemsPerPrioritasPage + 1
    : 0;
  const visiblePrioritasEnd = Math.min(safePrioritasPage * itemsPerPrioritasPage, filteredDaftarPrioritas?.length ?? 0);

  const getPrioritasPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPrioritasPages <= maxVisible) {
      for (let page = 1; page <= totalPrioritasPages; page += 1) {
        pages.push(page);
      }
      return pages;
    }

    pages.push(1);

    const left = Math.max(2, safePrioritasPage - 1);
    const right = Math.min(totalPrioritasPages - 1, safePrioritasPage + 1);

    if (left > 2) {
      pages.push("...");
    }

    for (let page = left; page <= right; page += 1) {
      pages.push(page);
    }

    if (right < totalPrioritasPages - 1) {
      pages.push("...");
    }

    pages.push(totalPrioritasPages);
    return pages;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">Daftar Kasus Kritis</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Monitoring anak dengan wasting, underweight, dan stunting
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Total Kasus:</span>{" "}
              <span className="font-medium text-dark dark:text-white">{stats.total}</span>
            </div>
            <div className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white">
              <span className="font-medium">Stunting: {stats.stunting}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel per Posyandu */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-xl font-bold text-dark dark:text-white md:text-2xl">
          Data Kasus Kritis per Posyandu
        </h2>
        {apiLoading ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Memuat data...
          </div>
        ) : perPosyanduStats.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Posyandu</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Wasting</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Underweight</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Stunting</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Normal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedPerPosyanduStats.map((p, index) => (
                  <tr key={p.posyandu_nama} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {(safePosyanduPage - 1) * itemsPerPosyanduPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-dark dark:text-white">{p.posyandu_nama || "-"}</td>
                    <td className="px-4 py-3 text-center text-lg font-bold text-blue-600 dark:text-blue-400">{p.total_balita}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400">{p.wasting_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">{p.underweight_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">{p.stunting_count}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">{p.normal_count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Menampilkan {visibleStart}-{visibleEnd} dari {perPosyanduStats.length} posyandu
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPosyanduPage((page) => Math.max(1, page - 1))}
                  disabled={safePosyanduPage === 1}
                  className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Sebelumnya
                </button>
                <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:hidden">
                  {safePosyanduPage}/{totalPosyanduPages}
                </span>
                <div className="hidden flex-wrap items-center gap-2 sm:flex">
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-sm text-gray-500 dark:text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPosyanduPage(page)}
                        className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          page === safePosyanduPage
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPosyanduPage((page) => Math.min(totalPosyanduPages, page + 1))}
                  disabled={safePosyanduPage === totalPosyanduPages}
                  className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        ) : (
          <InfoCard message="Tidak ada data kasus kritis per posyandu untuk periode ini." />
        )}
      </div>

      {/* Stat Cards */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Kasus</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.wasting}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Wasting</p>
          </div>
          <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-900/20">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.underweight}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Underweight</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-900/20">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.stunting}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stunting</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.sangat_tinggi}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Prioritas Sangat Tinggi</p>
          </div>
          <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-900/20">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.tinggi}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Prioritas Tinggi</p>
          </div>
          <div className="rounded-xl bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.sedang}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Prioritas Sedang</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Cari</label>
            <input
              type="text"
              placeholder="Nama anak, ibu, atau dusun..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-9 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Posyandu</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={filterPosyanduId}
              onChange={(e) => setFilterPosyanduId(e.target.value)}
            >
              <option value="">Semua Posyandu</option>
              {posyanduOptions.map((p) => (
                <option key={p.id} value={p.id ?? ""}>{p.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Status Gizi</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={filterStatusGizi}
              onChange={(e) => setFilterStatusGizi(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="wasting">Wasting</option>
              <option value="underweight">Underweight</option>
              <option value="stunting">Stunting</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Prioritas</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={filterStatusPrioritas}
              onChange={(e) => setFilterStatusPrioritas(e.target.value)}
            >
              <option value="">Semua Prioritas</option>
              <option value="sangat_tinggi">Sangat Tinggi</option>
              <option value="tinggi">Tinggi</option>
              <option value="sedang">Sedang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Daftar Prioritas */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        {daftarPrioritasLoading ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Memuat data...
          </div>
        ) : filteredDaftarPrioritas && filteredDaftarPrioritas.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Prioritas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Anak</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Usia</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Posyandu/Dusun</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Pengukuran</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedDaftarPrioritas?.map((item) => (
                  <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${getPriorityColor(item.prioritas)}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.prioritas || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark dark:text-white">{item.anak.nama || "-"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ibu: {item.anak.ibu || "-"}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {item.anak.usia_bulan ?? 0} bulan
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-dark dark:text-white">{item.lokasi.posyandu || "-"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.lokasi.dusun || "-"}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      <p>BB: {item.pengukuran.berat_badan_kg ?? 0} kg</p>
                      <p>TB: {item.pengukuran.tinggi_badan_cm ?? 0} cm</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.status.length > 0
                          ? item.status.map((s) => (
                              <span key={s} className={`rounded-full px-2 py-1 text-xs font-medium ${getDisplayStatusColor(s)}`}>{s}</span>
                            ))
                          : <span className="text-xs text-gray-400">-</span>
                        }
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDetailClick(item.anak.id_anak)}
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Menampilkan {visiblePrioritasStart}-{visiblePrioritasEnd} dari {filteredDaftarPrioritas.length} data
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPrioritasPage((page) => Math.max(1, page - 1))}
                  disabled={safePrioritasPage === 1}
                  className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Sebelumnya
                </button>
                <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:hidden">
                  {safePrioritasPage}/{totalPrioritasPages}
                </span>
                <div className="hidden flex-wrap items-center gap-2 sm:flex">
                  {getPrioritasPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span key={`prioritas-ellipsis-${index}`} className="px-2 text-sm text-gray-500 dark:text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPrioritasPage(page)}
                        className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          page === safePrioritasPage
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPrioritasPage((page) => Math.min(totalPrioritasPages, page + 1))}
                  disabled={safePrioritasPage === totalPrioritasPages}
                  className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        ) : filteredDaftarPrioritas && filteredDaftarPrioritas.length === 0 ? (
          <InfoCard message="Tidak ada data yang sesuai dengan filter yang dipilih." />
        ) : (
          <InfoCard message="Tidak ada data daftar prioritas untuk periode ini." />
        )}
      </div>

      {/* Modal Detail */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-dark">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">
                  {detailLoading ? "Memuat..." : (selectedDetailData?.anak.nama || "Detail Anak")}
                </h2>
                {selectedDetailData && (
                  <p className="text-gray-600 dark:text-gray-400">ID: {selectedDetailData.anak.id_anak || "-"}</p>
                )}
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {detailLoading ? (
              <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Memuat data detail...</div>
            ) : selectedDetailData ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Informasi Pribadi</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">NIK</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.anak.nik || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tanggal Lahir</span>
                      <span className="font-medium text-dark dark:text-white">{formatDate(selectedDetailData.anak.tanggal_lahir)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Usia</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.anak.usia_bulan ?? 0} bulan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Jenis Kelamin</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.anak.jenis_kelamin || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nama Ibu</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.anak.nama_ibu || "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Lokasi</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Posyandu</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.lokasi.posyandu || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Dusun</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.lokasi.dusun || "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Pengukuran Terakhir</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Berat Badan</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{selectedDetailData.pengukuran_terakhir.berat_badan_kg ?? 0} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tinggi Badan</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{selectedDetailData.pengukuran_terakhir.tinggi_badan_cm ?? 0} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tanggal</span>
                      <span className="font-medium text-dark dark:text-white">{formatDate(selectedDetailData.pengukuran_terakhir.tanggal)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Status Kesehatan</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedDetailData.status_kesehatan.length > 0
                        ? selectedDetailData.status_kesehatan.map((s) => (
                            <span key={s} className={`rounded-full px-3 py-1 text-sm font-medium ${getDisplayStatusColor(s)}`}>{s}</span>
                          ))
                        : <span className="text-sm text-gray-400">-</span>
                      }
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Prioritas: </span>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                          selectedDetailData.prioritas === "Sangat Tinggi"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : selectedDetailData.prioritas === "Tinggi"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${getPriorityColor(selectedDetailData.prioritas)}`} />
                        {selectedDetailData.prioritas || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <InfoCard message="Gagal memuat data detail. Silakan coba lagi." />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KasusKritisPage;
