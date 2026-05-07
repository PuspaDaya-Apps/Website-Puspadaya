"use client";
import React, { useEffect, useMemo, useState } from "react";
import { CriticalChild } from "@/types/dashboard-kepala-desa";
import { criticalChildrenData } from "@/data/dummy-dashboard-kepala-desa";
import { fetchDataKasusKritisBalita, fetchDataKasusKritis, fetchDetailDataKasusKritis, type DashboardKepalaDesaQueryParams } from "@/app/api/dashboard-kinerja-kepala-desa";
import { KinerjaPosyanduKasusKritisData, KinerjaPosyanduKasusKritisDaftarPrioritasItem, KinerjaPosyanduDetailKasusKritisData, TrenDataPosyanduItem } from "@/types/kepala-desa";
import { fetchTrenDataPosyandu } from "@/app/api/dashboard-kepala-desa";

interface CurrentUserLocation {
  kabupaten_kota?: { nama_kabupaten_kota?: string };
  desa_kelurahan?: { nama_desa_kelurahan?: string };
}

type PosyanduCaseSummary = {
  posyandu_nama: string;
  total_balita: number;
  wasting_count: number;
  underweight_count: number;
  stunting_count: number;
  normal_count: number;
};

const KasusKritisPage: React.FC = () => {
  const [filterPosyanduId, setFilterPosyanduId] = useState<string>("");
  const [filterStatusGizi, setFilterStatusGizi] = useState<string>("");
  const [filterStatusPrioritas, setFilterStatusPrioritas] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [posyanduOptions, setPosyanduOptions] = useState<TrenDataPosyanduItem[]>([]);
  const [selectedChild, setSelectedChild] = useState<CriticalChild | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [apiData, setApiData] = useState<KinerjaPosyanduKasusKritisData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [daftarPrioritasData, setDaftarPrioritasData] = useState<KinerjaPosyanduKasusKritisDaftarPrioritasItem[] | null>(null);
  const [daftarPrioritasLoading, setDaftarPrioritasLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState<KinerjaPosyanduDetailKasusKritisData | null>(null);

  const currentDate = new Date();
  const currentBulan = currentDate.getMonth() + 1;
  const currentTahun = currentDate.getFullYear();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setApiLoading(true);

      const location: Pick<DashboardKepalaDesaQueryParams, "kabupatenKota" | "desa"> = (() => {
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
      })();

      const result = await fetchDataKasusKritisBalita({
        bulan: currentBulan,
        tahun: currentTahun,
        ...location,
      });

      if (!isMounted) return;

      if (result.successCode === 200 && result.data) {
        setApiData(result.data);
      } else {
        setApiData(null);
      }

      setApiLoading(false);
    };

    loadData();

    return () => { isMounted = false; };
  }, [currentBulan, currentTahun]);

  useEffect(() => {
    let isMounted = true;

    const loadPosyanduOptions = async () => {
      const result = await fetchTrenDataPosyandu({ bulan: currentBulan, tahun: currentTahun });
      if (!isMounted) return;
      if (result.successCode === 200 && result.data?.posyandu) {
        setPosyanduOptions(result.data.posyandu.filter((p) => p.id));
      }
    };

    loadPosyanduOptions();

    return () => { isMounted = false; };
  }, [currentBulan, currentTahun]);

  useEffect(() => {
    let isMounted = true;

    const loadDaftarPrioritas = async () => {
      setDaftarPrioritasLoading(true);

      const location: Pick<DashboardKepalaDesaQueryParams, "kabupatenKota" | "desa"> = (() => {
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
      })();

      const extraParams: Record<string, string> = {};
      if (filterPosyanduId) extraParams.id_posyandu = filterPosyanduId;
      if (filterStatusGizi) extraParams.status_gizi = filterStatusGizi;
      if (filterStatusPrioritas) extraParams.status_prioritas = filterStatusPrioritas;

      const result = await fetchDataKasusKritis({
        bulan: currentBulan,
        tahun: currentTahun,
        ...location,
        extraParams,
      });

      if (!isMounted) return;

      if (result.successCode === 200 && result.data?.daftar_prioritas) {
        setDaftarPrioritasData(result.data.daftar_prioritas);
      } else {
        setDaftarPrioritasData(null);
      }

      setDaftarPrioritasLoading(false);
    };

    loadDaftarPrioritas();

    return () => { isMounted = false; };
  }, [currentBulan, currentTahun, filterPosyanduId, filterStatusGizi, filterStatusPrioritas]);

  const getDisplayStatusLabel = (child: CriticalChild) => {
    if (child.status_wasting === "Wasting" || child.status_gizi === "Gizi Buruk") {
      return "Wasting";
    }

    if (child.status_gizi === "Gizi Kurang") {
      return "Underweight";
    }

    if (child.status_stunting === "Stunting") {
      return "Stunting";
    }

    if (child.status_gizi === "Gizi Baik") {
      return "Normal";
    }

    if (child.status_gizi === "Gizi Lebih") {
      return "Overweight";
    }

    return "-";
  };

  const getDisplayStatusColor = (status: string) => {
    switch (status) {
      case "Wasting":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Underweight":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "Stunting":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Normal":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Overweight":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const prioritasDisplayMap: Record<string, string> = {
    sangat_tinggi: "Sangat Tinggi",
    tinggi: "Tinggi",
    sedang: "Sedang",
  };

  const handleDetailClick = async (idAnak: string) => {
    setShowDetailModal(true);
    setDetailLoading(true);
    setSelectedDetailData(null);

    const location: Pick<DashboardKepalaDesaQueryParams, "kabupatenKota" | "desa"> = (() => {
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
    })();

    const result = await fetchDetailDataKasusKritis({
      bulan: currentBulan,
      tahun: currentTahun,
      ...location,
      extraParams: { id_anak: idAnak },
    });

    if (result.successCode === 200 && result.data) {
      setSelectedDetailData(result.data);
    }

    setDetailLoading(false);
  };

  const filteredChildren = useMemo(() => {
    return criticalChildrenData.filter((child) => {
      const selectedNama = filterPosyanduId
        ? posyanduOptions.find((p) => p.id === filterPosyanduId)?.nama
        : null;
      const matchPosyandu = !selectedNama || child.posyandu_nama === selectedNama;
      const displayStatus = getDisplayStatusLabel(child);
      const matchStatus =
        !filterStatusGizi || displayStatus.toLowerCase() === filterStatusGizi;
      const matchPrioritas =
        !filterStatusPrioritas || child.prioritas === prioritasDisplayMap[filterStatusPrioritas];
      const matchSearch =
        child.nama_anak.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.nama_ibu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.dusun.toLowerCase().includes(searchTerm.toLowerCase());
      return matchPosyandu && matchStatus && matchPrioritas && matchSearch;
    });
  }, [filterPosyanduId, filterStatusGizi, filterStatusPrioritas, searchTerm, posyanduOptions]);

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

    return {
      total: criticalChildrenData.length,
      wasting: criticalChildrenData.filter(
        (c) => c.status_wasting === "Wasting" || c.status_gizi === "Gizi Buruk",
      ).length,
      underweight: criticalChildrenData.filter((c) => c.status_gizi === "Gizi Kurang").length,
      stunting: criticalChildrenData.filter((c) => c.status_stunting === "Stunting").length,
      sangat_tinggi: criticalChildrenData.filter((c) => c.prioritas === "Sangat Tinggi").length,
      tinggi: criticalChildrenData.filter((c) => c.prioritas === "Tinggi").length,
      sedang: criticalChildrenData.filter((c) => c.prioritas === "Sedang").length,
    };
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

    const grouped = criticalChildrenData.reduce<Record<string, PosyanduCaseSummary>>((acc, child) => {
      if (!acc[child.posyandu_nama]) {
        acc[child.posyandu_nama] = {
          posyandu_nama: child.posyandu_nama,
          total_balita: 0,
          wasting_count: 0,
          underweight_count: 0,
          stunting_count: 0,
          normal_count: 0,
        };
      }

      const summary = acc[child.posyandu_nama];
      summary.total_balita += 1;

      if (child.status_wasting === "Wasting" || child.status_gizi === "Gizi Buruk") {
        summary.wasting_count += 1;
      }

      if (child.status_gizi === "Gizi Kurang") {
        summary.underweight_count += 1;
      }

      if (child.status_stunting === "Stunting") {
        summary.stunting_count += 1;
      }

      if (child.status_gizi === "Gizi Baik") {
        summary.normal_count += 1;
      }

      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.posyandu_nama.localeCompare(b.posyandu_nama));
  }, [apiData]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateAge = (tanggal_lahir: string) => {
    const birthDate = new Date(tanggal_lahir);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    return months;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
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

      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-xl font-bold text-dark dark:text-white md:text-2xl">
          Data Kasus Kritis per Posyandu
        </h2>
        {apiLoading ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Memuat data...
          </div>
        ) : (
        <>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Posyandu
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Wasting
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Underweight
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Stunting
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Normal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {perPosyanduStats.map((posyandu, index) => (
                <tr key={posyandu.posyandu_nama} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{index + 1}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-dark dark:text-white">{posyandu.posyandu_nama}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{posyandu.total_balita}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      {posyandu.wasting_count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                      {posyandu.underweight_count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      {posyandu.stunting_count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {posyandu.normal_count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {perPosyanduStats.length === 0 && (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Tidak ada data per posyandu</p>
          </div>
        )}
        </>
        )}
      </div>

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
                <option key={p.id} value={p.id ?? ""}>
                  {p.nama}
                </option>
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

      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        {daftarPrioritasLoading ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Memuat data...
          </div>
        ) : filteredDaftarPrioritas ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Prioritas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Anak
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Usia
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Posyandu/Dusun
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Pengukuran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDaftarPrioritas.map((item) => (
                    <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${getPriorityColor(item.prioritas)}`}></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.prioritas}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-dark dark:text-white">{item.anak.nama}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ibu: {item.anak.ibu}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{item.anak.usia_bulan} bulan</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-dark dark:text-white">{item.lokasi.posyandu}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.lokasi.dusun}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <p>BB: {item.pengukuran.berat_badan_kg} kg</p>
                          <p>TB: {item.pengukuran.tinggi_badan_cm} cm</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.status.map((s) => (
                            <span key={s} className={`rounded-full px-2 py-1 text-xs font-medium ${getDisplayStatusColor(s)}`}>
                              {s}
                            </span>
                          ))}
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
            {filteredDaftarPrioritas.length === 0 && (
              <div className="py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Tidak ada data yang sesuai dengan filter</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Prioritas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Anak
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Usia
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Posyandu/Dusun
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Pengukuran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredChildren.map((child) => {
                    const displayStatus = getDisplayStatusLabel(child);
                    return (
                      <tr key={child.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${getPriorityColor(child.prioritas)}`}></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{child.prioritas}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-dark dark:text-white">{child.nama_anak}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Ibu: {child.nama_ibu}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {calculateAge(child.tanggal_lahir)} bulan
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-dark dark:text-white">{child.posyandu_nama}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{child.dusun}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            <p>BB: {child.berat_badan} kg</p>
                            <p>TB: {child.tinggi_badan} cm</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${getDisplayStatusColor(displayStatus)}`}>
                              {displayStatus}
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
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                setSelectedChild(child);
                                setShowModal(true);
                              }}
                              className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                            >
                              Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredChildren.length === 0 && (
              <div className="py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Tidak ada data yang sesuai dengan filter</p>
              </div>
            )}
          </>
        )}
      </div>

      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-dark">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">
                  {detailLoading ? "Memuat..." : (selectedDetailData?.anak.nama ?? "Detail Anak")}
                </h2>
                {selectedDetailData && (
                  <p className="text-gray-600 dark:text-gray-400">ID: {selectedDetailData.anak.id_anak}</p>
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
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.anak.nik}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tanggal Lahir</span>
                      <span className="font-medium text-dark dark:text-white">{formatDate(selectedDetailData.anak.tanggal_lahir)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Usia</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.anak.usia_bulan} bulan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Jenis Kelamin</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.anak.jenis_kelamin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nama Ibu</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.anak.nama_ibu}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Lokasi</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Posyandu</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.lokasi.posyandu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Dusun</span>
                      <span className="font-medium text-dark dark:text-white">{selectedDetailData.lokasi.dusun}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Pengukuran Terakhir</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Berat Badan</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{selectedDetailData.pengukuran_terakhir.berat_badan_kg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tinggi Badan</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{selectedDetailData.pengukuran_terakhir.tinggi_badan_cm} cm</span>
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
                      {selectedDetailData.status_kesehatan.map((s) => (
                        <span key={s} className={`rounded-full px-3 py-1 text-sm font-medium ${getDisplayStatusColor(s)}`}>
                          {s}
                        </span>
                      ))}
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
                        <div className={`h-2 w-2 rounded-full ${getPriorityColor(selectedDetailData.prioritas)}`}></div>
                        {selectedDetailData.prioritas}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                Gagal memuat data detail.
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-dark">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">{selectedChild.nama_anak}</h2>
                <p className="text-gray-600 dark:text-gray-400">NIK: {selectedChild.nik_anak}</p>
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
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Informasi Pribadi</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tanggal Lahir</span>
                    <span className="font-medium text-dark dark:text-white">{formatDate(selectedChild.tanggal_lahir)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Usia</span>
                    <span className="font-medium text-dark dark:text-white">{calculateAge(selectedChild.tanggal_lahir)} bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Jenis Kelamin</span>
                    <span className="font-medium text-dark dark:text-white">{selectedChild.jenis_kelamin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Nama Ibu</span>
                    <span className="font-medium text-dark dark:text-white">{selectedChild.nama_ibu}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Lokasi</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Posyandu</span>
                    <span className="font-medium text-dark dark:text-white">{selectedChild.posyandu_nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dusun</span>
                    <span className="font-medium text-dark dark:text-white">{selectedChild.dusun}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Pengukuran Terakhir</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Berat Badan</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{selectedChild.berat_badan} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tinggi Badan</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{selectedChild.tinggi_badan} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tanggal</span>
                    <span className="font-medium text-dark dark:text-white">{formatDate(selectedChild.tanggal_pengukuran)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">Status Kesehatan</h3>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${getDisplayStatusColor(getDisplayStatusLabel(selectedChild))}`}>
                      {getDisplayStatusLabel(selectedChild)}
                    </span>
                    {selectedChild.status_stunting === "Stunting" && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        Stunting
                      </span>
                    )}
                    {selectedChild.status_wasting === "Wasting" && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Wasting
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Prioritas: </span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                        selectedChild.prioritas === "Sangat Tinggi"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : selectedChild.prioritas === "Tinggi"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(selectedChild.prioritas)}`}></div>
                      {selectedChild.prioritas}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KasusKritisPage;
