"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface LangkahPanduan {
  /** Harus sama dengan nilai data-panduan pada elemen yang disorot. */
  id: string;
  judul: string;
  isi: string;
}

interface PanduanDashboardProps {
  langkah: LangkahPanduan[];
  /** Mis. "panduan:kepala-desa". Nama pengguna ditambahkan otomatis. */
  storageKey: string;
  /** Perbesar seluruh teks panduan, dipakai di dashboard mode senior. */
  besar?: boolean;
}

/**
 * Satu dashboard bisa dibuka dua orang berbeda di komputer yang sama (mis. di
 * balai desa). Tanpa identitas pada kuncinya, orang kedua tidak akan pernah
 * melihat panduan karena orang pertama sudah menyelesaikannya.
 *
 * Catatan: localStorage tetap per browser. Ganti perangkat berarti panduan
 * muncul lagi; menghilangkan itu butuh penyimpanan di sisi backend.
 */
const bacaIdentitas = (): string => {
  try {
    const raw = localStorage.getItem("current_user");

    if (raw) {
      const user = JSON.parse(raw) as Record<string, unknown>;
      const id = user?.username ?? user?.id ?? user?.nama_lengkap;

      if (typeof id === "string" || typeof id === "number") {
        return String(id);
      }
    }

    return sessionStorage.getItem("nama_lengkap") ?? "default";
  } catch {
    return "default";
  }
};

const PanduanDashboard: React.FC<PanduanDashboardProps> = ({
  langkah,
  storageKey,
  besar = false,
}) => {
  const [siap, setSiap] = useState(false);
  const [aktif, setAktif] = useState(false);
  const [indeks, setIndeks] = useState(0);
  const [kotak, setKotak] = useState<DOMRect | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const kunci = useMemo(() => `${storageKey}:${bacaIdentitas()}`, [storageKey]);

  const selesai = useCallback(() => {
    setAktif(false);
    setKotak(null);
    try {
      localStorage.setItem(kunci, "selesai");
    } catch {
      // Mode privat / kuota penuh: panduan akan muncul lagi nanti, dan itu
      // jauh lebih baik daripada render yang gagal.
    }
  }, [kunci]);

  // Dijalankan sekali: panduan hanya muncul kalau belum pernah diselesaikan.
  useEffect(() => {
    try {
      setAktif(localStorage.getItem(kunci) !== "selesai");
    } catch {
      setAktif(false);
    }
    setSiap(true);
  }, [kunci]);

  // Efek sampingnya sengaja di luar updater setIndeks: React boleh memanggil
  // updater lebih dari sekali, dan menulis localStorage dari dalamnya adalah
  // efek samping di tempat yang seharusnya murni.
  const lanjut = useCallback(() => {
    if (indeks >= langkah.length - 1) {
      selesai();
      return;
    }
    setIndeks(indeks + 1);
  }, [indeks, langkah.length, selesai]);

  const mundur = useCallback(() => {
    setIndeks((sebelumnya) => Math.max(0, sebelumnya - 1));
  }, []);

  // Mengukur elemen yang disorot. getBoundingClientRect relatif viewport, jadi
  // sorotannya position: fixed dan cukup diukur ulang saat scroll atau resize.
  useEffect(() => {
    if (!aktif) {
      return;
    }

    const target = langkah[indeks];

    if (!target) {
      return;
    }

    const el = document.querySelector<HTMLElement>(`[data-panduan="${target.id}"]`);

    // Elemen bisa tidak ada (mis. seksi disembunyikan untuk peran tertentu).
    // Langkahnya dilewati, bukan menampilkan sorotan kosong.
    if (!el) {
      lanjut();
      return;
    }

    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: kurangiGerak ? "auto" : "smooth", block: "center" });

    const ukur = () => setKotak(el.getBoundingClientRect());
    ukur();

    // Diukur ulang setelah smooth scroll selesai.
    const timer = window.setTimeout(ukur, 450);
    window.addEventListener("scroll", ukur, { passive: true });
    window.addEventListener("resize", ukur);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", ukur);
      window.removeEventListener("resize", ukur);
    };
  }, [aktif, indeks, langkah, lanjut]);

  useEffect(() => {
    if (!aktif) {
      return;
    }

    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        selesai();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        lanjut();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        mundur();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aktif, indeks, lanjut, mundur, selesai]);

  if (!siap || langkah.length === 0) {
    return null;
  }

  const teksJudul = besar ? "text-3xl" : "text-2xl";
  const teksIsi = besar ? "text-xl" : "text-lg";
  const teksTombol = besar ? "text-xl" : "text-lg";

  if (!aktif) {
    return (
      <button
        type="button"
        onClick={() => {
          setIndeks(0);
          setAktif(true);
        }}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
      >
        <span
          aria-hidden="true"
          className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-bold text-blue-700"
        >
          ?
        </span>
        Panduan
      </button>
    );
  }

  const langkahAktif = langkah[indeks];
  // Panel ditempatkan di seberang sorotan supaya tidak pernah menutupinya, dan
  // posisinya tetap (atas atau bawah layar) -- popover yang melompat-lompat
  // mengikuti tiap kartu justru membingungkan.
  const sorotanDiBawah = kotak
    ? kotak.top + kotak.height / 2 > window.innerHeight / 2
    : false;

  return (
    <>
      {kotak && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[60] rounded-2xl ring-4 ring-amber-300"
          style={{
            top: kotak.top - 8,
            left: kotak.left - 8,
            width: kotak.width + 16,
            height: kotak.height + 16,
            boxShadow: "0 0 0 9999px rgba(8, 15, 30, 0.72)",
          }}
        />
      )}

      {/* Latar gelap sudah dibuat oleh box-shadow sorotan. Lapisan ini hanya
          menangkap klik supaya dashboard di belakangnya tidak bisa ditekan
          tanpa sengaja saat panduan berjalan. */}
      <div className="fixed inset-0 z-[59]" aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panduan-judul"
        tabIndex={-1}
        className={`fixed inset-x-4 z-[70] mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-2xl outline-none ring-1 ring-black/10 sm:p-7 ${
          sorotanDiBawah ? "top-5" : "bottom-5"
        }`}
      >
        <p className="text-base font-semibold text-blue-700">
          Langkah {indeks + 1} dari {langkah.length}
        </p>

        <h2 id="panduan-judul" className={`mt-2 font-bold text-gray-900 ${teksJudul}`}>
          {langkahAktif.judul}
        </h2>

        <p className={`mt-3 leading-relaxed text-gray-700 ${teksIsi}`}>
          {langkahAktif.isi}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={selesai}
            className={`rounded-xl px-5 py-3 font-semibold text-gray-700 underline-offset-4 transition hover:bg-gray-100 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 ${teksTombol}`}
          >
            Lewati
          </button>

          <div className="flex items-center gap-3">
            {indeks > 0 && (
              <button
                type="button"
                onClick={mundur}
                className={`rounded-xl border-2 border-gray-300 px-5 py-3 font-bold text-gray-800 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 ${teksTombol}`}
              >
                Kembali
              </button>
            )}
            <button
              type="button"
              onClick={lanjut}
              className={`rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${teksTombol}`}
            >
              {indeks === langkah.length - 1 ? "Selesai" : "Lanjut"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanduanDashboard;
