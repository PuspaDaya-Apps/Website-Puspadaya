"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PosyanduPerformance, CriticalChild, KaderWorkload } from "@/types/dashboard-kepala-desa";
import { fetchDetailPosyanduKinerja, fetchDetailPosyanduOverview, fetchDetailPosyanduRingkasan } from "@/app/api/detail-dashboard-kepala-desa";
import {
  fetchKinerjaRingkasan,
  type DashboardKepalaDesaQueryParams,
} from "@/app/api/dashboard-kinerja-kepala-desa";
import { fetchTrenDataPosyandu } from "@/app/api/dashboard-kepala-desa";
import { fetchKinerjaPerhatianKhusus } from "@/app/api/dashboard-kinerja-kepala-desa";
import {
  DetailPosyanduOverviewData,
  DetailPosyanduKinerjaData,
  DetailPosyanduRingkasanData,
  KinerjaPosyanduPerhatianKhususItem,
  TrenDataPosyanduItem,
} from "@/types/kepala-desa";
import { posyanduPerformanceData, posyanduListData, criticalChildrenData, kaderWorkloadData, monthlyTrendData, allChildrenData } from "@/data/dummy-dashboard-kepala-desa";
import DurasiJarakAgregat from "@/components/Dashboard/component-desa/DurasiJarakAgregat";
import { dashboardSummaryData } from "@/data/dummy-dashboard-kepala-desa";
import { createPosyanduDetailToken } from "@/utils/posyanduDetailToken";

interface CurrentUserLocation {
  kabupaten_kota?: {
    nama_kabupaten_kota?: string;
  };
  desa_kelurahan?: {
    nama_desa_kelurahan?: string;
  };
}

const KinerjaPosyanduPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ranking" | "detail">("ranking");
  const [selectedPosyandu, setSelectedPosyandu] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "balita" | "kader" | "kinerja">("overview");
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
  } | null>(null);
  const [trenData, setTrenData] = useState<TrenDataPosyanduItem[] | null>(null);
  const [detailOverviewData, setDetailOverviewData] = useState<DetailPosyanduOverviewData | null>(null);
  const [detailKinerjaData, setDetailKinerjaData] = useState<DetailPosyanduKinerjaData | null>(null);
  const [detailRingkasanData, setDetailRingkasanData] = useState<DetailPosyanduRingkasanData | null>(null);
  const [perhatianKhususData, setPerhatianKhususData] = useState<KinerjaPosyanduPerhatianKhususItem[] | null>(null);
  const [perhatianKhususLoading, setPerhatianKhususLoading] = useState(true);
  const [perhatianKhususPage, setPerhatianKhususPage] = useState(1);
  const [userLocation, setUserLocation] = useState<Pick<DashboardKepalaDesaQueryParams, "kabupatenKota" | "desa">>({});
  const currentDate = new Date();
  const currentBulan = currentDate.getMonth() + 1;
  const currentTahun = currentDate.getFullYear();
  const perhatianKhususItemsPerPage = 4;

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

  useEffect(() => {
    setUserLocation(getCurrentUserLocation());
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadRingkasan = async () => {
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
      } else {
        setRingkasanData(null);
      }
    };

    loadRingkasan();

    return () => {
      isMounted = false;
    };
  }, [currentBulan, currentTahun, userLocation]);

  useEffect(() => {
    let isMounted = true;

    const loadTrenData = async () => {
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
      } else {
        setTrenData(null);
      }
    };

    loadTrenData();

    return () => {
      isMounted = false;
    };
  }, [currentBulan, currentTahun, userLocation]);

  useEffect(() => {
    let isMounted = true;

    const loadPerhatianKhusus = async () => {
      setPerhatianKhususLoading(true);

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
      } else {
        setPerhatianKhususData(null);
      }

      setPerhatianKhususLoading(false);
    };

    loadPerhatianKhusus();

    return () => {
      isMounted = false;
    };
  }, [currentBulan, currentTahun, userLocation]);

  const openPosyanduDetail = (posyanduId: string) => {
    const token = createPosyanduDetailToken({
      idPosyandu: posyanduId,
      bulan: currentBulan,
      tahun: currentTahun,
    });
    router.push(`/monitoring/posyandu/${token}`);
  };

  // Sort posyandu by performance
  const sortedPosyandu = useMemo(() => {
    return [...posyanduPerformanceData].sort((a, b) => b.skor_kinerja - a.skor_kinerja);
  }, []);

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

  const listPosyandu = apiPosyanduList.length > 0 ? apiPosyanduList : posyanduPerformanceData
    .map((performance) => {
      const info = posyanduListData.find((p) => p.id === performance.posyandu_id);

      return {
        id: performance.posyandu_id,
        nama_posyandu: performance.nama_posyandu,
        nama_dusun: info?.nama_dusun ?? "",
        nama_kecamatan: info?.nama_kecamatan ?? "",
        nama_kabupaten_kota: info?.nama_kabupaten_kota ?? "",
        total_balita: info?.total_balita ?? 0,
        total_ibu_hamil: info?.total_ibu_hamil ?? 0,
        total_kader: info?.total_kader ?? 0,
        kehadiran_balita_bulan_ini: info?.kehadiran_balita_bulan_ini ?? 0,
        kehadiran_ibu_hamil_bulan_ini: info?.kehadiran_ibu_hamil_bulan_ini ?? 0,
        status_stunting: info?.status_stunting ?? 0,
        status_gizi_buruk: info?.status_gizi_buruk ?? 0,
        persentase_kehadiran: performance.kehadiran,
        skor_kinerja: performance.skor_kinerja,
        kategori_kinerja: performance.kategori,
        ranking: performance.posyandu_id ? Number(performance.posyandu_id) : 0,
        last_updated: info?.last_updated ?? "",
      };
    })
    .sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0));

  const detailPosyanduTabs = useMemo(() => {
    const source = apiPosyanduList.length > 0 ? apiPosyanduList : listPosyandu;

    return source.map((posyandu) => {
      const matchedDummyPosyandu = posyanduListData.find(
        (item) => item.id === posyandu.id || item.nama_posyandu === posyandu.nama_posyandu
      );
      const matchedPerformance = posyanduPerformanceData.find(
        (item) => item.posyandu_id === posyandu.id || item.nama_posyandu === posyandu.nama_posyandu
      );

      return {
        id: posyandu.id,
        detailId: matchedDummyPosyandu?.id ?? matchedPerformance?.posyandu_id ?? posyandu.id,
        nama_posyandu: posyandu.nama_posyandu,
      };
    });
  }, [apiPosyanduList, listPosyandu]);

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

    return [...sortedPosyandu]
      .slice(-4)
      .reverse()
      .map((posyandu, index) => {
        const posyanduInfo = posyanduListData.find(
          (p) => p.id === posyandu.posyandu_id || p.nama_posyandu === posyandu.nama_posyandu
        );

        return {
          rank: sortedPosyandu.length - index,
          id_posyandu: Number(posyandu.posyandu_id),
          nama_posyandu: posyandu.nama_posyandu,
          lokasi: posyanduInfo?.nama_dusun ?? "",
          skor: posyandu.skor_kinerja,
          kategori: posyandu.kategori,
        };
      });
  }, [perhatianKhususData, sortedPosyandu]);

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
  const top3 = apiTop3.length > 0 ? apiTop3 : sortedPosyandu.slice(0, 3);

  // Calculate average scores
  const avgScore = ringkasanData?.rata_rata_skor ?? Math.round(
    posyanduPerformanceData.reduce((sum, p) => sum + p.skor_kinerja, 0) / posyanduPerformanceData.length
  );

  // Get category counts
  const categoryCounts = useMemo(() => {
    return {
      sangatBaik: ringkasanData?.kategori_posyandu?.sangat_baik ?? posyanduPerformanceData.filter((p) => p.kategori === "Sangat Baik").length,
      baik: ringkasanData?.kategori_posyandu?.baik ?? posyanduPerformanceData.filter((p) => p.kategori === "Baik").length,
      cukup: ringkasanData?.kategori_posyandu?.cukup ?? posyanduPerformanceData.filter((p) => p.kategori === "Cukup").length,
      kurang: ringkasanData?.kategori_posyandu?.kurang ?? posyanduPerformanceData.filter((p) => p.kategori === "Kurang").length,
    };
  }, [ringkasanData]);

  const totalPosyandu = ringkasanData?.total_posyandu ?? listPosyandu.length;

  // Get selected posyandu detail
  const selectedPosyanduDetail = useMemo(() => {
    if (!selectedPosyanduResolvedId && !selectedPosyanduResolvedName) return null;

    const selectedListItem = listPosyandu.find(
      (item) => item.id === selectedPosyanduApiId || item.id === selectedPosyanduResolvedId || item.nama_posyandu === selectedPosyanduResolvedName
    );
    const performance = posyanduPerformanceData.find(
      (p) => p.posyandu_id === selectedPosyanduResolvedId || p.nama_posyandu === selectedPosyanduResolvedName
    );
    const posyanduFromDummy = posyanduListData.find(
      (p) => p.id === selectedPosyanduResolvedId || p.nama_posyandu === selectedPosyanduResolvedName
    );

    // Filter data for this posyandu
    const criticalChildren = criticalChildrenData.filter((c) => c.posyandu_id === selectedPosyanduResolvedId);
    const allChildren = allChildrenData.filter((c) => c.posyandu_id === selectedPosyanduResolvedId);
    const kaderList = kaderWorkloadData.filter((k) => k.posyandu_id === selectedPosyanduResolvedId);

    // Calculate stats
    const stats = overviewStats
      ? {
          total_balita: overviewStats.total_balita,
          total_ibu_hamil: detailRingkasanData?.ringkasan?.total_ibu_hamil ?? posyanduFromDummy?.total_ibu_hamil ?? selectedListItem?.total_ibu_hamil ?? 0,
          total_kader: detailRingkasanData?.ringkasan?.total_kader ?? posyanduFromDummy?.total_kader ?? selectedListItem?.total_kader ?? 0,
          kehadiran_balita: overviewStats.kehadiran_balita,
          kehadiran_ibu_hamil: detailRingkasanData?.ringkasan?.hadir_ibu_hamil ?? posyanduFromDummy?.kehadiran_ibu_hamil_bulan_ini ?? selectedListItem?.kehadiran_ibu_hamil_bulan_ini ?? 0,
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
      : posyanduFromDummy
        ? {
            total_balita: posyanduFromDummy.total_balita,
            total_ibu_hamil: posyanduFromDummy.total_ibu_hamil,
            total_kader: posyanduFromDummy.total_kader,
            kehadiran_balita: posyanduFromDummy.kehadiran_balita_bulan_ini,
            kehadiran_ibu_hamil: posyanduFromDummy.kehadiran_ibu_hamil_bulan_ini,
            persentase_kehadiran: posyanduFromDummy.persentase_kehadiran,
            status_stunting: posyanduFromDummy.status_stunting,
            status_gizi_buruk: posyanduFromDummy.status_gizi_buruk,
            normal: posyanduFromDummy.total_balita - posyanduFromDummy.status_stunting - posyanduFromDummy.status_gizi_buruk,
          }
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
            : null;

    const posyandu = posyanduFromDummy ?? (selectedListItem
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
      : null);

    const resolvedPerformance = performance ?? (selectedListItem
      ? {
          posyandu_id: selectedPosyanduResolvedId ?? selectedListItem.id,
          nama_posyandu: selectedListItem.nama_posyandu,
          skor_kinerja: selectedListItem.skor_kinerja,
          kehadiran: selectedListItem.persentase_kehadiran,
          kategori: selectedListItem.kategori_kinerja,
        }
      : null);

    return { performance: resolvedPerformance, posyandu, criticalChildren, allChildren, kaderList, stats };
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

    return selectedPosyanduDetail?.criticalChildren ?? [];
  }, [detailOverviewData, selectedPosyanduDetail]);

  const overviewAttendanceTrend = useMemo(() => {
    if (detailKinerjaData?.kinerja?.tren_kehadiran_6_bulan?.length) {
      return detailKinerjaData.kinerja.tren_kehadiran_6_bulan;
    }

    return monthlyTrendData.map((item) => ({
      bulan: item.bulan,
      jumlah_hadir: item.balita,
    }));
  }, [detailKinerjaData]);

  useEffect(() => {
    let isMounted = true;

    const loadDetailOverview = async () => {
      if (!selectedPosyanduApiId) {
        setDetailOverviewData(null);
        return;
      }

      setDetailOverviewData(null);

      const result = await fetchDetailPosyanduOverview(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setDetailOverviewData(result.data);
      } else {
        setDetailOverviewData(null);
      }
    };

    const loadDetailRingkasan = async () => {
      if (!selectedPosyanduApiId) {
        setDetailRingkasanData(null);
        return;
      }

      setDetailRingkasanData(null);

      const result = await fetchDetailPosyanduRingkasan(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setDetailRingkasanData(result.data);
      } else {
        setDetailRingkasanData(null);
      }
    };

    const loadDetailKinerja = async () => {
      if (!selectedPosyanduApiId) {
        setDetailKinerjaData(null);
        return;
      }

      setDetailKinerjaData(null);

      const result = await fetchDetailPosyanduKinerja(selectedPosyanduApiId, {
        bulan: currentBulan,
        tahun: currentTahun,
      });

      if (!isMounted) {
        return;
      }

      if (result.successCode === 200 && result.data) {
        setDetailKinerjaData(result.data);
      } else {
        setDetailKinerjaData(null);
      }
    };

    loadDetailOverview();
    loadDetailRingkasan();
    loadDetailKinerja();

    return () => {
      isMounted = false;
    };
  }, [selectedPosyanduApiId, currentBulan, currentTahun]);

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
                <span>🏆</span> Top 3 Posyandu Terbaik
              </h3>
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
                  const posyanduInfo = posyanduListData.find((p) =>
                    p.id === normalizedPosyandu.id ||
                    p.id === normalizedPosyandu.posyandu_id ||
                    p.nama_posyandu === normalizedPosyandu.nama_posyandu
                  );
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
                      <p className="mt-1 text-sm text-white/80">{posyanduInfo?.nama_dusun}</p>
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
            </div>

            {/* Bottom 3 */}
            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-red-600 dark:text-red-400">
                  <span>!</span> Perlu Perhatian Khusus
                </h3>
                {!perhatianKhususLoading && perhatianKhususList.length > 4 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Menampilkan {perhatianKhususVisible.length} dari {perhatianKhususList.length} posyandu
                  </p>
                )}
              </div>

              {perhatianKhususLoading ? (
                <div className="rounded-xl border border-dashed border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
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
                        className="cursor-pointer rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 dark:border-red-800 dark:bg-red-900/20 dark:focus:ring-red-700"
                      >
                              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-200 text-sm font-bold text-red-700 dark:bg-red-800 dark:text-red-300">
                                    {posyandu.rank}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="truncate text-sm font-bold text-dark dark:text-white">{posyandu.nama_posyandu}</h4>
                                    <p className="truncate text-xs text-gray-600 dark:text-gray-400">{posyandu.lokasi}</p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-start gap-1 sm:items-end">
                                  <p className="text-2xl font-bold leading-none text-red-600 dark:text-red-400">
                                    {posyandu.skor}
                                  </p>
                                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-red-700 shadow-sm dark:bg-gray-800 dark:text-red-300">
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
                          className="rounded-lg border border-red-300 px-3 py-1.5 font-medium text-red-700 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-800 dark:text-red-300"
                        >
                          Sebelumnya
                        </button>
                        <span className="rounded-lg bg-red-100 px-3 py-1.5 font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          Halaman {perhatianKhususPage} dari {perhatianKhususTotalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPerhatianKhususPage((page) => Math.min(perhatianKhususTotalPages, page + 1))}
                          disabled={perhatianKhususPage === perhatianKhususTotalPages}
                          className="rounded-lg border border-red-300 px-3 py-1.5 font-medium text-red-700 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-800 dark:text-red-300"
                        >
                          Berikutnya
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                  Tidak ada data perhatian khusus.
                </div>
              )}
            </div>

            {/* All Posyandu List */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Semua Posyandu</h3>
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
                    {listPosyandu.map((posyandu, index) => {
                      const posyanduInfo = posyanduListData.find(
                        (p) => p.id === posyandu.id || p.nama_posyandu === posyandu.nama_posyandu
                      );
                      return (
                        <tr key={posyandu.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              {posyandu.ranking ?? index + 1}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-dark dark:text-white">{posyandu.nama_posyandu}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{posyanduInfo?.nama_dusun}</td>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Detail Tab */}
        {activeTab === "detail" && (
            <div className="space-y-6">
              {/* Posyandu Selector */}
              <div className="flex flex-wrap gap-2">
                {detailPosyanduTabs.map((posyandu) => {
                  const performance = posyanduPerformanceData.find(
                    (p) => p.posyandu_id === posyandu.detailId || p.nama_posyandu === posyandu.nama_posyandu
                  );
                  return (
                    <button
                      key={posyandu.id}
                      onClick={() => {
                        setSelectedPosyandu(posyandu.detailId);
                        setActiveTab("detail");
                        setDetailTab("overview");
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        selectedPosyandu === posyandu.detailId
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                  >
                    {posyandu.nama_posyandu}
                    {performance && performance.skor_kinerja < 60 && (
                      <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs">⚠️</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Posyandu Detail */}
            {selectedPosyanduDetail && selectedPosyanduDetail.posyandu && selectedPosyanduDetail.stats && (
              <div className="space-y-6">
                <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 dark:border-primary/40 dark:bg-primary/10">
                  <h3 className="text-sm font-semibold text-dark dark:text-white">Data Posyandu Terpilih</h3>
                  <div className="mt-3 grid gap-3 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">ID API</p>
                      <p className="font-medium text-dark dark:text-white">{selectedPosyanduApiId ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">ID Detail</p>
                      <p className="font-medium text-dark dark:text-white">{selectedPosyanduResolvedId ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Nama Posyandu</p>
                      <p className="font-medium text-dark dark:text-white">{selectedPosyanduResolvedName ?? "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Sumber Ringkasan</p>
                      <p className="font-medium text-dark dark:text-white">
                        {detailRingkasanData?.ringkasan ? "API detail-dashboard-kepala-desa" : "Fallback frontend"}
                      </p>
                    </div>
                  </div>
                </div>

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
                      {overviewKasusKritis.length > 0 && (
                        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                          <div className="mb-3 flex items-center gap-2">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                              ⚠️ Kasus Kritis di Posyandu Ini
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
                            Lihat semua {overviewKasusKritis.length} kasus kritis →
                          </Link>
                        </div>
                      )}

                
                    </div>
                  )}

                  {/* Balita Tab */}
                  {detailTab === "balita" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-dark dark:text-white">👶 Daftar Semua Balita di Posyandu</h3>
                        <div className="flex gap-2">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Total: {selectedPosyanduDetail.allChildren.length} balita
                          </span>
                        </div>
                      </div>
                      {selectedPosyanduDetail.allChildren.length > 0 ? (
                        <div className="overflow-x-auto">
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
                              {selectedPosyanduDetail.allChildren.map((child, index) => (
                                <tr key={child.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{index + 1}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{child.nik_anak}</td>
                                  <td className="px-4 py-3 font-medium text-dark dark:text-white">{child.nama_anak}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                      child.jenis_kelamin === "Laki-laki"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        : "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
                                    }`}>
                                      {child.jenis_kelamin === "Laki-laki" ? "♂ L" : "♀ P"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{new Date(child.tanggal_lahir).toLocaleDateString('id-ID')}</td>
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
                      ) : (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="mt-2">Tidak ada data balita di posyandu ini</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Kader Tab */}
                  {detailTab === "kader" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-dark dark:text-white">👥 Daftar Kader Posyandu</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {selectedPosyanduDetail.kaderList.map((kader) => (
                          <div key={kader.id} className="rounded-lg border border-gray-200 p-4 transition hover:shadow-md dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                                {kader.nama_kader.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-dark dark:text-white">{kader.nama_kader}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{kader.role}</p>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>⏱️ {kader.durasi_kerja_posyandu} jam kerja</span>
                                  <span>🏠 {kader.durasi_kunjungan_rumah} jam kunjungan</span>
                                  <span>📍 {kader.jarak_kunjungan} km jarak</span>
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
                    </div>
                  )}

                  {/* Kinerja Tab */}
                  {detailTab === "kinerja" && selectedPosyanduDetail.performance && (
                    <div className="space-y-6">
                      {/* Durasi Kerja Posyandu Chart */}
                      <DurasiJarakAgregat durasiJarak={dashboardSummaryData.durasi_jarak_agregat} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {!selectedPosyandu && (
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

