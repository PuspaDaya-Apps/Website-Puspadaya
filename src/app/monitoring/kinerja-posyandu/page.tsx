"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchDetailPosyanduBalitaAll, fetchDetailPosyanduKader, fetchDetailPosyanduKinerja, fetchDetailPosyanduOverview, fetchDetailPosyanduRingkasan, fetchKinerjaPerPosyandu } from "@/app/api/detail-dashboard-kepala-desa";
import {
  fetchKinerjaRingkasan,
  type DashboardKepalaDesaQueryParams,
} from "@/app/api/dashboard-kinerja-kepala-desa";
import { fetchTrenDataPosyandu } from "@/app/api/dashboard-kepala-desa";
import { fetchKinerjaPerhatianKhusus } from "@/app/api/dashboard-kinerja-kepala-desa";
import {
  DetailPosyanduOverviewData,
  DetailPosyanduKinerjaData,
  DetailPosyanduBalitaKhususData,
  DetailPosyanduKaderData,
  DetailPosyanduRingkasanData,
  KinerjaPosyanduPerhatianKhususItem,
  TrenDataPosyanduItem,
  KinerjaPerPosyanduData,
} from "@/types/kepala-desa";
import { createPosyanduDetailToken } from "@/utils/posyanduDetailToken";
import {
  buildPageStateCacheKey,
  readPageStateCache,
  writePageStateCache,
} from "@/utils/pageStateCache";

interface CurrentUserLocation {
  kabupaten_kota?: {
    nama_kabupaten_kota?: string;
  };
  desa_kelurahan?: {
    nama_desa_kelurahan?: string;
  };
}

const getCurrentUserLocation = (): Pick<DashboardKepalaDesaQueryParams, "kabupatenKota" | "desa"> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawCurrentUser = localStorage.getItem("current_user");

    if (!rawCurrentUser) {
      return {};
    }

    const currentUser = JSON.parse(rawCurrentUser) as CurrentUserLocation;

    return {
      kabupatenKota: currentUser?.kabupaten_kota?.nama_kabupaten_kota,
      desa: currentUser?.desa_kelurahan?.nama_desa_kelurahan,
    };
  } catch (error) {
    console.warn("Gagal membaca current_user dari localStorage:", error);
    return {};
  }
};

interface KinerjaPosyanduPageSnapshot {
  activeTab: "ranking" | "detail";
  selectedPosyandu: string | null;
  detailTab: "overview" | "balita" | "kader" | "kinerja";
  ringkasanData: {
    total_posyandu: number;
    rata_rata_skor: number;
    maksimal_skor: number;
    kategori_posyandu: {
      sangat_baik: number;
      baik: number;
      cukup: number;
      kurang: number;
    };
  } | null;
  trenData: TrenDataPosyanduItem[] | null;
  detailOverviewData: DetailPosyanduOverviewData | null;
  detailKinerjaData: DetailPosyanduKinerjaData | null;
  detailBalitaData: DetailPosyanduBalitaKhususData | null;
  detailKaderData: DetailPosyanduKaderData | null;
  detailRingkasanData: DetailPosyanduRingkasanData | null;
  kinerjaPerPosyanduData: KinerjaPerPosyanduData | null;
  perhatianKhususData: KinerjaPosyanduPerhatianKhususItem[] | null;
  perhatianKhususPage: number;
  detailBalitaPage: number;
}

