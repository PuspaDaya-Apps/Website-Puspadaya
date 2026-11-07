"use client";
import React, { useMemo, useState } from "react";
import { PosyanduItem } from "@/types/dashboard-kepala-desa";
import { useSeniorMode } from "@/contexts/SeniorModeContext";
import {
  useAnakCakupanDilayani,
  useDurasiKerjaPosyandu,
  useImunisasiKependudukan,
  useInformasiDataDesa,
  useLogAktivitasKader,
  useSkorBebanKerjaTim,
  useStatistikDataDesa,
  useStatistikSkdn,
  useTrenDataPosyandu,
} from "@/hooks/dashboard";
import DashboardLoader from "../DashboardLoader";
import DashboardError from "../DashboardError";
import PanduanDashboard, { LangkahPanduan } from "../PanduanDashboard";

// Enam langkah, bukan satu langkah per kartu: halaman ini punya puluhan
// elemen, dan panduan sepanjang itu justru menjelaskan labirin. Isinya dipilih
// yang paling sering dipakai kepala desa, urut dari atas ke bawah halaman.
const LANGKAH_PANDUAN: LangkahPanduan[] = [
  {
    id: "periode",
    judul: "Pilih bulan dan tahun",
    isi: "Semua angka di halaman ini mengikuti bulan yang Anda pilih di sini. Ganti bulannya untuk melihat data periode lain.",
  },
  {
    id: "angka-utama",
    judul: "Angka utama desa Anda",
    isi: "Ringkasan jumlah posyandu, kader, balita, dan ibu hamil, beserta jumlah kasus gizi. Ini bagian yang paling sering ditanyakan saat rapat desa.",
  },
  {
    id: "daftar-posyandu",
    judul: "Daftar posyandu",
    isi: "Semua posyandu di desa Anda beserta jumlah balita dan tingkat kehadirannya. Klik salah satu untuk melihat rinciannya.",
  },
  {
    id: "tren",
    judul: "Perkembangan tiap bulan",
    isi: "Grafik di sini memperlihatkan naik turunnya kehadiran dan kasus gizi dari bulan ke bulan, supaya Anda tahu keadaan membaik atau memburuk.",
  },
  {
    id: "skdn",
    judul: "SKDN: siapa yang datang dan ditimbang",
    isi: "S jumlah seluruh balita, K yang punya buku KIA, D yang datang ditimbang, N yang berat badannya naik. Selisih S dan D menunjukkan berapa balita yang belum terpantau.",
  },
  {
    id: "beban-kader",
    judul: "Beban kerja kader",
    isi: "Memperlihatkan kader mana yang bebannya paling berat. Kalau banyak yang masuk kategori tinggi, mungkin desa Anda perlu menambah kader.",
  },
];

// New hierarchical components
import KeyMetrics from "../component-desa/KeyMetrics";
import PosyanduOverview from "../component-desa/PosyanduOverview";
import PerformanceSection from "../component-desa/PerformanceSection";
import AdditionalMetrics from "../component-desa/AdditionalMetrics";
import ProgresStatusGizi from "../component-desa/ProgresStatusGizi";
import DurasiJarakAgregat from "../component-desa/DurasiJarakAgregat";
import BebanKerjaTimSummary from "../component-desa/BebanKerjaTimSummary";
import SKDNBarChart from "../component-desa/SKDNBarChart";
import ExpandableDataSection from "../component-desa/ExpandableDataSection";

// Senior-friendly components
import DashboardSederhana from "./DashboardSederhana";
import AccessibilityControls from "./AccessibilityControls";

