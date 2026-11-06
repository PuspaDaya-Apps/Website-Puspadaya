"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { useBalitaStatusPeriod, useTrenDataPosyandu } from "@/hooks/dashboard";

interface ProgresStatusGiziProps {
  bulan: number;
  tahun: number;
  bulanLabel?: string;
}

interface GiziPoint {
  bulan: string;
  stunting: number;
  wasting: number;
  underweight: number;
  normal: number;
}

const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const BULAN_EN = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// Nilai value harus sama persis dengan yang diterima query API; string kosong
// berarti tanpa filter dan tidak ikut dikirim.
const OPSI_JENIS_KELAMIN = [
  { value: "", label: "Semua" },
  { value: "laki-laki", label: "Laki-laki" },
  { value: "perempuan", label: "Perempuan" },
];

const OPSI_STATUS_KEMISKINAN = [
  { value: "", label: "Semua" },
  { value: "miskin", label: "Miskin" },
  { value: "tidak miskin", label: "Tidak Miskin" },
];

const SELECT_CLASS =
  "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-dark outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary";

// Backend mengirim key bulan dalam bahasa Inggris. Nama Indonesia tetap
// diterima supaya grafik tidak kosong kalau format key berubah.
const indexBulan = (nama: string): number => {
  const normalized = nama.trim().toLowerCase();
  const indexEn = BULAN_EN.indexOf(normalized);

  if (indexEn !== -1) {
    return indexEn;
  }

  return NAMA_BULAN.findIndex((item) => item.toLowerCase() === normalized);
};