const KinerjaPosyanduPage: React.FC = () => {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<Pick<DashboardKepalaDesaQueryParams, "kabupatenKota" | "desa">>(() => getCurrentUserLocation());
  const currentDate = new Date();
  const currentBulan = currentDate.getMonth() + 1;
  const currentTahun = currentDate.getFullYear();
  const pageCacheKey = useMemo(
    () =>
      buildPageStateCacheKey(
        "monitoring-kinerja-posyandu",
        `${currentBulan}-${currentTahun}-${userLocation.kabupatenKota ?? ""}-${userLocation.desa ?? ""}`
      ),
    [currentBulan, currentTahun, userLocation]
  );
  const cachedPageState = useMemo(
    () => readPageStateCache<KinerjaPosyanduPageSnapshot>(pageCacheKey),
    [pageCacheKey]
  );
  const [activeTab, setActiveTab] = useState<"ranking" | "detail">(cachedPageState?.data.activeTab ?? "ranking");
  const [selectedPosyandu, setSelectedPosyandu] = useState<string | null>(cachedPageState?.data.selectedPosyandu ?? null);
  const [detailTab, setDetailTab] = useState<"overview" | "balita" | "kader" | "kinerja">(cachedPageState?.data.detailTab ?? "overview");
  const [ringkasanData, setRingkasanData] = useState<{
    total_posyandu: number;
    rata_rata_skor: number;
    maksimal_skor: number;
    kategori_posyandu: {
      sangat_baik: number;
      baik: number;
      cukup: number;
      kurang: number;
    };
  } | null>(cachedPageState?.data.ringkasanData ?? null);
  const [trenData, setTrenData] = useState<TrenDataPosyanduItem[] | null>(cachedPageState?.data.trenData ?? null);
  const [detailOverviewData, setDetailOverviewData] = useState<DetailPosyanduOverviewData | null>(cachedPageState?.data.detailOverviewData ?? null);
  const [detailKinerjaData, setDetailKinerjaData] = useState<DetailPosyanduKinerjaData | null>(cachedPageState?.data.detailKinerjaData ?? null);
  const [detailBalitaData, setDetailBalitaData] = useState<DetailPosyanduBalitaKhususData | null>(cachedPageState?.data.detailBalitaData ?? null);
  const [detailKaderData, setDetailKaderData] = useState<DetailPosyanduKaderData | null>(cachedPageState?.data.detailKaderData ?? null);
  const [detailRingkasanData, setDetailRingkasanData] = useState<DetailPosyanduRingkasanData | null>(cachedPageState?.data.detailRingkasanData ?? null);
  const [kinerjaPerPosyanduData, setKinerjaPerPosyanduData] = useState<KinerjaPerPosyanduData | null>(cachedPageState?.data.kinerjaPerPosyanduData ?? null);
  const [kinerjaPerPosyanduLoading, setKinerjaPerPosyanduLoading] = useState(false);
  const [perhatianKhususData, setPerhatianKhususData] = useState<KinerjaPosyanduPerhatianKhususItem[] | null>(cachedPageState?.data.perhatianKhususData ?? null);
  const [perhatianKhususLoading, setPerhatianKhususLoading] = useState(!cachedPageState?.data.perhatianKhususData);
  const [perhatianKhususPage, setPerhatianKhususPage] = useState(cachedPageState?.data.perhatianKhususPage ?? 1);
  const [detailBalitaPage, setDetailBalitaPage] = useState(cachedPageState?.data.detailBalitaPage ?? 1);
  const [refreshTick, setRefreshTick] = useState(0);
  const perhatianKhususItemsPerPage = 4;
  const detailBalitaLimit = 10;
  const zeroTrendMonths = useMemo(
    () => ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"].map((bulan) => ({ bulan, jumlah_hadir: 0 })),
    []
  );

  const ErrorCard = ({ title, message }: { title: string; message: string }) => (
    <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
          !
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRefreshTick((value) => value + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadRingkasan = async () => {
      const hasExistingData = ringkasanData !== null;

      const result = await fetchKinerjaRingkasan({
        bulan: currentBulan,
        tahun: currentTahun,
        ...userLocation,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setRingkasanData(result.data);
      } else if (!hasExistingData) {
        setRingkasanData(null);
      }
    };

    loadRingkasan();

    return () => {
      isMounted = false;
    };
  }, [currentBulan, currentTahun, userLocation, refreshTick]);

  useEffect(() => {
    let isMounted = true;

    const loadTrenData = async () => {
      const hasExistingData = trenData !== null;

      const result = await fetchTrenDataPosyandu({
        bulan: currentBulan,
        tahun: currentTahun,
        ...userLocation,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setTrenData(result.data.posyandu ?? []);
      } else if (!hasExistingData) {
        setTrenData(null);
      }
    };

    loadTrenData();

    return () => {
      isMounted = false;
    };
  }, [currentBulan, currentTahun, userLocation, refreshTick]);

  useEffect(() => {
    let isMounted = true;

    const loadPerhatianKhusus = async () => {
      const hasExistingData = perhatianKhususData !== null;

      if (!hasExistingData) {
        setPerhatianKhususLoading(true);
      }

      const result = await fetchKinerjaPerhatianKhusus({
        bulan: currentBulan,
        tahun: currentTahun,
        ...userLocation,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setPerhatianKhususData(result.data.posyandu ?? []);
      } else if (!hasExistingData) {
        setPerhatianKhususData(null);
      }

      if (!hasExistingData) {
        setPerhatianKhususLoading(false);
      }
    };

    loadPerhatianKhusus();

    return () => {
      isMounted = false;
    };
  }, [currentBulan, currentTahun, userLocation, refreshTick]);

  const openPosyanduDetail = (posyanduId: string) => {
    const token = createPosyanduDetailToken({
      idPosyandu: posyanduId,
      bulan: currentBulan,
      tahun: currentTahun,
    });
    router.push(`/monitoring/posyandu/${token}`);
  };

  const apiPosyanduList = useMemo(() => {
    return (trenData ?? []).map((item, index) => ({
      id: item.id ?? `${item.nama}-${index + 1}`,
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
      ranking: item.ranking ?? index + 1,
      last_updated: "",
    }));
  }, [trenData]);

  const listPosyandu = apiPosyanduList;

  const detailPosyanduTabs = useMemo(() => {
    return listPosyandu.map((posyandu) => ({
      id: posyandu.id,
      detailId: posyandu.id,
      nama_posyandu: posyandu.nama_posyandu,
      skor_kinerja: posyandu.skor_kinerja,
    }));
  }, [listPosyandu]);

  useEffect(() => {
    if (detailPosyanduTabs.length === 0) {
      return;
    }

    const hasSelectedPosyandu = detailPosyanduTabs.some((posyandu) => posyandu.detailId === selectedPosyandu);

    if (!selectedPosyandu || !hasSelectedPosyandu) {
      setSelectedPosyandu(detailPosyanduTabs[0].detailId);
    }
  }, [detailPosyanduTabs, selectedPosyandu]);

  const selectedDetailPosyandu = useMemo(() => {
    if (!selectedPosyandu) {
      return null;
    }

    return detailPosyanduTabs.find(
      (posyandu) => posyandu.detailId === selectedPosyandu || posyandu.id === selectedPosyandu
    ) ?? null;
  }, [detailPosyanduTabs, selectedPosyandu]);

  const selectedPosyanduResolvedId = selectedDetailPosyandu?.detailId ?? selectedPosyandu;
  const selectedPosyanduResolvedName = selectedDetailPosyandu?.nama_posyandu ?? null;
  const selectedPosyanduApiId = selectedDetailPosyandu?.id ?? null;
  const overviewStats = useMemo(() => {
    if (!detailOverviewData) {
      return null;
    }

    const totalBalita = detailOverviewData.status_gizi_balita.reduce((sum, item) => sum + item.jumlah, 0);
    const getStatusJumlah = (match: string) =>
      detailOverviewData.status_gizi_balita.find((item) => item.status.toLowerCase().includes(match))?.jumlah ?? 0;

    return {
      total_balita: totalBalita,
      kehadiran_balita: detailOverviewData.tingkat_kehadiran.hadir,
      persentase_kehadiran: detailOverviewData.tingkat_kehadiran.persentase,
      status_stunting: getStatusJumlah("stunting"),
      status_gizi_buruk: getStatusJumlah("buruk"),
      normal: getStatusJumlah("normal"),
    };
  }, [detailOverviewData]);

  const perhatianKhususList = useMemo(() => {
    if (perhatianKhususData && perhatianKhususData.length > 0) {
      return [...perhatianKhususData].sort((a, b) => b.rank - a.rank);
    }

    return [];
  }, [perhatianKhususData]);

  const perhatianKhususTotalPages = Math.max(1, Math.ceil(perhatianKhususList.length / perhatianKhususItemsPerPage));
  const perhatianKhususVisible = perhatianKhususList.slice(
    (perhatianKhususPage - 1) * perhatianKhususItemsPerPage,
    perhatianKhususPage * perhatianKhususItemsPerPage
  );

  useEffect(() => {
    if (perhatianKhususPage > perhatianKhususTotalPages) {
      setPerhatianKhususPage(perhatianKhususTotalPages);
    }
  }, [perhatianKhususPage, perhatianKhususTotalPages]);

  // Get top 3 and bottom 3
  const apiTop3 = [...apiPosyanduList]
    .filter((posyandu) => [1, 2, 3].includes(posyandu.ranking ?? 0))
    .sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0));
  const top3 = apiTop3;

  // Calculate average scores
  const avgScore = ringkasanData?.rata_rata_skor ?? 0;

  // Get category counts
  const categoryCounts = useMemo(() => {
    return {
      sangatBaik: ringkasanData?.kategori_posyandu?.sangat_baik ?? 0,
      baik: ringkasanData?.kategori_posyandu?.baik ?? 0,
      cukup: ringkasanData?.kategori_posyandu?.cukup ?? 0,
      kurang: ringkasanData?.kategori_posyandu?.kurang ?? 0,
    };
  }, [ringkasanData]);

  const totalPosyandu = ringkasanData?.total_posyandu ?? 0;

  // Get selected posyandu detail
  const selectedPosyanduDetail = useMemo(() => {
    if (!selectedPosyanduResolvedId && !selectedPosyanduResolvedName) return null;

    const selectedListItem = listPosyandu.find(
      (item) => item.id === selectedPosyanduApiId || item.id === selectedPosyanduResolvedId || item.nama_posyandu === selectedPosyanduResolvedName
    );

    // Calculate stats
    const stats = overviewStats
      ? {
          total_balita: overviewStats.total_balita,
          total_ibu_hamil: detailRingkasanData?.ringkasan?.total_ibu_hamil ?? selectedListItem?.total_ibu_hamil ?? 0,
          total_kader: detailRingkasanData?.ringkasan?.total_kader ?? selectedListItem?.total_kader ?? 0,
          kehadiran_balita: overviewStats.kehadiran_balita,
          kehadiran_ibu_hamil: detailRingkasanData?.ringkasan?.hadir_ibu_hamil ?? selectedListItem?.kehadiran_ibu_hamil_bulan_ini ?? 0,
          persentase_kehadiran: overviewStats.persentase_kehadiran,
          status_stunting: overviewStats.status_stunting,
          status_gizi_buruk: overviewStats.status_gizi_buruk,
          normal: overviewStats.normal,
        }
      : detailRingkasanData?.ringkasan
        ? (() => {
          const ringkasan = detailRingkasanData.ringkasan;
          const totalBalita = ringkasan.total_balita || 0;

          return {
            total_balita: ringkasan.total_balita,
            total_ibu_hamil: ringkasan.total_ibu_hamil,
            total_kader: ringkasan.total_kader,
            kehadiran_balita: ringkasan.hadir_balita,
            kehadiran_ibu_hamil: ringkasan.hadir_ibu_hamil,
            persentase_kehadiran: totalBalita > 0 ? Math.round((ringkasan.hadir_balita / totalBalita) * 100) : 0,
            status_stunting: ringkasan.stunting,
            status_gizi_buruk: ringkasan.gizi_buruk,
            normal: ringkasan.normal,
          };
        })()
      : selectedListItem
        ? {
            total_balita: selectedListItem.total_balita,
            total_ibu_hamil: selectedListItem.total_ibu_hamil,
            total_kader: selectedListItem.total_kader,
            kehadiran_balita: selectedListItem.kehadiran_balita_bulan_ini,
            kehadiran_ibu_hamil: selectedListItem.kehadiran_ibu_hamil_bulan_ini,
            persentase_kehadiran: selectedListItem.persentase_kehadiran,
            status_stunting: selectedListItem.status_stunting,
            status_gizi_buruk: selectedListItem.status_gizi_buruk,
            normal: Math.max(
              0,
              selectedListItem.total_balita - selectedListItem.status_stunting - selectedListItem.status_gizi_buruk
            ),
          }
        : detailRingkasanData?.ringkasan
          ? {
              total_balita: detailRingkasanData.ringkasan.total_balita,
              total_ibu_hamil: detailRingkasanData.ringkasan.total_ibu_hamil,
              total_kader: detailRingkasanData.ringkasan.total_kader,
              kehadiran_balita: detailRingkasanData.ringkasan.hadir_balita,
              kehadiran_ibu_hamil: detailRingkasanData.ringkasan.hadir_ibu_hamil,
              persentase_kehadiran:
                detailRingkasanData.ringkasan.total_balita > 0
                  ? Math.round(
                      (detailRingkasanData.ringkasan.hadir_balita / detailRingkasanData.ringkasan.total_balita) * 100
                    )
                  : 0,
              status_stunting: detailRingkasanData.ringkasan.stunting,
              status_gizi_buruk: detailRingkasanData.ringkasan.gizi_buruk,
              normal: detailRingkasanData.ringkasan.normal,
            }
          : {
              total_balita: 0,
              total_ibu_hamil: 0,
              total_kader: 0,
              kehadiran_balita: 0,
              kehadiran_ibu_hamil: 0,
              persentase_kehadiran: 0,
              status_stunting: 0,
              status_gizi_buruk: 0,
              normal: 0,
            };

    const posyandu = selectedListItem
      ? {
          id: selectedListItem.id,
          nama_posyandu: selectedListItem.nama_posyandu,
          nama_dusun: selectedListItem.nama_dusun,
          nama_kecamatan: selectedListItem.nama_kecamatan,
          nama_kabupaten_kota: selectedListItem.nama_kabupaten_kota,
          total_balita: selectedListItem.total_balita,
          total_ibu_hamil: selectedListItem.total_ibu_hamil,
          total_kader: selectedListItem.total_kader,
          kehadiran_balita_bulan_ini: selectedListItem.kehadiran_balita_bulan_ini,
          kehadiran_ibu_hamil_bulan_ini: selectedListItem.kehadiran_ibu_hamil_bulan_ini,
          status_stunting: selectedListItem.status_stunting,
          status_gizi_buruk: selectedListItem.status_gizi_buruk,
          persentase_kehadiran: selectedListItem.persentase_kehadiran,
          skor_kinerja: selectedListItem.skor_kinerja,
          kategori_kinerja: selectedListItem.kategori_kinerja,
          ranking: selectedListItem.ranking,
          last_updated: selectedListItem.last_updated,
          }
      : null;

    const resolvedPerformance = selectedListItem
      ? {
          posyandu_id: selectedPosyanduResolvedId ?? selectedListItem.id,
          nama_posyandu: selectedListItem.nama_posyandu,
          skor_kinerja: selectedListItem.skor_kinerja,
          kehadiran: selectedListItem.persentase_kehadiran,
          kategori: selectedListItem.kategori_kinerja,
        }
      : null;

    return { performance: resolvedPerformance, posyandu, stats };
  }, [detailRingkasanData, listPosyandu, overviewStats, selectedPosyanduApiId, selectedPosyanduResolvedId, selectedPosyanduResolvedName]);

  const overviewStatusGizi = useMemo(() => {
    if (detailOverviewData?.status_gizi_balita?.length) {
      return detailOverviewData.status_gizi_balita;
    }

    if (!selectedPosyanduDetail?.stats) {
      return [];
    }

    return [
      {
        status: "Stunting",
        jumlah: selectedPosyanduDetail.stats.status_stunting,
        persentase:
          selectedPosyanduDetail.stats.total_balita > 0
            ? Number(((selectedPosyanduDetail.stats.status_stunting / selectedPosyanduDetail.stats.total_balita) * 100).toFixed(1))
            : 0,
      },
      {
        status: "Gizi Buruk",
        jumlah: selectedPosyanduDetail.stats.status_gizi_buruk,
        persentase:
          selectedPosyanduDetail.stats.total_balita > 0
            ? Number(((selectedPosyanduDetail.stats.status_gizi_buruk / selectedPosyanduDetail.stats.total_balita) * 100).toFixed(1))
            : 0,
      },
      {
        status: "Normal",
        jumlah: selectedPosyanduDetail.stats.normal,
        persentase:
          selectedPosyanduDetail.stats.total_balita > 0
            ? Number(((selectedPosyanduDetail.stats.normal / selectedPosyanduDetail.stats.total_balita) * 100).toFixed(1))
            : 0,
      },
    ];
  }, [detailOverviewData, selectedPosyanduDetail]);

  const overviewKasusKritis = useMemo(() => {
    if (detailOverviewData?.kasus_kritis?.length) {
      return detailOverviewData.kasus_kritis.map((item) => ({
        id: String(item.id_balita),
        nama_anak: item.nama,
        usia_bulan: Number(item.usia.match(/\d+/)?.[0] ?? 0),
        status_gizi: item.status,
        status_stunting: item.status.toLowerCase().includes("stunting") ? "Stunting" : "",
      }));
    }

    return [];
  }, [detailOverviewData]);

  const overviewAttendanceTrend = useMemo(() => {
    if (detailKinerjaData?.kinerja?.tren_kehadiran_6_bulan?.length) {
      return detailKinerjaData.kinerja.tren_kehadiran_6_bulan;
    }

    return zeroTrendMonths;
  }, [detailKinerjaData, zeroTrendMonths]);

  const balitaTableData = useMemo(() => {
    if (detailBalitaData?.balita?.length) {
      return detailBalitaData.balita.map((child) => ({
        id: child.id_balita,
        nik_anak: "-",
        nama_anak: child.nama,
        jenis_kelamin: child.jenis_kelamin || "-",
        usia_bulan: child.usia_bulan,
        usia_label: child.usia,
        tanggal_lahir: child.tanggal_lahir || "-",
        nama_ibu: child.ibu,
        berat_badan: child.berat_badan ?? null,
        tinggi_badan: child.tinggi_badan ?? null,
        status_gizi: child.status,
        status_stunting: "-",
        prioritas: child.prioritas || "-",
      }));
    }

    return [];
  }, [detailBalitaData]);

  const totalBalitaRows = detailBalitaData?.pagination?.total_data ?? balitaTableData.length;
  const totalBalitaPages = Math.max(1, detailBalitaData?.pagination?.total_page ?? 1);
  const balitaRangeStart = totalBalitaRows === 0 ? 0 : (detailBalitaPage - 1) * detailBalitaLimit + 1;
  const balitaRangeEnd = Math.min(detailBalitaPage * detailBalitaLimit, totalBalitaRows);

  const kaderDetailCards = useMemo(() => {
    if (detailKaderData?.kader?.length) {
      const totalSasaran = detailKaderData.total_sasaran.total_balita_sasaran + detailKaderData.total_sasaran.total_ibu_hamil_sasaran;

      return detailKaderData.kader.map((kader) => ({
        id: kader.id_kader,
        nama: kader.nama,
        nama_kader: kader.nama,
        jabatan: kader.jabatan,
        role: kader.jabatan,
        skor_kinerja: kader.skor_kinerja,
        skor_beban_kerja: kader.skor_kinerja,
        status_kinerja: kader.status_kinerja,
        kategori_beban: kader.status_kinerja,
        jumlah_balita_didampingi: kader.jumlah_balita_didampingi,
        durasi_kerja_posyandu: kader.jumlah_balita_didampingi,
        jumlah_ibu_hamil_didampingi: kader.jumlah_ibu_hamil_didampingi,
        durasi_kunjungan_rumah: kader.jumlah_ibu_hamil_didampingi,
        total_sasaran: totalSasaran,
        jarak_kunjungan: totalSasaran,
      }));
    }

    return [];
  }, [detailKaderData]);

  useEffect(() => {
    setDetailBalitaPage(1);
  }, [selectedPosyanduApiId]);

  useEffect(() => {
    let isMounted = true;

    const loadDetailOverview = async () => {
      if (!selectedPosyanduApiId) {
        setDetailOverviewData(null);
        return;
      }

      const hasExistingData = detailOverviewData !== null;

      const result = await fetchDetailPosyanduOverview(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setDetailOverviewData(result.data);
      } else if (!hasExistingData) {
        setDetailOverviewData(null);
      }
    };

    const loadDetailRingkasan = async () => {
      if (!selectedPosyanduApiId) {
        setDetailRingkasanData(null);
        return;
      }

      const hasExistingData = detailRingkasanData !== null;

      const result = await fetchDetailPosyanduRingkasan(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setDetailRingkasanData(result.data);
      } else if (!hasExistingData) {
        setDetailRingkasanData(null);
      }
    };

    const loadDetailKinerja = async () => {
      if (!selectedPosyanduApiId) {
        setDetailKinerjaData(null);
        return;
      }

      const hasExistingData = detailKinerjaData !== null;

      const result = await fetchDetailPosyanduKinerja(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setDetailKinerjaData(result.data);
      } else if (!hasExistingData) {
        setDetailKinerjaData(null);
      }
    };

    const loadDetailBalita = async () => {
      if (!selectedPosyanduApiId) {
        setDetailBalitaData(null);
        return;
      }

      const hasExistingData = detailBalitaData !== null;

      const result = await fetchDetailPosyanduBalitaAll(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
        page: detailBalitaPage,
        limit: detailBalitaLimit,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setDetailBalitaData(result.data);
      } else if (!hasExistingData) {
        setDetailBalitaData(null);
      }
    };

    const loadDetailKader = async () => {
      if (!selectedPosyanduApiId) {
        setDetailKaderData(null);
        return;
      }

      const hasExistingData = detailKaderData !== null;

      const result = await fetchDetailPosyanduKader(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setDetailKaderData(result.data);
      } else if (!hasExistingData) {
        setDetailKaderData(null);
      }
    };

    const loadKinerjaPerPosyandu = async () => {
      if (!selectedPosyanduApiId) {
        setKinerjaPerPosyanduData(null);
        return;
      }

      const hasExistingData = kinerjaPerPosyanduData !== null;

      if (!hasExistingData) {
        setKinerjaPerPosyanduLoading(true);
      }

      const result = await fetchKinerjaPerPosyandu(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setKinerjaPerPosyanduData(result.data);
      } else if (!hasExistingData) {
        setKinerjaPerPosyanduData(null);
      }

      if (!hasExistingData) {
        setKinerjaPerPosyanduLoading(false);
      }
    };

    loadDetailOverview();
    loadDetailRingkasan();
    loadDetailKinerja();
    loadDetailBalita();
    loadDetailKader();
    loadKinerjaPerPosyandu();

    return () => {
      isMounted = false;
    };
  }, [selectedPosyanduApiId, currentBulan, currentTahun, detailBalitaPage, refreshTick]);

  useEffect(() => {
    writePageStateCache(pageCacheKey, {
      activeTab,
      selectedPosyandu,
      detailTab,
      ringkasanData,
      trenData,
      detailOverviewData,
      detailKinerjaData,
      detailBalitaData,
      detailKaderData,
      detailRingkasanData,
      kinerjaPerPosyanduData,
      perhatianKhususData,
      perhatianKhususPage,
      detailBalitaPage,
    });
  }, [
    pageCacheKey,
    activeTab,
    selectedPosyandu,
    detailTab,
    ringkasanData,
    trenData,
    detailOverviewData,
    detailKinerjaData,
    detailBalitaData,
    detailKaderData,
    detailRingkasanData,
    kinerjaPerPosyanduData,
    perhatianKhususData,
    perhatianKhususPage,
    detailBalitaPage,
  ]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
              Kinerja & Tren Posyandu
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Monitoring, perbandingan, dan analisis kinerja antar posyandu secara komprehensif
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Total Posyandu:</span>{" "}
              <span className="font-medium text-dark dark:text-white">{totalPosyandu}</span>
            </div>
            <div className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
              <span className="font-medium">Rata-rata Skor: {avgScore}/100</span>
            </div>
          </div>
        </div>
      </div>
      

      {/* Summary Stats */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-xl bg-gradient-to-br from-primary to-blue-600 p-5 text-white">
          <p className="text-sm text-white/80">Rata-rata Skor</p>
          <p className="text-4xl font-bold">{avgScore}</p>
          <p className="mt-1 text-xs text-white/60">dari 100</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{categoryCounts.sangatBaik}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Sangat Baik</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{categoryCounts.baik}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Baik</p>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{categoryCounts.cukup}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Cukup</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{categoryCounts.kurang}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Kurang</p>
        </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700 pb-4">
          {[
            { id: "ranking", label: "Ranking" },
            { id: "detail", label: "Detail Per Posyandu" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "ranking" && (
          <div className="space-y-6">
            {/* Top 3 */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                Top 3 Posyandu Terbaik
              </h3>
              {top3.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {top3.map((posyandu, index) => {
                  const normalizedPosyandu = posyandu as {
                    id?: string;
                    posyandu_id?: string;
                    nama_posyandu: string;
                    skor_kinerja?: number;
                    ranking?: number;
                    kategori_kinerja?: string;
                  };
                  const detailId = normalizedPosyandu.id ?? normalizedPosyandu.posyandu_id ?? null;
                  const namaPosyandu = normalizedPosyandu.nama_posyandu;
                  const skorKinerja = normalizedPosyandu.skor_kinerja ?? 0;
                  const rank = normalizedPosyandu.ranking ?? index + 1;
                  return (
                    <div
                      key={detailId ?? `${namaPosyandu}-${index}`}
                      className={`relative overflow-hidden rounded-xl p-6 text-center ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                          : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                          : "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                      }`}
                    >
                      <div className="mb-3 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
                          {rank}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold">{namaPosyandu}</h4>
                      <p className="mt-1 text-sm text-white/80">{posyandu.nama_dusun}</p>
                      <p className="mt-4 text-5xl font-bold">{skorKinerja}</p>
                      <p className="text-sm text-white/80">skor kinerja</p>
                      <button
                        type="button"
                        onClick={() => detailId && openPosyanduDetail(detailId)}
                        className="mt-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/30"
                      >
                        Lihat Detail →
                      </button>
                    </div>
                  );
                  })}
                </div>
              ) : (
                <ErrorCard
                  title="Data ranking tidak tersedia"
                  message="API tidak mengembalikan data ranking posyandu untuk periode ini."
                />
              )}
            </div>

            {/* Bottom 3 */}
            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-700 dark:text-gray-200">
                  Perlu Perhatian Khusus
                </h3>
                {!perhatianKhususLoading && perhatianKhususList.length > 4 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Menampilkan {perhatianKhususVisible.length} dari {perhatianKhususList.length} posyandu
                  </p>
                )}
              </div>

              {perhatianKhususLoading ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                  Memuat data perhatian khusus...
                </div>
              ) : perhatianKhususList.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {perhatianKhususVisible.map((posyandu) => (
                      <div
                        key={posyandu.id_posyandu}
                        role="button"
                        tabIndex={0}
                        onClick={() => openPosyanduDetail(String(posyandu.id_posyandu))}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openPosyanduDetail(String(posyandu.id_posyandu));
                          }
                        }}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800/40 dark:focus:ring-gray-600"
                      >
                              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                    {posyandu.rank}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="truncate text-sm font-bold text-dark dark:text-white">{posyandu.nama_posyandu}</h4>
                                    <p className="truncate text-xs text-gray-600 dark:text-gray-400">{posyandu.lokasi}</p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-start gap-1 sm:items-end">
                                  <p className="text-2xl font-bold leading-none text-gray-700 dark:text-gray-200">
                                    {posyandu.skor}
                                  </p>
                                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200">
                                    {posyandu.kategori}
                                  </span>
                                </div>
                              </div>
                            </div>
                        ))}
                  </div>

                  {perhatianKhususList.length > perhatianKhususItemsPerPage && (
                    <div className="mt-4 flex flex-col items-center gap-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPerhatianKhususPage((page) => Math.max(1, page - 1))}
                          disabled={perhatianKhususPage === 1}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
                        >
                          Sebelumnya
                        </button>
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                          Halaman {perhatianKhususPage} dari {perhatianKhususTotalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPerhatianKhususPage((page) => Math.min(perhatianKhususTotalPages, page + 1))}
                          disabled={perhatianKhususPage === perhatianKhususTotalPages}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
                        >
                          Berikutnya
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <ErrorCard
                  title="Data perhatian khusus tidak tersedia"
                  message="API tidak mengembalikan daftar posyandu yang perlu perhatian khusus."
                />
              )}
            </div>

            {/* All Posyandu List */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Semua Posyandu</h3>
              {listPosyandu.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Posyandu</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Lokasi</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kehadiran</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Peng. Balita</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Peng. Bumil</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Skor</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kategori</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {listPosyandu.map((posyandu, index) => (
                        <tr key={posyandu.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              {posyandu.ranking ?? index + 1}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-dark dark:text-white">{posyandu.nama_posyandu}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{posyandu.nama_dusun}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className={`h-full rounded-full ${
                                    posyandu.persentase_kehadiran >= 80
                                      ? "bg-emerald-500"
                                      : posyandu.persentase_kehadiran >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${posyandu.persentase_kehadiran}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{posyandu.persentase_kehadiran}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{posyandu.total_balita}</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{posyandu.total_ibu_hamil}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xl font-bold ${
                              posyandu.skor_kinerja >= 80 ? "text-emerald-600" : posyandu.skor_kinerja >= 60 ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {posyandu.skor_kinerja}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              posyandu.kategori_kinerja === "Sangat Baik"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : posyandu.kategori_kinerja === "Baik"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : posyandu.kategori_kinerja === "Cukup"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {posyandu.kategori_kinerja}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ErrorCard
                  title="Data posyandu kosong"
                  message="API tidak mengembalikan daftar posyandu untuk periode ini."
                />
              )}
            </div>
          </div>
        )}

        {/* Detail Tab */}
        {activeTab === "detail" && (
            <div className="space-y-6">
              {/* Posyandu Selector */}
              {detailPosyanduTabs.length > 0 ? (
                <div className="overflow-x-auto pb-2">
                  <div className="flex min-w-max gap-2">
                    {detailPosyanduTabs.map((posyandu) => (
                      <button
                        key={posyandu.id}
                        onClick={() => {
                          setSelectedPosyandu(posyandu.detailId);
                          setActiveTab("detail");
                          setDetailTab("overview");
                        }}
                        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                          selectedPosyandu === posyandu.detailId
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {posyandu.nama_posyandu}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <ErrorCard
                  title="Data detail posyandu kosong"
                  message="API tidak mengembalikan daftar posyandu, jadi detail per posyandu tidak bisa ditampilkan."
                />
              )}

            {/* Selected Posyandu Detail */}
            {selectedPosyanduDetail && selectedPosyanduDetail.posyandu && selectedPosyanduDetail.stats ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-dark md:text-3xl dark:text-white">
                        {selectedPosyanduDetail.posyandu.nama_posyandu}
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {selectedPosyanduDetail.posyandu.nama_dusun}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Total Balita:</span>{" "}
                        <span className="font-medium text-dark dark:text-white">{selectedPosyanduDetail.stats.total_balita}</span>
                      </div>
                      <div className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
                        <span className="font-medium">Kader: {selectedPosyanduDetail.stats.total_kader}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                  <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{selectedPosyanduDetail.stats.total_balita}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Balita</p>
                  </div>
                  <div className="rounded-xl bg-pink-50 p-4 text-center dark:bg-pink-900/20">
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{selectedPosyanduDetail.stats.total_ibu_hamil}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Hamil</p>
                  </div>
                  <div className="rounded-xl bg-violet-50 p-4 text-center dark:bg-violet-900/20">
                    <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{selectedPosyanduDetail.stats.total_kader}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Kader</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedPosyanduDetail.stats.kehadiran_balita}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hadir Balita</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-900/20">
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{selectedPosyanduDetail.stats.kehadiran_ibu_hamil}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hadir Ibu Hamil</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{selectedPosyanduDetail.stats.status_stunting}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Stunting</p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{selectedPosyanduDetail.stats.status_gizi_buruk}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Gizi Buruk</p>
                  </div>
                  <div className="rounded-xl bg-teal-50 p-4 text-center dark:bg-teal-900/20">
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{selectedPosyanduDetail.stats.normal}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Normal</p>
                  </div>
                </div>

                {/* Sub Tabs */}
                <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "balita", label: "Data Balita" },
                    { id: "kader", label: "Kader" },
                    { id: "kinerja", label: "Kinerja" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id as typeof detailTab)}
                      className={`whitespace-nowrap rounded-t-lg px-4 py-3 font-medium transition ${
                        detailTab === tab.id
                          ? "bg-white text-primary dark:bg-gray-dark dark:text-primary"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sub Tab Content */}
                <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                  {/* Overview Tab */}
                  {detailTab === "overview" && (
                    <div className="space-y-6">
                      {/* Kehadiran Progress */}
                      <div>
                        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Tingkat Kehadiran</h3>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Persentase Kehadiran</span>
                            <span className={`text-2xl font-bold ${
                              selectedPosyanduDetail.stats!.persentase_kehadiran >= 80 ? "text-emerald-600" : selectedPosyanduDetail.stats!.persentase_kehadiran >= 60 ? "text-yellow-600" : "text-red-600"
                            }`}>
                              {selectedPosyanduDetail.stats!.persentase_kehadiran}%
                            </span>
                          </div>
                          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-full rounded-full transition-all ${
                                selectedPosyanduDetail.stats!.persentase_kehadiran >= 80 ? "bg-emerald-500" : selectedPosyanduDetail.stats!.persentase_kehadiran >= 60 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${selectedPosyanduDetail.stats!.persentase_kehadiran}%` }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>

                            {/* Monthly Trend */}
                      <div>
                        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Tren Kehadiran 6 Bulan Terakhir</h3>
                        <div className="flex items-end gap-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                          {overviewAttendanceTrend.map((month, index) => {
                            const maxValue = Math.max(...overviewAttendanceTrend.map((item) => item.jumlah_hadir), 1);
                            const height = (month.jumlah_hadir / maxValue) * 100;
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
                          })}
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
                      {overviewKasusKritis.length > 0 ? (
                        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                          <div className="mb-3 flex items-center gap-2">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Kasus Kritis di Posyandu Ini</h3>
                          </div>
                          <div className="space-y-2">
                            {overviewKasusKritis.slice(0, 5).map((child) => (
                              <div key={child.id} className="flex items-center justify-between rounded bg-white p-3 dark:bg-gray-800">
                                <div>
                                  <p className="font-medium text-dark dark:text-white">{child.nama_anak}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {child.usia_bulan} bulan - {child.status_gizi}
                                    {child.status_stunting === "Stunting" && " - Stunting"}
                                  </p>
                                </div>
                                <Link href="/monitoring/kasus-kritis" className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700">
                                  Detail
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <ErrorCard title="Data kasus kritis kosong" message="API tidak mengembalikan kasus kritis untuk posyandu ini." />
                      )}

                    </div>
                  )}
                  {/* Balita Tab */}
                  {detailTab === "balita" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-dark dark:text-white">Daftar Semua Balita di Posyandu</h3>
                        <div className="flex gap-2">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Total: {totalBalitaRows} balita
                          </span>
                        </div>
                      </div>
                      {balitaTableData.length > 0 ? (
                        <div className="space-y-4">
                          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/80">
                                  <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Balita</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Ibu</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tanggal Lahir</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Jenis Kelamin</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Usia</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">BB / TB</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Gizi</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Prioritas</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-dark">
                                  {balitaTableData.map((child, index) => (
                                    <tr key={`summary-${child.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{((detailBalitaPage - 1) * detailBalitaLimit) + index + 1}</td>
                                      <td className="px-4 py-3 font-medium text-dark dark:text-white">{child.nama_anak}</td>
                                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{child.nama_ibu}</td>
                                      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{child.tanggal_lahir}</td>
                                      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                                        {child.jenis_kelamin === "l" ? "L" : child.jenis_kelamin === "p" ? "P" : child.jenis_kelamin}
                                      </td>
                                      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{child.usia_label}</td>
                                      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                                        {child.berat_badan != null && child.tinggi_badan != null ? `${child.berat_badan} / ${child.tinggi_badan}` : "tidak hadir"}
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                          child.status_gizi === "Gizi Buruk"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            : child.status_gizi === "Gizi Kurang"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                            : child.status_gizi === "Gizi Lebih"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        }`}>
                                          {child.status_gizi}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                          child.prioritas === "sangat_tinggi"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            : child.prioritas === "tinggi"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                            : child.prioritas === "sedang"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        }`}>
                                          {child.prioritas === "sangat_tinggi" ? "Sangat Tinggi"
                                            : child.prioritas === "tinggi" ? "Tinggi"
                                            : child.prioritas === "sedang" ? "Sedang"
                                            : child.prioritas}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        <div className="hidden overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">NIK</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Anak</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Jenis Kelamin</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tanggal Lahir</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Usia (Bulan)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama Ibu</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">BB (kg)</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">TB (cm)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Gizi</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status Stunting</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Prioritas</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {balitaTableData.map((child, index) => (
                                <tr key={child.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{((detailBalitaPage - 1) * detailBalitaLimit) + index + 1}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{child.nik_anak}</td>
                                  <td className="px-4 py-3 font-medium text-dark dark:text-white">{child.nama_anak}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                      child.jenis_kelamin === "Laki-laki"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        : child.jenis_kelamin === "Perempuan"
                                        ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                    }`}>
                                      {child.jenis_kelamin === "Laki-laki" ? "L" : "P"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    {child.tanggal_lahir !== "-" ? new Date(child.tanggal_lahir).toLocaleDateString('id-ID') : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{child.usia_bulan}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{child.nama_ibu}</td>
                                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{child.berat_badan}</td>
                                  <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{child.tinggi_badan}</td>
                                  <td className="px-4 py-3">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                      child.status_gizi === "Gizi Buruk"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        : child.status_gizi === "Gizi Kurang"
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                        : child.status_gizi === "Gizi Lebih"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    }`}>
                                      {child.status_gizi}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                      child.status_stunting === "Stunting"
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                        : child.status_stunting === "-"
                                        ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    }`}>
                                      {child.status_stunting}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                      child.prioritas === "Sangat Tinggi"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        : child.prioritas === "Tinggi"
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                        : child.prioritas === "-"
                                        ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    }`}>
                                      {child.prioritas}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        </div>
                      ) : (
                        <ErrorCard
                          title="Data balita kosong"
                          message="API tidak mengembalikan daftar balita untuk posyandu ini."
                        />
                      )}
                      {detailBalitaData?.pagination && totalBalitaPages > 1 && (
                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Halaman {detailBalitaPage} dari {totalBalitaPages}
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailBalitaPage((prev) => Math.max(1, prev - 1))}
                              disabled={detailBalitaPage <= 1}
                              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                              Sebelumnya
                            </button>
                            <button
                              type="button"
                              onClick={() => setDetailBalitaPage((prev) => Math.min(totalBalitaPages, prev + 1))}
                              disabled={detailBalitaPage >= totalBalitaPages}
                              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Berikutnya
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Kader Tab */}
                  {detailTab === "kader" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-dark dark:text-white">Daftar Kader Posyandu</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {kaderDetailCards.map((kader) => (
                          <div key={kader.id} className="rounded-lg border border-gray-200 p-4 transition hover:shadow-md dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                                {kader.nama_kader.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-dark dark:text-white">{kader.nama_kader}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{kader.role}</p>
                                <div className="hidden mt-2 flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>{kader.durasi_kerja_posyandu} jam kerja</span>
                                  <span>{kader.durasi_kunjungan_rumah} jam kunjungan</span>
                                  <span>{kader.jarak_kunjungan} km jarak</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>Balita didampingi: {kader.durasi_kerja_posyandu}</span>
                                  <span>Ibu hamil didampingi: {kader.durasi_kunjungan_rumah}</span>
                                  <span>Total sasaran: {kader.jarak_kunjungan}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  kader.kategori_beban === "Tinggi"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : kader.kategori_beban === "Sedang"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                }`}>
                                  {kader.kategori_beban}
                                </span>
                                <p className="mt-1 text-sm font-bold text-dark dark:text-white">{kader.skor_beban_kerja} skor</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {kaderDetailCards.length === 0 && (
                        <ErrorCard
                          title="Data kader kosong"
                          message="API tidak mengembalikan data kader untuk posyandu ini."
                        />
                      )}
                    </div>
                  )}

                  {/* Kinerja Tab */}
                  {detailTab === "kinerja" && selectedPosyanduDetail.performance && (
                    <div className="space-y-6">
                      {kinerjaPerPosyanduLoading ? (
                        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                          Memuat data kinerja posyandu...
                        </div>
                      ) : kinerjaPerPosyanduData ? (
                        <>
                          {/* Header: judul kiri, ringkasan kanan */}
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600">
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <h2 className="text-lg font-bold text-dark dark:text-white">Durasi Kerja Posyandu</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Tren kerja posyandu, kunjungan rumah, dan jarak tempuh kader
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                              <div className="text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Kerja Posyandu</p>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                  {kinerjaPerPosyanduData.ringkasan.kerja_posyandu_jam} jam
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Kunjungan Rumah</p>
                                <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                                  {kinerjaPerPosyanduData.ringkasan.kunjungan_rumah_jam} jam
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Jarak Tempuh</p>
                                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                                  {kinerjaPerPosyanduData.ringkasan.jarak_tempuh_km} km
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Grafik */}
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div>
                              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                Median Durasi Kerja (Jam)
                              </h3>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart
                                    data={kinerjaPerPosyanduData.tren.durasi_kerja.map((item) => ({
                                      bulan: item.bulan,
                                      kerjaPosyandu: item.kerja_posyandu,
                                      kunjunganRumah: item.kunjungan_rumah,
                                    }))}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={{ stroke: "#e5e7eb" }} />
                                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={{ stroke: "#e5e7eb" }} />
                                    <Tooltip formatter={(value: number, name: string) => [`${value} jam`, name === "kerjaPosyandu" ? "Kerja Posyandu" : "Kunjungan Rumah"]} />
                                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: "10px" }} formatter={(value) => value === "kerjaPosyandu" ? "Kerja Posyandu" : "Kunjungan Rumah"} />
                                    <Line type="monotone" dataKey="kerjaPosyandu" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="kunjunganRumah" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7, strokeWidth: 0 }} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            <div>
                              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                                Median Jarak Tempuh (Km)
                              </h3>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart
                                    data={kinerjaPerPosyanduData.tren.jarak_tempuh.map((item) => ({
                                      bulan: item.bulan,
                                      jarak: item.km,
                                    }))}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={{ stroke: "#e5e7eb" }} />
                                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={{ stroke: "#e5e7eb" }} />
                                    <Tooltip formatter={(value: number) => [`${value} km`, "Jarak Tempuh"]} />
                                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: "10px" }} formatter={() => "Jarak Tempuh"} />
                                    <Line type="monotone" dataKey="jarak" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 7, strokeWidth: 0 }} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <ErrorCard
                          title="Data kinerja kosong"
                          message="API tidak mengembalikan data kinerja untuk posyandu ini."
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : detailPosyanduTabs.length > 0 ? (
              <ErrorCard
                title="Detail posyandu tidak tersedia"
                message="API tidak mengembalikan data detail untuk posyandu yang dipilih."
              />
            ) : null}

            {!selectedPosyandu && detailPosyanduTabs.length > 0 && (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2">Pilih posyandu untuk melihat detail kinerja</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KinerjaPosyanduPage;