const DashboardKepalaDesa: React.FC = () => {
  const [selectedPosyandu, setSelectedPosyandu] = useState<PosyanduItem | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState<number>(new Date().getFullYear());
  const [totalPosyandu, setTotalPosyandu] = useState<number>(0);

  const { isSeniorMode } = useSeniorMode();

  const periode = useMemo(
    () => ({ bulan: selectedMonth, tahun: filterTahun }),
    [selectedMonth, filterTahun]
  );

  // Semua query di bawah ini sudah dipanggil juga oleh komponen anak dengan
  // queryKey yang sama, jadi React Query men-dedupe-nya: tidak ada request
  // tambahan, hanya satu tempat untuk menahan tampilan sampai semuanya siap.
  // Mode senior punya dashboard sendiri, jadi query di sini dimatikan.
  const periodeOptions = { enabled: !isSeniorMode };
  const dashboardQueries = [
    useInformasiDataDesa(periode, periodeOptions),
    useTrenDataPosyandu(periode, periodeOptions),
    useStatistikDataDesa(periode, periodeOptions),
    useAnakCakupanDilayani(periode, periodeOptions),
    useStatistikSkdn(periode, periodeOptions),
    useDurasiKerjaPosyandu(periode, periodeOptions),
    useSkorBebanKerjaTim(periode, periodeOptions),
    useImunisasiKependudukan(periode, periodeOptions),
    useLogAktivitasKader(periode, periodeOptions),
  ];
  const isDashboardLoading = dashboardQueries.some((query) => query.isPending);

  // Kalau query gagal, isinya tidak boleh dirender: tiap kartu punya fallback
  // `?? 0`, sehingga kegagalan tampil sebagai deretan angka 0 yang terbaca
  // sebagai data asli ("Total Balita 0"), bukan sebagai data yang tidak
  // diketahui. Kesembilan query menembak backend dan token yang sama, jadi
  // kegagalan praktis selalu menyeluruh.
  const isDashboardError = dashboardQueries.some((query) => query.isError);
  const muatUlangDashboard = () => {
    dashboardQueries.forEach((query) => {
      void query.refetch();
    });
  };

  // Daftar bulan
  const daftarBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Daftar tahun (tahun sekarang dan 2 tahun sebelumnya)
  const tahunSekarang = new Date().getFullYear();
  const daftarTahun = [tahunSekarang, tahunSekarang - 1, tahunSekarang - 2];

  // Print report function - Open in new tab
  const handlePrintReport = () => {
    window.open("/preview-laporan", "_blank");
  };

  // Show PDF Preview
  const handleShowPDFPreview = () => {
    window.open("/preview-laporan", "_blank");
  };

  // If senior mode is enabled, show simplified dashboard
  if (isSeniorMode) {
    return (
      <>
        <AccessibilityControls onPrint={handleShowPDFPreview} />
        <DashboardSederhana onPrintReport={handlePrintReport} />
      </>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Accessibility Controls - Always visible */}
      <AccessibilityControls onPrint={handleShowPDFPreview} />

      {/* Page Header */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
              Dashboard Kepala Desa
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Monitor dan kelola semua posyandu di wilayah Anda
            </p>
          </div>
          <div className="flex items-center gap-3" data-panduan="periode">
            {/* Filter Periode - Bulan */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {daftarBulan.map((bulan, index) => (
                <option key={index} value={index + 1}>
                  {bulan}
                </option>
              ))}
            </select>

            {/* Filter Periode - Tahun */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
              value={filterTahun}
              onChange={(e) => setFilterTahun(Number(e.target.value))}
            >
              {daftarTahun.map((tahun) => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>

            {/* Jumlahnya baru diisi PosyanduOverview setelah data masuk, jadi
                selama loading badge ini disembunyikan daripada menampilkan 0
                yang terbaca sebagai angka asli. */}
            {!isDashboardLoading && (
              <div className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
                <span className="font-medium">{totalPosyandu} Posyandu</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Satu loading untuk seluruh isi dashboard. Header dan filter periode di
          atas sengaja tetap tampil supaya user bisa ganti periode lagi tanpa
          menunggu request selesai. */}
      {isDashboardLoading ? (
        <DashboardLoader />
      ) : isDashboardError ? (
        <DashboardError
          pesan="Gagal memuat data dashboard. Periksa koneksi Anda, lalu coba lagi."
          onRetry={muatUlangDashboard}
        />
      ) : (
        <>
      {/* LEVEL 2: KEY METRICS - Indikator Kunci */}
      <div data-panduan="angka-utama">
      <KeyMetrics
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />
      </div>

      {/* LEVEL 3: POSYANDU OVERVIEW - Daftar Posyandu */}
      <div data-panduan="daftar-posyandu">
      <PosyanduOverview
        selectedPosyandu={selectedPosyandu}
        onSelectPosyandu={setSelectedPosyandu}
        onTotalPosyanduChange={setTotalPosyandu}
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />
      </div>

      {/* Selected Posyandu Detail Banner */}
      {selectedPosyandu && (
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                {selectedPosyandu.nama_posyandu}
              </h2>
              {/* API tren hanya mengirim dusun; kecamatan dan kabupaten datang
                  sebagai string kosong. Dirangkai lewat filter supaya tidak
                  tampil sebagai "Dusun Krajan, , ". */}
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {[
                  selectedPosyandu.nama_dusun,
                  selectedPosyandu.nama_kecamatan,
                  selectedPosyandu.nama_kabupaten_kota,
                ]
                  .filter((bagian) => bagian && bagian.trim().length > 0)
                  .join(", ")}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedPosyandu.total_balita}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Balita</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{selectedPosyandu.total_ibu_hamil}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Hamil</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{selectedPosyandu.total_kader}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Kader</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3: PERFORMANCE & TRENDS */}
      <div data-panduan="tren">
      <PerformanceSection
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />
      </div>

      {/* LEVEL 3: PROGRES STATUS GIZI PER POSYANDU */}
      <ProgresStatusGizi
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />

      {/* LEVEL 3: ADDITIONAL METRICS - Data Kependudukan, Balita & Imunisasi */}
      <AdditionalMetrics
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />

      {/* LEVEL 3: SKDN BAR CHART */}
      <div data-panduan="skdn">
      <SKDNBarChart
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />
      </div>

      {/* LEVEL 3: DURASI DAN JARAK AGREGAT - KADER */}
      <DurasiJarakAgregat
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />

      {/* LEVEL 3: BEBAN KERJA TIM SUMMARY - KADER */}
      <div data-panduan="beban-kader">
      <BebanKerjaTimSummary
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />
      </div>

      {/* LEVEL 4: EXPANDABLE DATA SECTIONS */}
      <ExpandableDataSection
        bulan={selectedMonth}
        tahun={filterTahun}
        bulanLabel={daftarBulan[selectedMonth - 1]}
      />

      {/* Dirender di dalam cabang ini saja: panduan mencari elemen targetnya
          lewat querySelector, jadi isi dashboard harus sudah ada di DOM. */}
      <PanduanDashboard
        langkah={LANGKAH_PANDUAN}
        storageKey="panduan:kepala-desa"
      />
        </>
      )}
    </div>
  );
};

export default DashboardKepalaDesa;