const ProgresStatusGizi: React.FC<ProgresStatusGiziProps> = ({ bulan, tahun, bulanLabel }) => {
  // Query key-nya sama dengan PosyanduOverview, jadi daftar ini dibaca dari
  // cache react-query dan tidak menambah request.
  const { data: trenPosyandu } = useTrenDataPosyandu({ bulan, tahun });

  // Endpoint butuh id_posyandu asli; item tanpa id tidak bisa dipakai.
  const daftarPosyandu = useMemo(
    () =>
      (trenPosyandu?.posyandu ?? [])
        .filter((item): item is typeof item & { id: string } => !!item.id)
        .map((item) => ({ id: String(item.id), nama: item.nama })),
    [trenPosyandu]
  );

  const [idPosyandu, setIdPosyandu] = useState("");

  // Ganti periode bisa mengubah daftar posyandu. Kalau pilihan lama sudah tidak
  // ada di daftar, jatuhkan ke posyandu pertama supaya grafik tidak kosong.
  useEffect(() => {
    if (daftarPosyandu.length === 0) {
      setIdPosyandu("");
      return;
    }

    setIdPosyandu((sebelumnya) =>
      daftarPosyandu.some((item) => item.id === sebelumnya) ? sebelumnya : daftarPosyandu[0].id
    );
  }, [daftarPosyandu]);

  const [jenisKelamin, setJenisKelamin] = useState("");
  const [statusKemiskinan, setStatusKemiskinan] = useState("");

  // String kosong diubah ke undefined supaya "Semua" tidak terkirim sebagai
  // filter bernilai kosong dan tidak membuat entri cache terpisah.
  const filter = useMemo(
    () => ({
      jenisKelamin: jenisKelamin || undefined,
      statusKemiskinan: statusKemiskinan || undefined,
    }),
    [jenisKelamin, statusKemiskinan]
  );

  // bulan: 0 meminta seri satu tahun penuh, bukan satu bulan saja.
  const {
    data: statusPeriode,
    isPending,
    isError,
    refetch,
  } = useBalitaStatusPeriod(idPosyandu, { bulan: 0, tahun }, filter);

  const namaPosyandu = daftarPosyandu.find((item) => item.id === idPosyandu)?.nama ?? "";

  // Sembunyikan bulan yang belum terjadi: batasnya yang paling kecil antara
  // bulan filter dan bulan kalender. Tahun lampau sudah lengkap 12 bulan.
  const jumlahBulanTampil = useMemo(() => {
    const totalBulan = NAMA_BULAN.length;
    const sekarang = new Date();
    const tahunSekarang = sekarang.getFullYear();

    const batasKalender =
      tahun < tahunSekarang ? totalBulan : tahun > tahunSekarang ? 0 : sekarang.getMonth() + 1;
    const batasFilter = Math.min(Math.max(bulan, 1), totalBulan);

    return Math.min(batasFilter, batasKalender);
  }, [bulan, tahun]);

  const giziData = useMemo<GiziPoint[]>(() => {
    if (!statusPeriode) {
      return [];
    }

    return Object.entries(statusPeriode)
      .map(([namaBulan, nilai]) => ({
        index: indexBulan(namaBulan),
        bulan: namaBulan,
        stunting: nilai?.total_stunting ?? 0,
        wasting: nilai?.total_wasting ?? 0,
        underweight: nilai?.total_underweight ?? 0,
        normal: nilai?.total_normal ?? 0,
      }))
      .filter((item) => item.index !== -1 && item.index < jumlahBulanTampil)
      .sort((a, b) => a.index - b.index)
      .map((item) => ({ ...item, bulan: NAMA_BULAN[item.index] }));
  }, [statusPeriode, jumlahBulanTampil]);

  const isEmptyData = useMemo(
    () =>
      !giziData.some(
        (item) =>
          item.stunting > 0 || item.wasting > 0 || item.underweight > 0 || item.normal > 0
      ),
    [giziData]
  );

  const periodeLabel = bulanLabel ? `${bulanLabel} ${tahun}` : `bulan ${bulan} ${tahun}`;

  const filterLabel = [
    OPSI_JENIS_KELAMIN.find((item) => item.value === jenisKelamin && item.value)?.label,
    OPSI_STATUS_KEMISKINAN.find((item) => item.value === statusKemiskinan && item.value)?.label,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-dark dark:text-white">
            Progres Status Gizi{namaPosyandu ? ` - ${namaPosyandu}` : ""} ({tahun})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tren stunting, wasting, underweight, dan normal sampai {periodeLabel}
            {filterLabel ? ` · ${filterLabel}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor="progres-gizi-posyandu"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Posyandu
            </label>
            <select
              id="progres-gizi-posyandu"
              className={SELECT_CLASS}
              value={idPosyandu}
              onChange={(event) => setIdPosyandu(event.target.value)}
              disabled={daftarPosyandu.length === 0}
            >
              {daftarPosyandu.length === 0 ? (
                <option value="">Tidak ada posyandu</option>
              ) : (
                daftarPosyandu.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="progres-gizi-jenis-kelamin"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Jenis Kelamin
            </label>
            <select
              id="progres-gizi-jenis-kelamin"
              className={SELECT_CLASS}
              value={jenisKelamin}
              onChange={(event) => setJenisKelamin(event.target.value)}
            >
              {OPSI_JENIS_KELAMIN.map((item) => (
                <option key={item.value || "semua"} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="progres-gizi-status-kemiskinan"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Status Kemiskinan
            </label>
            <select
              id="progres-gizi-status-kemiskinan"
              className={SELECT_CLASS}
              value={statusKemiskinan}
              onChange={(event) => setStatusKemiskinan(event.target.value)}
            >
              {OPSI_STATUS_KEMISKINAN.map((item) => (
                <option key={item.value || "semua"} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {statusKemiskinan ? (
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Catatan: anak tanpa data kemiskinan dihitung sebagai keluarga tidak miskin.
        </p>
      ) : null}

      {daftarPosyandu.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Daftar posyandu belum tersedia untuk periode ini.
        </div>
      ) : isPending ? (
        <div className="flex flex-col items-center justify-center py-10 text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
          <p>Memuat progres status gizi...</p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          <p>Gagal memuat progres status gizi.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/80"
          >
            Coba Lagi
          </button>
        </div>
      ) : isEmptyData ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {filterLabel
            ? `Belum ada data status gizi untuk posyandu ini dengan filter ${filterLabel}.`
            : "Belum ada data status gizi untuk posyandu ini."}
        </div>
      ) : (
        <div className="rounded-lg">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={giziData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="bulan"
                interval={0}
                padding={{ left: 20, right: 20 }}
                angle={-15}
                textAnchor="end"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                tickFormatter={(value: number) => `${value}%`}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />

              <Line
                type="monotone"
                dataKey="stunting"
                stroke="#ef4444"
                strokeWidth={2}
                name="Stunting"
              >
                <LabelList
                  dataKey="stunting"
                  position="top"
                  formatter={(value) => `${value}%`}
                />
              </Line>

              <Line
                type="monotone"
                dataKey="wasting"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Wasting"
              >
                <LabelList dataKey="wasting" position="top" formatter={(value) => `${value}%`} />
              </Line>

              <Line
                type="monotone"
                dataKey="underweight"
                stroke="#8B4513"
                strokeWidth={2}
                name="Underweight"
              >
                <LabelList
                  dataKey="underweight"
                  position="top"
                  formatter={(value) => `${value}%`}
                />
              </Line>

              <Line
                type="monotone"
                dataKey="normal"
                stroke="#16a34a"
                strokeWidth={2}
                name="Normal"
              >
                <LabelList dataKey="normal" position="top" formatter={(value) => `${value}%`} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ProgresStatusGizi;
