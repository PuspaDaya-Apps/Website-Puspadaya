"use client";
import React from "react";
import {
  useAllKaderDesa,
  useAnakCakupanDilayani,
  useInformasiDataDesa,
  useSkorBebanKerjaTim,
  useStatistikSkdn,
  useTrenDataPosyandu,
} from "@/hooks/dashboard";
import { useSeniorMode } from "@/contexts/SeniorModeContext";

interface DashboardSederhanaProps {
  onPrintReport: () => void;
}

const DashboardSederhana: React.FC<DashboardSederhanaProps> = ({
  onPrintReport,
}) => {
  const { isSeniorMode, fontSize, highContrast } = useSeniorMode();

  // Mode Senior tidak menampilkan filter periode, jadi datanya selalu bulan
  // berjalan.
  const now = new Date();
  const periodeParams = { bulan: now.getMonth() + 1, tahun: now.getFullYear() };

  const informasiQuery = useInformasiDataDesa(periodeParams);
  const cakupanQuery = useAnakCakupanDilayani(periodeParams);
  const skdnQuery = useStatistikSkdn(periodeParams);
  const trenPosyanduQuery = useTrenDataPosyandu(periodeParams);
  const bebanKerjaQuery = useSkorBebanKerjaTim(periodeParams);

  // Daftar kader dirakit per posyandu (belum ada endpoint tingkat desa).
  // Sengaja TIDAK ikut gate loading utama supaya dashboard tidak menunggu
  // sejumlah request sekaligus; bagian ini punya pesan loading sendiri.
  const posyanduRefs = (trenPosyanduQuery.data?.posyandu ?? [])
    .filter((item) => Boolean(item?.id))
    .map((item) => ({ id: item.id as string, nama: item.nama }));
  const kaderQuery = useAllKaderDesa(posyanduRefs, periodeParams);

  const isLoading = [
    informasiQuery,
    cakupanQuery,
    skdnQuery,
    trenPosyanduQuery,
    bebanKerjaQuery,
  ].some((query) => query.isPending);

  const informasi = informasiQuery.data ?? null;
  const cakupan = cakupanQuery.data ?? null;
  const skdn = skdnQuery.data?.skdn ?? null;
  const daftarPosyandu = trenPosyanduQuery.data?.posyandu ?? [];
  const bebanKerja = bebanKerjaQuery.data?.kader ?? null;

  const totalPosyandu = informasi?.ringkasan?.total_posyandu ?? 0;
  const totalBalita = informasi?.ringkasan?.total_balita ?? 0;
  const badutaBerkunjung = cakupan?.anak_berdasarkan_usia?.baduta ?? 0;

  const kasusStunting =
    (informasi?.kasus_gizi?.stunting_pendek ?? 0) +
    (informasi?.kasus_gizi?.stunting_sangat_pendek ?? 0);
  const kasusGiziBuruk = informasi?.kasus_gizi?.wasting ?? 0;
  const prevalensiStunting =
    totalBalita > 0 ? Math.round((kasusStunting / totalBalita) * 1000) / 10 : 0;

  const rataRataKehadiran =
    daftarPosyandu.length > 0
      ? Math.round(
          daftarPosyandu.reduce((total, item) => total + (item?.kehadiran ?? 0), 0) /
            daftarPosyandu.length,
        )
      : 0;

  const kaderBebanTertinggi = [...kaderQuery.data]
    .sort((a, b) => (b?.skor_kinerja ?? 0) - (a?.skor_kinerja ?? 0))
    .slice(0, 3);

  const jumlahKaderBebanTinggi =
    bebanKerja?.distribusi_beban_kerja?.detail?.find(
      (item) => (item?.kategori ?? "").toLowerCase() === "tinggi",
    )?.jumlah ?? 0;

  // Font size classes based on setting
  const getFontSize = (size: "small" | "medium" | "large" | "xlarge") => {
    if (fontSize === "xlarge") {
      return {
        small: "text-lg",
        medium: "text-2xl",
        large: "text-4xl",
        xlarge: "text-6xl",
      }[size];
    }
    if (fontSize === "large") {
      return {
        small: "text-base",
        medium: "text-xl",
        large: "text-3xl",
        xlarge: "text-5xl",
      }[size];
    }
    return {
      small: "text-sm",
      medium: "text-lg",
      large: "text-2xl",
      xlarge: "text-4xl",
    }[size];
  };

  // High contrast classes
  const getContrastClass = (color: string) => {
    if (highContrast) {
      return color.replace("gray", "black");
    }
    return color;
  };

  // Placeholder dibuat besar dan sederhana karena dipakai user senior.
  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <div
          className={`rounded-xl p-10 text-center shadow-md ${
            highContrast ? "border-4 border-black bg-white" : "bg-white"
          }`}
        >
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-8 border-blue-200 border-t-blue-600" />
          <p className={`${getFontSize("large")} font-bold text-black`}>
            Sedang memuat data...
          </p>
          <p className={`${getFontSize("small")} mt-3 text-gray-700`}>
            Mohon tunggu sebentar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-4 ${isSeniorMode ? "bg-white" : ""}`}>
      {/* Header */}
      <div className={`rounded-xl p-6 shadow-md ${highContrast ? "bg-white border-4 border-black" : "bg-white"}`}>
        <h1 className={`${getFontSize("xlarge")} font-bold text-black`}>
          Dashboard Kepala Desa
        </h1>
        <p className={`${getFontSize("small")} text-gray-700 mt-2`}>
          Monitor kesehatan balita dan ibu hamil di wilayah Anda
        </p>
      </div>

      {/* 5 METRIC UTAMA */}
      <div className={`${highContrast ? "bg-white border-4 border-black" : "bg-white"} rounded-xl p-6 shadow-md`}>
        <h2 className={`${getFontSize("large")} font-bold text-black mb-4`}>
          Data Penting Bulan Ini
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total Posyandu */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-blue-600 bg-blue-50" : "border-blue-200 bg-blue-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-blue-800`}>
              Total Posyandu
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-blue-600 mt-2`}>
              {totalPosyandu}
            </p>
            {/* TODO: definisi "aktif" perlu disepakati -- tidak ada field
                posyandu aktif di endpoint mana pun, jadi jangan menebak angka. */}
            <p className={`${getFontSize("small")} text-blue-700 mt-1`}>
              - aktif
            </p>
          </div>

          {/* Total Balita */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-green-600 bg-green-50" : "border-green-200 bg-green-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-green-800`}>
              Total Balita
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-green-600 mt-2`}>
              {totalBalita}
            </p>
            <p className={`${getFontSize("small")} text-green-700 mt-1`}>
              {badutaBerkunjung} berkunjung
            </p>
          </div>

          {/* Kehadiran */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-purple-600 bg-purple-50" : "border-purple-200 bg-purple-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-purple-800`}>
              Rata-rata Kehadiran
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-purple-600 mt-2`}>
              {rataRataKehadiran}%
            </p>
            <p className={`${getFontSize("small")} text-purple-700 mt-1`}>
              dari total balita
            </p>
          </div>

          {/* Stunting */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-red-600 bg-red-50" : "border-red-200 bg-red-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-red-800`}>
              Kasus Stunting
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-red-600 mt-2`}>
              {kasusStunting}
            </p>
            <p className={`${getFontSize("small")} text-red-700 mt-1`}>
              {prevalensiStunting}% dari balita
            </p>
          </div>

          {/* Gizi Buruk */}
          <div className={`rounded-lg p-5 border-4 ${highContrast ? "border-orange-600 bg-orange-50" : "border-orange-200 bg-orange-50"}`}>
            <p className={`${getFontSize("small")} font-semibold text-orange-800`}>
              Gizi Buruk
            </p>
            <p className={`${getFontSize("xlarge")} font-bold text-orange-600 mt-2`}>
              {kasusGiziBuruk}
            </p>
            <p className={`${getFontSize("small")} text-orange-700 mt-1`}>
              perlu tindakan
            </p>
          </div>
        </div>
      </div>

      {/* KADER DENGAN BEBAN TINGGI */}
      {jumlahKaderBebanTinggi > 0 && (
        <div className={`${highContrast ? "bg-white border-4 border-orange-600" : "bg-white"} rounded-xl p-6 shadow-md`}>
          <h2 className={`${getFontSize("large")} font-bold text-black mb-4`}>
            {jumlahKaderBebanTinggi} Kader Dengan Beban Kerja Tinggi
          </h2>
          {kaderQuery.isLoading ? (
            <div className="rounded-lg bg-orange-50 p-4 border-2 border-orange-300">
              <p className={`${getFontSize("medium")} text-black`}>
                Memuat data kader...
              </p>
            </div>
          ) : kaderBebanTertinggi.length === 0 ? (
            <div className="rounded-lg bg-orange-50 p-4 border-2 border-orange-300">
              <p className={`${getFontSize("medium")} text-black`}>
                Belum ada data kader
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {kaderBebanTertinggi.map((kader, index) => (
                <div
                  key={kader?.id_kader ?? index}
                  className="rounded-lg bg-orange-50 p-4 border-2 border-orange-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className={`${getFontSize("medium")} font-bold text-black`}>
                        {kader?.nama ?? "-"}
                      </p>
                      <p className={`${getFontSize("small")} text-gray-700`}>
                        {kader?.posyandu_nama ?? "-"}
                      </p>
                      <p className={`${getFontSize("small")} text-gray-700`}>
                        {kader?.jumlah_balita_didampingi ?? 0} balita •{" "}
                        {kader?.jumlah_ibu_hamil_didampingi ?? 0} ibu hamil
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`${getFontSize("large")} font-bold text-red-600`}>
                        Skor: {kader?.skor_kinerja ?? 0}
                      </p>
                      <p className={`${getFontSize("small")} text-gray-600`}>
                        {kader?.status_kinerja ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SKDN CHART - Simplified */}
      <div className={`${highContrast ? "bg-white border-4 border-black" : "bg-white"} rounded-xl p-6 shadow-md`}>
        <h2 className={`${getFontSize("large")} font-bold text-black mb-4`}>
          Statistik Gizi Balita (SKDN)
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Urutan mengikuti standar SKDN nasional: S -> K -> D -> N */}
          <div className="rounded-lg bg-blue-50 p-4 text-center border-2 border-blue-300">
            <p className={`${getFontSize("small")} text-blue-800`}>Sasaran Balita (S)</p>
            <p className={`${getFontSize("xlarge")} font-bold text-blue-600`}>{skdn?.jumlah?.sasaran_balita ?? 0}</p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4 text-center border-2 border-yellow-300">
            <p className={`${getFontSize("small")} text-yellow-800`}>Balita Berkunjung (K)</p>
            <p className={`${getFontSize("xlarge")} font-bold text-yellow-600`}>{skdn?.jumlah?.kunjungan ?? 0}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center border-2 border-green-300">
            <p className={`${getFontSize("small")} text-green-800`}>Balita Ditimbang (D)</p>
            <p className={`${getFontSize("xlarge")} font-bold text-green-600`}>{skdn?.jumlah?.ditimbang ?? 0}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center border-2 border-red-300">
            <p className={`${getFontSize("small")} text-red-800`}>Balita Naik BB (N)</p>
            <p className={`${getFontSize("xlarge")} font-bold text-red-600`}>{skdn?.jumlah?.naik_bb ?? 0}</p>
          </div>
        </div>
        <div className={`mt-4 rounded-lg p-4 ${highContrast ? "bg-green-50 border-2 border-green-600" : "bg-green-50"}`}>
          <p className={`${getFontSize("medium")} font-bold text-green-800`}>
            ✅ Kenaikan Berat Badan Sesuai: {skdn?.indikator?.kenaikan_bb_persen ?? 0}%
          </p>
        </div>
      </div>

      {/* TOMBOL AKSI CEPAT */}
      <div className={`${highContrast ? "bg-white border-4 border-black" : "bg-white"} rounded-xl p-6 shadow-md`}>
        <h2 className={`${getFontSize("large")} font-bold text-black mb-4`}>
          Aksi Cepat
        </h2>
        <button
          onClick={onPrintReport}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span className={`${getFontSize("small")} font-medium`}>Download Laporan PDF</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSederhana;
