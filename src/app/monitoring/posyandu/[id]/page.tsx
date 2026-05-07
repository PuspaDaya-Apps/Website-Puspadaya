"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  fetchDetailPosyanduBalitaKhusus,
  fetchDetailPosyanduKader,
  fetchDetailPosyanduKinerja,
  fetchDetailPosyanduOverview,
  fetchDetailPosyanduRingkasan,
} from "@/app/api/detail-dashboard-kepala-desa";
import {
  DetailPosyanduBalitaKhususData,
  DetailPosyanduKaderData,
  DetailPosyanduKinerjaData,
  DetailPosyanduOverviewData,
  DetailPosyanduRingkasanData,
} from "@/types/kepala-desa";
import { resolvePosyanduDetailToken } from "@/utils/posyanduDetailToken";

const PosyanduDetailPage: React.FC = () => {
  const params = useParams();
  const detailToken = params.id as string;

  const [activeTab, setActiveTab] = useState<"overview" | "balita" | "kader" | "kinerja">("overview");
  const [detailContext, setDetailContext] = useState<{ idPosyandu: string; bulan: number; tahun: number } | null>(null);
  const [overviewData, setOverviewData] = useState<DetailPosyanduOverviewData | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [ringkasanData, setRingkasanData] = useState<DetailPosyanduRingkasanData | null>(null);
  const [ringkasanLoading, setRingkasanLoading] = useState(true);
  const [ringkasanError, setRingkasanError] = useState<string | null>(null);
  const [balitaData, setBalitaData] = useState<DetailPosyanduBalitaKhususData | null>(null);
  const [balitaLoading, setBalitaLoading] = useState(true);
  const [balitaError, setBalitaError] = useState<string | null>(null);
  const [balitaPage, setBalitaPage] = useState(1);
  const balitaLimit = 5;
  const [kaderData, setKaderData] = useState<DetailPosyanduKaderData | null>(null);
  const [kaderLoading, setKaderLoading] = useState(true);
  const [kaderError, setKaderError] = useState<string | null>(null);
  const [kaderPage, setKaderPage] = useState(1);
  const kaderLimit = 6;
  const [kinerjaData, setKinerjaData] = useState<DetailPosyanduKinerjaData | null>(null);
  const [kinerjaLoading, setKinerjaLoading] = useState(true);
  const [kinerjaError, setKinerjaError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const resolved = resolvePosyanduDetailToken(detailToken);

    if (resolved) {
      setOverviewData(null);
      setRingkasanData(null);
      setBalitaData(null);
      setKaderData(null);
      setKinerjaData(null);
      setOverviewLoading(true);
      setRingkasanLoading(true);
      setBalitaLoading(true);
      setKaderLoading(true);
      setKinerjaLoading(true);
      setDetailContext({
        idPosyandu: resolved.idPosyandu,
        bulan: resolved.bulan,
        tahun: resolved.tahun,
      });
      return;
    }

    setOverviewData(null);
    setRingkasanData(null);
    setBalitaData(null);
    setKaderData(null);
    setKinerjaData(null);
    setDetailContext(null);
    setOverviewLoading(false);
    setRingkasanLoading(false);
    setBalitaLoading(false);
    setKaderLoading(false);
    setKinerjaLoading(false);
  }, [detailToken]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRefreshTick((value) => value + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!detailContext) {
      return;
    }

    let isMounted = true;

    const loadOverview = async () => {
      const hasExistingData = overviewData !== null;

      if (!hasExistingData) {
        setOverviewLoading(true);
        setOverviewError(null);
      }

      const result = await fetchDetailPosyanduOverview(detailContext.idPosyandu, {
        bulan: detailContext.bulan,
        tahun: detailContext.tahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setOverviewData(result.data);
        setOverviewError(null);
      } else if (!hasExistingData) {
        setOverviewError("Gagal memuat overview posyandu");
      }

      if (!hasExistingData) {
        setOverviewLoading(false);
      }
    };

    const loadRingkasan = async () => {
      const hasExistingData = ringkasanData !== null;

      if (!hasExistingData) {
        setRingkasanLoading(true);
        setRingkasanError(null);
      }

      const result = await fetchDetailPosyanduRingkasan(detailContext.idPosyandu, {
        bulan: detailContext.bulan,
        tahun: detailContext.tahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setRingkasanData(result.data);
        setRingkasanError(null);
      } else if (!hasExistingData) {
        setRingkasanError("Gagal memuat ringkasan posyandu");
      }

      if (!hasExistingData) {
        setRingkasanLoading(false);
      }
    };

    const loadBalitaKhusus = async () => {
      const hasExistingData = balitaData !== null;

      if (!hasExistingData) {
        setBalitaLoading(true);
        setBalitaError(null);
      }

      const result = await fetchDetailPosyanduBalitaKhusus(detailContext.idPosyandu, {
        bulan: detailContext.bulan,
        tahun: detailContext.tahun,
        page: balitaPage,
        limit: balitaLimit,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setBalitaData(result.data);
        setBalitaError(null);
      } else if (!hasExistingData) {
        setBalitaError("Gagal memuat data balita khusus");
      }

      if (!hasExistingData) {
        setBalitaLoading(false);
      }
    };

    const loadKader = async () => {
      const hasExistingData = kaderData !== null;

      if (!hasExistingData) {
        setKaderLoading(true);
        setKaderError(null);
      }

      const result = await fetchDetailPosyanduKader(detailContext.idPosyandu, {
        bulan: detailContext.bulan,
        tahun: detailContext.tahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setKaderData(result.data);
        setKaderError(null);
      } else if (!hasExistingData) {
        setKaderError("Gagal memuat data kader");
      }

      if (!hasExistingData) {
        setKaderLoading(false);
      }
    };

    const loadKinerja = async () => {
      const hasExistingData = kinerjaData !== null;

      if (!hasExistingData) {
        setKinerjaLoading(true);
        setKinerjaError(null);
      }

      const result = await fetchDetailPosyanduKinerja(detailContext.idPosyandu, {
        bulan: detailContext.bulan,
        tahun: detailContext.tahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setKinerjaData(result.data);
        setKinerjaError(null);
      } else if (!hasExistingData) {
        setKinerjaError("Gagal memuat data kinerja");
      }

      if (!hasExistingData) {
        setKinerjaLoading(false);
      }
    };

    loadOverview();
    loadRingkasan();
    loadBalitaKhusus();
    loadKader();
    loadKinerja();

    return () => {
      isMounted = false;
    };
  }, [detailContext, balitaPage, refreshTick]);

  useEffect(() => {
    setKaderPage(1);
  }, [detailContext?.idPosyandu, detailContext?.bulan, detailContext?.tahun]);

  const apiPosyandu = ringkasanData?.posyandu;

  // Filter data for this posyandu
  const criticalChildren = useMemo(() => {
    return (
      balitaData?.balita?.map((item, index) => ({
        id: `${item.id_balita}-${index}`,
        nama_anak: item.nama,
        usia_bulan: Number(item.usia.match(/\d+/)?.[0] ?? 0),
        nama_ibu: item.ibu,
        berat_badan: item.berat_badan,
        tinggi_badan: item.tinggi_badan,
        status_gizi: item.status,
        status_stunting: item.status.toLowerCase().includes("stunting") ? "Stunting" : "",
      })) ?? []
    );
  }, [balitaData]);
  const kaderRows = kaderData?.kader ?? [];
  const kaderTotalPages = Math.max(1, Math.ceil(kaderRows.length / kaderLimit));
  const kaderCurrentPage = Math.min(kaderPage, kaderTotalPages);
  const kaderVisibleRows = useMemo(() => {
    const start = (kaderCurrentPage - 1) * kaderLimit;
    return kaderRows.slice(start, start + kaderLimit);
  }, [kaderCurrentPage, kaderRows]);

  const kaderPagination = useMemo(() => {
    const totalData = kaderRows.length;

    return {
      page: kaderCurrentPage,
      total_data: totalData,
      total_page: kaderTotalPages,
    };
  }, [kaderCurrentPage, kaderRows.length, kaderTotalPages]);

  const kaderPageButtons = useMemo(() => {
    const totalPage = kaderPagination.total_page;
    const currentPage = kaderPagination.page;

    if (totalPage <= 5) {
      return Array.from({ length: totalPage }, (_, index) => index + 1);
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPage, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
  }, [kaderPagination]);

  const kinerja = kinerjaData?.kinerja;
  const kinerjaTren = kinerja?.tren_kehadiran_6_bulan ?? [];

  // Calculate stats
  const stats = useMemo(() => {
    if (overviewData) {
      const totalBalita = overviewData.status_gizi_balita.reduce((sum, item) => sum + item.jumlah, 0);
      const getStatusJumlah = (match: string) =>
        overviewData.status_gizi_balita.find((item) => item.status.toLowerCase().includes(match))?.jumlah ?? 0;

      return {
        total_balita: balitaData?.pagination?.total_data ?? totalBalita,
        total_ibu_hamil: ringkasanData?.ringkasan?.total_ibu_hamil ?? 0,
        total_kader: kaderData?.kader?.length ?? ringkasanData?.ringkasan?.total_kader ?? 0,
        kehadiran_balita: overviewData.tingkat_kehadiran.hadir,
        kehadiran_ibu_hamil: ringkasanData?.ringkasan?.hadir_ibu_hamil ?? 0,
        persentase_kehadiran: overviewData.tingkat_kehadiran.persentase,
        status_stunting: getStatusJumlah("stunting"),
        status_gizi_buruk: getStatusJumlah("buruk"),
        normal: getStatusJumlah("normal"),
      };
    }

    if (ringkasanData?.ringkasan) {
      const ringkasan = ringkasanData.ringkasan;

      return {
        total_balita: balitaData?.pagination?.total_data ?? ringkasan.total_balita,
        total_ibu_hamil: ringkasan.total_ibu_hamil,
        total_kader: kaderData?.kader?.length ?? ringkasan.total_kader,
        kehadiran_balita: ringkasan.hadir_balita,
        kehadiran_ibu_hamil: ringkasan.hadir_ibu_hamil,
        persentase_kehadiran: ringkasan.total_balita > 0
          ? Math.round((ringkasan.hadir_balita / ringkasan.total_balita) * 100)
          : 0,
        status_stunting: ringkasan.stunting,
        status_gizi_buruk: ringkasan.gizi_buruk,
        normal: ringkasan.normal,
      };
    }

    return {
      total_balita: balitaData?.pagination?.total_data ?? 0,
      total_ibu_hamil: 0,
      total_kader: kaderData?.kader?.length ?? 0,
      kehadiran_balita: 0,
      kehadiran_ibu_hamil: 0,
      persentase_kehadiran: 0,
      status_stunting: 0,
      status_gizi_buruk: 0,
      normal: 0,
    };
  }, [balitaData, kaderData, overviewData, ringkasanData]);

  const overviewKasusKritis =
    overviewData?.kasus_kritis?.map((item) => ({
      id: String(item.id_balita),
      nama_anak: item.nama,
      usia_bulan: Number(item.usia.match(/\d+/)?.[0] ?? 0),
      status_gizi: item.status,
      status_stunting: item.status.toLowerCase().includes("stunting") ? "Stunting" : "",
    })) ?? [];

  const overviewStatusGizi = overviewData?.status_gizi_balita ?? [
    {
      status: "Stunting",
      jumlah: stats?.status_stunting ?? 0,
      persentase:
        (stats?.total_balita ?? 0) > 0
          ? Number((((stats?.status_stunting ?? 0) / (stats?.total_balita ?? 1)) * 100).toFixed(1))
          : 0,
    },
    {
      status: "Gizi Buruk",
      jumlah: stats?.status_gizi_buruk ?? 0,
      persentase:
        (stats?.total_balita ?? 0) > 0
          ? Number((((stats?.status_gizi_buruk ?? 0) / (stats?.total_balita ?? 1)) * 100).toFixed(1))
          : 0,
    },
    {
      status: "Normal",
      jumlah: stats?.normal ?? 0,
      persentase:
        (stats?.total_balita ?? 0) > 0
          ? Number((((stats?.normal ?? 0) / (stats?.total_balita ?? 1)) * 100).toFixed(1))
          : 0,
    },
  ];

  const balitaRows = balitaData?.balita ?? [];
  const balitaPagination = balitaData?.pagination;
  const balitaPageButtons = useMemo(() => {
    if (!balitaPagination) return [];

    const totalPage = balitaPagination.total_page;
    const currentPage = balitaPagination.page;
    const maxButtons = 5;

    if (totalPage <= maxButtons) {
      return Array.from({ length: totalPage }, (_, index) => index + 1);
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPage, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [balitaPagination]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                Dashboard
              </Link>
              <span>/</span>
              <span>Detail Posyandu</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-dark md:text-3xl dark:text-white">
              {apiPosyandu?.nama ?? "-"}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {apiPosyandu?.alamat?.dusun ?? "-"}, {apiPosyandu?.alamat?.kecamatan ?? "-"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Total Balita:</span>{" "}
              <span className="font-medium text-dark dark:text-white">{stats.total_balita}</span>
            </div>
            <div className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
              <span className="font-medium">Kader: {stats.total_kader}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {ringkasanLoading ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Memuat ringkasan posyandu...
        </div>
      ) : ringkasanError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {ringkasanError}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-xl border border-emerald-100 bg-white p-4 text-center shadow-sm dark:border-emerald-900/40 dark:bg-gray-800">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.total_balita}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Balita</p>
        </div>
        <div className="rounded-xl border border-pink-100 bg-white p-4 text-center shadow-sm dark:border-pink-900/40 dark:bg-gray-800">
          <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{stats.total_ibu_hamil}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Hamil</p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-white p-4 text-center shadow-sm dark:border-violet-900/40 dark:bg-gray-800">
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{stats.total_kader}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Kader</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-white p-4 text-center shadow-sm dark:border-blue-900/40 dark:bg-gray-800">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.kehadiran_balita}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Hadir Balita</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-white p-4 text-center shadow-sm dark:border-amber-900/40 dark:bg-gray-800">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.kehadiran_ibu_hamil}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Hadir Ibu Hamil</p>
        </div>
        <div className="rounded-xl border border-red-100 bg-white p-4 text-center shadow-sm dark:border-red-900/40 dark:bg-gray-800">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.status_stunting}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Stunting</p>
        </div>
        <div className="rounded-xl border border-orange-100 bg-white p-4 text-center shadow-sm dark:border-orange-900/40 dark:bg-gray-800">
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.status_gizi_buruk}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Gizi Buruk</p>
        </div>
        <div className="rounded-xl border border-teal-100 bg-white p-4 text-center shadow-sm dark:border-teal-900/40 dark:bg-gray-800">
          <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.normal}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Normal</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        {[
          { id: "overview", label: "Overview", icon: "" },
          { id: "balita", label: "Data Balita", icon: "" },
          { id: "kader", label: "Kader", icon: "" },
          { id: "kinerja", label: "Kinerja", icon: "" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-3 font-medium transition ${
              activeTab === tab.id
                ? "bg-white text-primary dark:bg-gray-dark dark:text-primary"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Kehadiran Progress */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Tingkat Kehadiran</h3>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Persentase Kehadiran</span>
                  <span className={`text-2xl font-bold ${
                    stats.persentase_kehadiran >= 80 ? "text-emerald-600" : stats.persentase_kehadiran >= 60 ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {stats.persentase_kehadiran}%
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stats.persentase_kehadiran >= 80 ? "bg-emerald-500" : stats.persentase_kehadiran >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${stats.persentase_kehadiran}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Status Gizi Chart */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Status Gizi Balita</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {overviewStatusGizi.map((item) => {
                  const color =
                    item.status === "Stunting"
                      ? {
                          bg: "bg-red-50 dark:bg-red-900/20",
                          track: "#fecaca",
                          fill: "#ef4444",
                          text: "text-red-600 dark:text-red-400",
                          label: "text-red-700 dark:text-red-300",
                        }
                      : item.status === "Gizi Buruk"
                      ? {
                          bg: "bg-orange-50 dark:bg-orange-900/20",
                          track: "#fed7aa",
                          fill: "#f97316",
                          text: "text-orange-600 dark:text-orange-400",
                          label: "text-orange-700 dark:text-orange-300",
                        }
                      : {
                          bg: "bg-emerald-50 dark:bg-emerald-900/20",
                          track: "#a7f3d0",
                          fill: "#10b981",
                          text: "text-emerald-600 dark:text-emerald-400",
                          label: "text-emerald-700 dark:text-emerald-300",
                        };

                  return (
                    <div key={item.status} className={`rounded-lg p-4 text-center ${color.bg}`}>
                      <div className="mb-2 flex justify-center">
                        <div className="relative h-20 w-20">
                          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke={color.track} strokeWidth="12" />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={color.fill}
                              strokeWidth="12"
                              strokeDasharray={`${Math.max(0, Math.min(100, item.persentase)) * 2.512} 251.2`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-lg font-bold ${color.text}`}>{item.jumlah}</span>
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm font-medium ${color.label}`}>{item.status}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{item.persentase}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Critical Children Alert */}
            {overviewKasusKritis.length > 0 && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="mb-3 flex items-center gap-2">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                    Kasus Kritis di Posyandu Ini
                  </h3>
                </div>
                <div className="space-y-2">
                  {overviewKasusKritis.slice(0, 5).map((child) => (
                    <div key={child.id} className="flex items-center justify-between rounded bg-white p-3 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-dark dark:text-white">{child.nama_anak}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {child.usia_bulan} bulan • {child.status_gizi} {child.status_stunting === "Stunting" && "• Stunting"}
                        </p>
                      </div>
                      <Link
                        href="/monitoring/kasus-kritis"
                        className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Detail
                      </Link>
                    </div>
                  ))}
                </div>
                <Link
                  href="/monitoring/kasus-kritis"
                  className="mt-3 block text-center text-sm font-medium text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
                >
                  Lihat semua {overviewKasusKritis.length} kasus kritis
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Balita Tab */}
        {activeTab === "balita" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark dark:text-white">Daftar Balita dengan Kondisi Khusus</h3>
            {balitaLoading ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                Memuat data balita khusus...
              </div>
            ) : criticalChildren.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Usia</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Ibu</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">BB/TB</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {criticalChildren.map((child) => (
                      <tr key={child.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 font-medium text-dark dark:text-white">{child.nama_anak}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{child.usia_bulan} bulan</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{child.nama_ibu}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {child.berat_badan}kg / {child.tinggi_badan}cm
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                              child.status_gizi === "Gizi Buruk"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                            }`}>
                              {child.status_gizi}
                            </span>
                            {child.status_stunting === "Stunting" && (
                              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                Stunting
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            href="/monitoring/kasus-kritis"
                            className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {balitaPagination && (
              <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-600 dark:text-gray-400">
                <div>
                  Menampilkan {balitaRows.length} dari {balitaPagination.total_data} balita
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBalitaPage((page) => Math.max(1, page - 1))}
                    disabled={balitaPage <= 1}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-dark transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-white"
                  >
                    Sebelumnya
                  </button>
                  {balitaPageButtons.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setBalitaPage(pageNumber)}
                      className={`min-w-10 rounded-lg border px-3 py-1.5 font-medium transition ${
                        pageNumber === balitaPagination.page
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-dark hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBalitaPage((page) => Math.min(balitaPagination.total_page, page + 1))}
                    disabled={balitaPage >= balitaPagination.total_page}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-dark transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-white"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kader Tab */}
        {activeTab === "kader" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">Daftar Kader Posyandu</h3>
              {!kaderLoading && !kaderError && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{kaderRows.length} kader</p>
              )}
            </div>

            {kaderLoading ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Memuat data kader...
              </div>
            ) : kaderError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-10 text-center text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
                {kaderError}
              </div>
            ) : kaderRows.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Tidak ada data kader pada periode ini.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {kaderVisibleRows.map((kader) => {
                  const statusClass =
                    kader.status_kinerja?.toLowerCase().includes("tinggi")
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : kader.status_kinerja?.toLowerCase().includes("sedang")
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

                    return (
                      <div key={kader.id_kader} className="rounded-lg border border-gray-200 p-4 transition hover:shadow-md dark:border-gray-700">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                            {kader.nama.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-dark dark:text-white">{kader.nama}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{kader.jabatan}</p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>Status: {kader.status_kinerja}</span>
                              <span>Skor: {kader.skor_kinerja}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass}`}>
                              {kader.status_kinerja}
                            </span>
                            <p className="mt-1 text-sm font-bold text-dark dark:text-white">{kader.skor_kinerja} skor</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {kaderPagination.total_data > kaderLimit && (
                  <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      Menampilkan {kaderVisibleRows.length} dari {kaderPagination.total_data} kader
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setKaderPage((page) => Math.max(1, page - 1))}
                        disabled={kaderPagination.page <= 1}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-dark transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-white"
                      >
                        Sebelumnya
                      </button>
                      {kaderPageButtons.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setKaderPage(pageNumber)}
                          className={`min-w-10 rounded-lg border px-3 py-1.5 font-medium transition ${
                            pageNumber === kaderPagination.page
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 text-dark hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setKaderPage((page) => Math.min(kaderPagination.total_page, page + 1))}
                        disabled={kaderPagination.page >= kaderPagination.total_page}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-dark transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-white"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "kinerja" && (
          <div className="space-y-6">
            {kinerjaLoading ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Memuat data kinerja...
              </div>
            ) : kinerjaError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-10 text-center text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
                {kinerjaError}
              </div>
            ) : kinerja ? (
              <>
                <div className="rounded-lg bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80">Skor Kinerja</p>
                      <p className="text-5xl font-bold">{kinerja.skor}</p>
                      <p className="mt-2 text-white/80">{kinerja.kategori}</p>
                    </div>
                    <div className="relative h-32 w-32">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="white"
                          strokeWidth="8"
                          strokeDasharray={`${(kinerja.skor / 100) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kehadiran</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{kinerja.indikator.kehadiran.persentase}%</p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${kinerja.indikator.kehadiran.persentase}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pengukuran Balita</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{kinerja.indikator.pengukuran_balita.persentase}%</p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${kinerja.indikator.pengukuran_balita.persentase}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-pink-50 p-4 dark:bg-pink-900/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pengukuran Ibu Hamil</p>
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{kinerja.indikator.pengukuran_ibu_hamil.persentase}%</p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-pink-500" style={{ width: `${kinerja.indikator.pengukuran_ibu_hamil.persentase}%` }} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Tren Kehadiran 6 Bulan Terakhir</h3>
                  <div className="flex items-end gap-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    {kinerjaTren.length > 0 ? (
                      kinerjaTren.map((month, index) => {
                        const maxValue = Math.max(...kinerjaTren.map((item) => item.jumlah_hadir));
                        const height = maxValue > 0 ? (month.jumlah_hadir / maxValue) * 100 : 0;
                        return (
                          <div key={index} className="flex-1 text-center">
                            <div
                              className="mx-auto w-full max-w-[50px] rounded-t bg-gradient-to-t from-primary to-blue-400 transition-all hover:from-primary/80 hover:to-blue-300"
                              style={{ height: `${height}%`, minHeight: "30px" }}
                              title={`${month.bulan}: ${month.jumlah_hadir} hadir`}
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{month.bulan.slice(0, 3)}</p>
                            <p className="text-xs font-medium text-dark dark:text-white">{month.jumlah_hadir}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Tidak ada data tren kinerja.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default PosyanduDetailPage;
