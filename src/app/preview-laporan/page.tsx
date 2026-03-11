"use client";
import React, { useEffect, useState, useRef } from "react";

// ─── Dummy Data (inline untuk demo) ───────────────────────────────────────────
const posyanduListData = [
  { id: "p1", nama_posyandu: "Mawar I", nama_dusun: "Dusun Krajan" },
  { id: "p2", nama_posyandu: "Melati II", nama_dusun: "Dusun Timur" },
  { id: "p3", nama_posyandu: "Anggrek III", nama_dusun: "Dusun Barat" },
  { id: "p4", nama_posyandu: "Cempaka IV", nama_dusun: "Dusun Selatan" },
  { id: "p5", nama_posyandu: "Dahlia V", nama_dusun: "Dusun Utara" },
  { id: "p6", nama_posyandu: "Kenanga VI", nama_dusun: "Dusun Tengah" },
  { id: "p7", nama_posyandu: "Flamboyan VII", nama_dusun: "Dusun Kidul" },
  { id: "p8", nama_posyandu: "Tulip VIII", nama_dusun: "Dusun Lor" },
];

const posyanduPerformanceData = [
  { posyandu_id: "p1", nama_posyandu: "Mawar I", skor_kinerja: 92, kategori: "Sangat Baik", tingkat_kehadiran: 94, cakupan_gizi: 89, aktif_kader: 5 },
  { posyandu_id: "p2", nama_posyandu: "Melati II", skor_kinerja: 87, kategori: "Sangat Baik", tingkat_kehadiran: 88, cakupan_gizi: 84, aktif_kader: 4 },
  { posyandu_id: "p3", nama_posyandu: "Anggrek III", skor_kinerja: 79, kategori: "Baik", tingkat_kehadiran: 80, cakupan_gizi: 76, aktif_kader: 4 },
  { posyandu_id: "p4", nama_posyandu: "Cempaka IV", skor_kinerja: 74, kategori: "Baik", tingkat_kehadiran: 75, cakupan_gizi: 71, aktif_kader: 3 },
  { posyandu_id: "p5", nama_posyandu: "Dahlia V", skor_kinerja: 61, kategori: "Cukup", tingkat_kehadiran: 62, cakupan_gizi: 58, aktif_kader: 3 },
  { posyandu_id: "p6", nama_posyandu: "Kenanga VI", skor_kinerja: 55, kategori: "Cukup", tingkat_kehadiran: 54, cakupan_gizi: 50, aktif_kader: 2 },
  { posyandu_id: "p7", nama_posyandu: "Flamboyan VII", skor_kinerja: 43, kategori: "Kurang", tingkat_kehadiran: 40, cakupan_gizi: 38, aktif_kader: 2 },
  { posyandu_id: "p8", nama_posyandu: "Tulip VIII", skor_kinerja: 38, kategori: "Kurang", tingkat_kehadiran: 35, cakupan_gizi: 32, aktif_kader: 1 },
];

const monthlyTrendData = [
  { bulan: "September", balita: 312, ibu_hamil: 48, imunisasi: 278 },
  { bulan: "Oktober", balita: 328, ibu_hamil: 52, imunisasi: 295 },
  { bulan: "November", balita: 305, ibu_hamil: 45, imunisasi: 261 },
  { bulan: "Desember", balita: 341, ibu_hamil: 55, imunisasi: 310 },
  { bulan: "Januari", balita: 358, ibu_hamil: 61, imunisasi: 322 },
  { bulan: "Februari", balita: 374, ibu_hamil: 58, imunisasi: 340 },
];

const kaderWorkloadData = [
  { id: "k1", nama: "Siti Rahayu", posyandu: "Mawar I", skor_beban_kerja: 85, kategori_beban: "Tinggi", jumlah_balita: 68 },
  { id: "k2", nama: "Dewi Kusuma", posyandu: "Melati II", skor_beban_kerja: 78, kategori_beban: "Tinggi", jumlah_balita: 62 },
  { id: "k3", nama: "Ani Sukarti", posyandu: "Anggrek III", skor_beban_kerja: 65, kategori_beban: "Sedang", jumlah_balita: 51 },
  { id: "k4", nama: "Rini Wulandari", posyandu: "Cempaka IV", skor_beban_kerja: 60, kategori_beban: "Sedang", jumlah_balita: 48 },
  { id: "k5", nama: "Sri Mulyani", posyandu: "Dahlia V", skor_beban_kerja: 45, kategori_beban: "Rendah", jumlah_balita: 36 },
  { id: "k6", nama: "Eko Wahyuni", posyandu: "Kenanga VI", skor_beban_kerja: 40, kategori_beban: "Rendah", jumlah_balita: 32 },
  { id: "k7", nama: "Lestari Dewi", posyandu: "Flamboyan VII", skor_beban_kerja: 88, kategori_beban: "Tinggi", jumlah_balita: 71 },
  { id: "k8", nama: "Nur Hasanah", posyandu: "Tulip VIII", skor_beban_kerja: 52, kategori_beban: "Sedang", jumlah_balita: 42 },
];

const criticalChildrenData = [
  { nama_anak: "Ahmad Fauzi", nama_ibu: "Siti Aminah", posyandu_nama: "Flamboyan VII", usia_bulan: 18, status_gizi: "Gizi Buruk", status_stunting: "Stunting", prioritas: "Sangat Tinggi" },
  { nama_anak: "Bunga Lestari", nama_ibu: "Dewi Rahayu", posyandu_nama: "Tulip VIII", usia_bulan: 24, status_gizi: "Gizi Buruk", status_stunting: "Stunting", prioritas: "Sangat Tinggi" },
  { nama_anak: "Cahya Putra", nama_ibu: "Ani Kusuma", posyandu_nama: "Flamboyan VII", usia_bulan: 12, status_gizi: "Gizi Kurang", status_stunting: "Stunting", prioritas: "Tinggi" },
  { nama_anak: "Dinda Safitri", nama_ibu: "Rini Astuti", posyandu_nama: "Dahlia V", usia_bulan: 30, status_gizi: "Gizi Kurang", status_stunting: "-", prioritas: "Tinggi" },
  { nama_anak: "Eko Prasetyo", nama_ibu: "Sri Lestari", posyandu_nama: "Kenanga VI", usia_bulan: 20, status_gizi: "Gizi Buruk", status_stunting: "Stunting", prioritas: "Sangat Tinggi" },
  { nama_anak: "Fitri Nuraini", nama_ibu: "Yuli Andriani", posyandu_nama: "Tulip VIII", usia_bulan: 15, status_gizi: "Gizi Kurang", status_stunting: "-", prioritas: "Sedang" },
];

// ─── SVG Bar Chart Component ──────────────────────────────────────────────────
const BarChart: React.FC<{
  data: { label: string; balita: number; ibu_hamil: number; imunisasi: number }[];
}> = ({ data }) => {
  const maxVal = Math.max(...data.flatMap(d => [d.balita, d.ibu_hamil, d.imunisasi]));
  const svgH = 220;
  const svgW = 700;
  const padL = 50;
  const padB = 40;
  const padT = 20;
  const chartH = svgH - padB - padT;
  const chartW = svgW - padL - 20;
  const groupW = chartW / data.length;
  const barW = (groupW - 20) / 3;

  const series = [
    { key: "balita" as const, color: "#3B82F6", label: "Balita" },
    { key: "ibu_hamil" as const, color: "#EC4899", label: "Ibu Hamil" },
    { key: "imunisasi" as const, color: "#10B981", label: "Imunisasi" },
  ];

  const yTicks = 5;
  const yStep = Math.ceil(maxVal / yTicks / 50) * 50;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Grid lines */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const val = i * yStep;
        const y = padT + chartH - (val / (yStep * yTicks)) * chartH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={svgW - 10} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,3" />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{val}</text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, gi) => (
        <g key={gi}>
          {series.map((s, si) => {
            const val = d[s.key];
            const barH = (val / (yStep * yTicks)) * chartH;
            const x = padL + gi * groupW + 10 + si * (barW + 2);
            const y = padT + chartH - barH;
            return (
              <g key={si}>
                <rect x={x} y={y} width={barW} height={barH} fill={s.color} rx="3" opacity="0.9" />
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="9" fill={s.color} fontWeight="600">
                  {val}
                </text>
              </g>
            );
          })}
          <text x={padL + gi * groupW + groupW / 2} y={svgH - 8} textAnchor="middle" fontSize="10" fill="#6B7280" fontWeight="500">
            {d.label}
          </text>
        </g>
      ))}

      {/* Axis */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#D1D5DB" strokeWidth="1.5" />
      <line x1={padL} y1={padT + chartH} x2={svgW - 10} y2={padT + chartH} stroke="#D1D5DB" strokeWidth="1.5" />

      {/* Legend */}
      {series.map((s, i) => (
        <g key={i} transform={`translate(${padL + i * 120}, ${svgH - 5})`}>
          <rect width="10" height="10" fill={s.color} rx="2" y="-10" />
          <text x="14" y="-2" fontSize="10" fill="#6B7280">{s.label}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── Radial Score Component ───────────────────────────────────────────────────
const RadialScore: React.FC<{ score: number; label: string; color: string; bg: string }> = ({ score, label, color, bg }) => {
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 110, height: 110 }}>
        <svg viewBox="0 0 100 100" width="110" height="110">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${c}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ color, fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>/ 100</span>
        </div>
      </div>
      <span style={{ fontSize: 12, color: "#374151", fontWeight: 600, marginTop: 8, textAlign: "center" }}>{label}</span>
    </div>
  );
};

// ─── Horizontal Bar ───────────────────────────────────────────────────────────
const HBar: React.FC<{ label: string; value: number; max: number; color: string; rank: number }> = ({ label, value, max, color, rank }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
    <div style={{
      width: 26, height: 26, borderRadius: 6, background: color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, flexShrink: 0
    }}>{rank}</div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 7, borderRadius: 4, background: "#F3F4F6", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PreviewLaporanPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const currentDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const currentYear = new Date().getFullYear();

  const totalPosyandu = posyanduListData.length;
  const avgScore = Math.round(posyanduPerformanceData.reduce((s, p) => s + p.skor_kinerja, 0) / posyanduPerformanceData.length);
  const totalKader = kaderWorkloadData.length;
  const totalBalita = monthlyTrendData[monthlyTrendData.length - 1].balita;
  const totalKritis = criticalChildrenData.length;

  const perfCat = {
    sangatBaik: posyanduPerformanceData.filter(p => p.kategori === "Sangat Baik").length,
    baik: posyanduPerformanceData.filter(p => p.kategori === "Baik").length,
    cukup: posyanduPerformanceData.filter(p => p.kategori === "Cukup").length,
    kurang: posyanduPerformanceData.filter(p => p.kategori === "Kurang").length,
  };

  const wlCat = {
    tinggi: kaderWorkloadData.filter(k => k.kategori_beban === "Tinggi").length,
    sedang: kaderWorkloadData.filter(k => k.kategori_beban === "Sedang").length,
    rendah: kaderWorkloadData.filter(k => k.kategori_beban === "Rendah").length,
  };

  const top5 = [...posyanduPerformanceData].sort((a, b) => b.skor_kinerja - a.skor_kinerja).slice(0, 5);
  const bottom5 = [...posyanduPerformanceData].sort((a, b) => a.skor_kinerja - b.skor_kinerja).slice(0, 5);

  const chartData = monthlyTrendData.map(m => ({
    label: m.bulan.slice(0, 3),
    balita: m.balita,
    ibu_hamil: m.ibu_hamil,
    imunisasi: m.imunisasi,
  }));

  const priorityColor: Record<string, string> = {
    "Sangat Tinggi": "#DC2626",
    "Tinggi": "#EA580C",
    "Sedang": "#CA8A04",
  };

  const giziColor: Record<string, string> = {
    "Gizi Buruk": "#DC2626",
    "Gizi Kurang": "#EA580C",
    "Gizi Baik": "#16A34A",
  };

  useEffect(() => {
    const t = setTimeout(() => window.print(), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!isClient) return null;

  // ─── Design tokens ────────────────────────────────────────────────────────
  const navy = "#0F2044";
  const accent = "#1D6FE8";
  const accentLight = "#EFF6FF";
  const emerald = "#059669";
  const amber = "#D97706";
  const red = "#DC2626";
  const surface = "#FFFFFF";
  const muted = "#F8FAFC";
  const border = "#E2E8F0";
  const textPrimary = "#0F172A";
  const textSecondary = "#64748B";

  const sectionStyle: React.CSSProperties = {
    background: surface,
    borderRadius: 12,
    border: `1px solid ${border}`,
    padding: "28px 32px",
    marginBottom: 20,
    boxShadow: "0 1px 4px rgba(15,32,68,0.06)",
    pageBreakInside: "avoid",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: navy,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    borderLeft: `4px solid ${accent}`,
    paddingLeft: 12,
    marginBottom: 20,
  };

  const kpiCardStyle = (color: string, bg: string): React.CSSProperties => ({
    background: bg,
    borderRadius: 10,
    padding: "20px 22px",
    border: `1px solid ${color}22`,
    flex: 1,
    minWidth: 0,
  });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 14mm;
          }
          html, body {
            width: 210mm;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          .screen-wrapper {
            background: white !important;
            padding: 0 !important;
          }
          .a4-page {
            width: auto !important;
            min-height: unset !important;
            max-height: unset !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-after: always;
          }
          .a4-page:last-child {
            page-break-after: auto;
          }
          .a4-page-content {
            padding: 0 !important;
          }
          .no-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          table { page-break-inside: auto; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; break-inside: avoid; }
          .cover-body {
            min-height: 250mm !important;
          }
        }

        .screen-wrapper {
          background: #CBD5E1;
          padding: 40px 0;
          min-height: 100vh;
        }

        .a4-page {
          width: 210mm;
          background: white;
          margin: 0 auto 24px auto;
          padding: 16mm 18mm;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 2px;
          position: relative;
          box-sizing: border-box;
        }

        .a4-cover {
          width: 210mm;
          height: 297mm;
          background: white;
          margin: 0 auto 24px auto;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          border-radius: 2px;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .kpi-num {
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
        }

        thead th {
          background: #F1F5F9;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 10px 14px;
          border-bottom: 2px solid #E2E8F0;
        }

        tbody td {
          padding: 11px 14px;
          font-size: 13px;
          color: #1E293B;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }

        tbody tr:hover td { background: #F8FAFC; }
      `}</style>

      {/* ── Top Nav Bar ── */}
      <div className="no-print" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: navy, borderBottom: `1px solid ${navy}`,
        boxShadow: "0 4px 20px rgba(15,32,68,0.3)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Laporan Analitik Posyandu</div>
              <div style={{ color: "#93C5FD", fontSize: 12 }}>Kepala Desa — {currentDate}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => window.print()} style={{
              background: accent, color: "#fff", border: "none", borderRadius: 8,
              padding: "9px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 7,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PDF
            </button>
            <button onClick={() => window.close()} style={{
              background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8, padding: "9px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* ── Screen Wrapper ── */}
      <div className="screen-wrapper">

        {/* ══════════════════════════════════════════════════════════════════════
            COVER PAGE
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="a4-cover">

          {/* Top decorative band */}
          <div style={{ height: 8, background: `linear-gradient(90deg, ${navy}, ${accent}, #60A5FA)`, flexShrink: 0 }} />

          {/* Cover body */}
          <div style={{
            flex: 1,
            background: `linear-gradient(160deg, ${navy} 0%, #1a3a6b 50%, #0d1f3c 100%)`,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            padding: "48px 56px",
            position: "relative", overflow: "hidden",
          }}>
            {/* Background geometric shapes */}
            <div style={{
              position: "absolute", top: -80, right: -80,
              width: 400, height: 400, borderRadius: "50%",
              background: "rgba(29,111,232,0.12)", pointerEvents: "none"
            }} />
            <div style={{
              position: "absolute", bottom: 60, left: -60,
              width: 280, height: 280, borderRadius: "50%",
              background: "rgba(29,111,232,0.08)", pointerEvents: "none"
            }} />
            <div style={{
              position: "absolute", top: "40%", right: "10%",
              width: 160, height: 160, borderRadius: "50%",
              background: "rgba(96,165,250,0.07)", pointerEvents: "none"
            }} />

            {/* Top: Logo + Institution */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: accent, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(29,111,232,0.5)",
                }}>
                  <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: "#93C5FD", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em" }}>SISTEM INFORMASI POSYANDU TERPADU</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>Kementerian Kesehatan Republik Indonesia</div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: 60, height: 3, background: accent, borderRadius: 2, marginBottom: 32 }} />

              {/* Main Title */}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  display: "inline-block", background: "rgba(29,111,232,0.2)",
                  border: "1px solid rgba(29,111,232,0.4)", borderRadius: 6,
                  padding: "5px 14px", marginBottom: 20,
                }}>
                  <span style={{ color: "#93C5FD", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>
                    LAPORAN ANALITIK RESMI
                  </span>
                </div>
              </div>

              <h1 style={{
                color: "#FFFFFF", fontSize: 44, fontWeight: 800,
                lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16,
              }}>
                Laporan Analitik<br />
                <span style={{ color: "#60A5FA" }}>Kinerja Posyandu</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.6, maxWidth: 420 }}>
                Evaluasi komprehensif kinerja seluruh unit Posyandu, distribusi beban kerja kader, tren kunjungan, dan penanganan kasus gizi kritis.
              </p>
            </div>

            {/* Middle: KPI Summary */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
              margin: "48px 0",
            }}>
              {[
                { label: "Total Posyandu", value: totalPosyandu, unit: "unit", icon: "🏥" },
                { label: "Balita Terdaftar", value: totalBalita, unit: "anak", icon: "👶" },
                { label: "Kader Aktif", value: totalKader, unit: "orang", icon: "👩‍⚕️" },
                { label: "Kasus Kritis", value: totalKritis, unit: "kasus", icon: "⚠️" },
              ].map((k, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: "18px 20px",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>{k.value}</div>
                  <div style={{ color: "#93C5FD", fontSize: 10, fontWeight: 600, marginTop: 4, letterSpacing: "0.05em" }}>{k.unit.toUpperCase()}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Bottom: Meta info */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 6 }}>INFORMASI DOKUMEN</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    { label: "Periode", value: `Semester II — Tahun ${currentYear}` },
                    { label: "Dicetak", value: currentDate },
                    { label: "Klasifikasi", value: "Dokumen Rahasia Internal" },
                  ].map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 12 }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, width: 70 }}>{m.label}</span>
                      <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 500 }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  display: "inline-block",
                  background: avgScore >= 80 ? "rgba(5,150,105,0.2)" : avgScore >= 65 ? "rgba(29,111,232,0.2)" : "rgba(217,119,6,0.2)",
                  border: `1px solid ${avgScore >= 80 ? "rgba(5,150,105,0.5)" : avgScore >= 65 ? "rgba(29,111,232,0.5)" : "rgba(217,119,6,0.5)"}`,
                  borderRadius: 10, padding: "12px 20px",
                }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>INDEKS KINERJA</div>
                  <div style={{ color: "#fff", fontSize: 40, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>{avgScore}</div>
                  <div style={{ color: avgScore >= 80 ? "#34D399" : avgScore >= 65 ? "#60A5FA" : "#FCD34D", fontSize: 11, fontWeight: 600, marginTop: 4 }}>
                    {avgScore >= 80 ? "✦ Sangat Baik" : avgScore >= 65 ? "✦ Baik" : "◈ Cukup"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom band */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${accent}, #60A5FA, ${navy})`, flexShrink: 0 }} />
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            PAGE 1 — KPI + DISTRIBUSI + TREN
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="a4-page">

          {/* Page header strip */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 12, borderBottom: `2px solid ${navy}` }}>
            <div>
              <div style={{ fontSize: 7, color: textSecondary, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Sistem Informasi Posyandu Terpadu</div>
              <div style={{ fontSize: 13, color: navy, fontWeight: 800, marginTop: 1 }}>Laporan Analitik Kinerja Posyandu — Halaman 1</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: navy, borderRadius: 5, padding: "3px 10px" }}>
                <span style={{ color: "#93C5FD", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" }}>{currentDate}</span>
              </div>
            </div>
          </div>

          {/* Section title */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Ringkasan Eksekutif</div>
          </div>

          {/* KPI row - compact for A4 */}
          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Total Posyandu", value: totalPosyandu, unit: "unit aktif", color: accent, bg: "#EFF6FF", icon: "🏥" },
              { label: "Balita Terdaftar", value: totalBalita, unit: "anak (Feb)", color: emerald, bg: "#ECFDF5", icon: "👶" },
              { label: "Total Kader", value: totalKader, unit: "orang aktif", color: "#7C3AED", bg: "#F5F3FF", icon: "👩‍⚕️" },
              { label: "Kasus Kritis", value: totalKritis, unit: "butuh intervensi", color: red, bg: "#FEF2F2", icon: "⚠️" },
            ].map((kpi, i) => (
              <div key={i} style={{ background: kpi.bg, borderRadius: 8, padding: "12px 14px", border: `1px solid ${kpi.color}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{kpi.icon}</span>
                  <span style={{ fontSize: 9, color: kpi.color, fontWeight: 700 }}>{kpi.unit}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: kpi.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{kpi.value}</div>
                <p style={{ fontSize: 10, color: textSecondary, marginTop: 4 }}>{kpi.label}</p>
                <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: `${kpi.color}20` }}>
                  <div style={{ height: "100%", width: "100%", background: kpi.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Row: Distribusi + Skor per Posyandu */}
          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>

            {/* Distribusi Kategori */}
            <div style={{ background: "#FAFAFA", borderRadius: 8, padding: "14px 16px", border: `1px solid ${border}` }}>
              <div style={{ fontSize: 9, color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${accent}`, paddingLeft: 8, marginBottom: 10 }}>
                Distribusi Kategori Kinerja
              </div>
              {[
                { label: "Sangat Baik", count: perfCat.sangatBaik, color: emerald, range: "≥ 80" },
                { label: "Baik", count: perfCat.baik, color: accent, range: "65–79" },
                { label: "Cukup", count: perfCat.cukup, color: amber, range: "50–64" },
                { label: "Kurang", count: perfCat.kurang, color: red, range: "< 50" },
              ].map((cat) => (
                <div key={cat.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: textPrimary }}>{cat.label}</span>
                      <span style={{ fontSize: 9, color: textSecondary }}>Skor {cat.range}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: cat.color }}>{cat.count}</span>
                      <span style={{ fontSize: 9, color: textSecondary }}>{Math.round((cat.count / totalPosyandu) * 100)}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(cat.count / totalPosyandu) * 100}%`, background: cat.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "8px 10px", background: "#EFF6FF", borderRadius: 6, border: "1px solid #BFDBFE" }}>
                <p style={{ fontSize: 10, color: navy, lineHeight: 1.5 }}>
                  <strong style={{ color: emerald }}>{perfCat.sangatBaik + perfCat.baik}</strong>/{totalPosyandu} posyandu ({Math.round(((perfCat.sangatBaik + perfCat.baik) / totalPosyandu) * 100)}%) berperforma baik.{" "}
                  <strong style={{ color: red }}>{perfCat.cukup + perfCat.kurang}</strong> posyandu butuh pembinaan.
                </p>
              </div>
            </div>

            {/* Skor per Posyandu */}
            <div style={{ background: "#FAFAFA", borderRadius: 8, padding: "14px 16px", border: `1px solid ${border}` }}>
              <div style={{ fontSize: 9, color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${accent}`, paddingLeft: 8, marginBottom: 10 }}>
                Skor Kinerja Per Posyandu
              </div>
              {posyanduPerformanceData.map((p, i) => {
                const color = p.kategori === "Sangat Baik" ? emerald : p.kategori === "Baik" ? accent : p.kategori === "Cukup" ? amber : red;
                return (
                  <div key={i} style={{ marginBottom: 7 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: textPrimary }}>{p.nama_posyandu}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="tag" style={{ background: `${color}15`, color, fontSize: 9, padding: "1px 7px" }}>{p.kategori}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color }}>{p.skor_kinerja}</span>
                      </div>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.skor_kinerja}%`, background: color, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tren Chart */}
          <div className="no-break" style={{ background: "#FAFAFA", borderRadius: 8, padding: "14px 16px", border: `1px solid ${border}` }}>
            <div style={{ fontSize: 9, color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${accent}`, paddingLeft: 8, marginBottom: 6 }}>
              Tren Kunjungan 6 Bulan (Sep 2024 – Feb 2025)
            </div>
            <BarChart data={chartData} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
              {[
                { label: "Balita (Feb)", value: monthlyTrendData[5].balita, prev: monthlyTrendData[4].balita, color: "#3B82F6" },
                { label: "Ibu Hamil (Feb)", value: monthlyTrendData[5].ibu_hamil, prev: monthlyTrendData[4].ibu_hamil, color: "#EC4899" },
                { label: "Imunisasi (Feb)", value: monthlyTrendData[5].imunisasi, prev: monthlyTrendData[4].imunisasi, color: "#10B981" },
              ].map((s, i) => {
                const change = s.value - s.prev;
                const pct = Math.round((change / s.prev) * 100);
                return (
                  <div key={i} style={{ background: "#fff", borderRadius: 6, padding: "8px 10px", border: `1px solid ${border}` }}>
                    <p style={{ fontSize: 9, color: textSecondary, fontWeight: 600 }}>{s.label}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</span>
                      <span style={{ fontSize: 10, color: change >= 0 ? emerald : red, fontWeight: 600 }}>
                        {change >= 0 ? "▲" : "▼"}{Math.abs(pct)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Page footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 8, borderTop: `1px solid ${border}` }}>
            <span style={{ fontSize: 8, color: textSecondary }}>Sistem Informasi Posyandu Terpadu — Dokumen Rahasia</span>
            <span style={{ fontSize: 8, color: textSecondary }}>Halaman 1 / 3</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            PAGE 2 — TOP/BOTTOM + DETAIL INDIKATOR + KADER
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="a4-page">
          {/* Page header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 12, borderBottom: `2px solid ${navy}` }}>
            <div>
              <div style={{ fontSize: 7, color: textSecondary, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Sistem Informasi Posyandu Terpadu</div>
              <div style={{ fontSize: 13, color: navy, fontWeight: 800, marginTop: 1 }}>Perbandingan Kinerja & Beban Kerja Kader — Halaman 2</div>
            </div>
            <div style={{ background: navy, borderRadius: 5, padding: "3px 10px" }}>
              <span style={{ color: "#93C5FD", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" }}>{currentDate}</span>
            </div>
          </div>

          {/* Top/Bottom 5 */}
          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "14px 16px", border: "1px solid #BBF7D0" }}>
              <div style={{ fontSize: 9, color: emerald, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${emerald}`, paddingLeft: 8, marginBottom: 10 }}>
                🏆 Top 5 Posyandu Terbaik
              </div>
              {top5.map((p, i) => (
                <HBar key={p.posyandu_id} label={p.nama_posyandu} value={p.skor_kinerja} max={100}
                  color={i === 0 ? "#059669" : i === 1 ? "#10B981" : "#34D399"} rank={i + 1} />
              ))}
            </div>
            <div style={{ background: "#FFF5F5", borderRadius: 8, padding: "14px 16px", border: "1px solid #FECACA" }}>
              <div style={{ fontSize: 9, color: red, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${red}`, paddingLeft: 8, marginBottom: 10 }}>
                ⚠️ Perlu Perhatian
              </div>
              {bottom5.map((p, i) => (
                <HBar key={p.posyandu_id} label={p.nama_posyandu} value={p.skor_kinerja} max={100}
                  color={i === 0 ? "#DC2626" : i === 1 ? "#EF4444" : "#F87171"} rank={i + 1} />
              ))}
              <div style={{ marginTop: 10, padding: "8px 10px", background: "#FEF2F2", borderRadius: 6, border: "1px solid #FECACA" }}>
                <p style={{ fontSize: 9, color: "#7F1D1D", lineHeight: 1.5 }}>
                  ⚡ Rekomendasikan kunjungan pembinaan ke {perfCat.kurang + perfCat.cukup} posyandu kategori Cukup dan Kurang.
                </p>
              </div>
            </div>
          </div>

          {/* Detail Indikator Table */}
          <div className="no-break" style={{ background: "#FAFAFA", borderRadius: 8, padding: "14px 16px", border: `1px solid ${border}`, marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${accent}`, paddingLeft: 8, marginBottom: 12 }}>
              Skor Detail Per Indikator — Seluruh Posyandu
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", fontSize: 9 }}>Posyandu</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Skor Total</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Kehadiran</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Cakupan Gizi</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Kader Aktif</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Kategori</th>
                </tr>
              </thead>
              <tbody>
                {posyanduPerformanceData.map((p, i) => {
                  const color = p.kategori === "Sangat Baik" ? emerald : p.kategori === "Baik" ? accent : p.kategori === "Cukup" ? amber : red;
                  return (
                    <tr key={i}>
                      <td style={{ fontSize: 11, fontWeight: 600, padding: "7px 14px" }}>{p.nama_posyandu}</td>
                      <td style={{ textAlign: "center", padding: "7px 14px" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color }}>{p.skor_kinerja}</span>
                      </td>
                      <td style={{ textAlign: "center", padding: "7px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <div style={{ width: 48, height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${p.tingkat_kehadiran}%`, background: "#3B82F6", borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 10, color: textSecondary }}>{p.tingkat_kehadiran}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center", padding: "7px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <div style={{ width: 48, height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${p.cakupan_gizi}%`, background: emerald, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 10, color: textSecondary }}>{p.cakupan_gizi}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center", padding: "7px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: 3 }}>
                          {Array.from({ length: 5 }).map((_, k) => (
                            <div key={k} style={{ width: 7, height: 7, borderRadius: "50%", background: k < p.aktif_kader ? color : "#E2E8F0" }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: "center", padding: "7px 14px" }}>
                        <span className="tag" style={{ background: `${color}15`, color, fontSize: 9, padding: "2px 8px" }}>{p.kategori}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Kader Workload */}
          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <div style={{ background: "#FAFAFA", borderRadius: 8, padding: "14px 16px", border: `1px solid ${border}` }}>
              <div style={{ fontSize: 9, color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${accent}`, paddingLeft: 8, marginBottom: 12 }}>
                Distribusi Beban Kader
              </div>
              {[
                { label: "Beban Tinggi", count: wlCat.tinggi, color: red, desc: "Skor ≥ 75" },
                { label: "Beban Sedang", count: wlCat.sedang, color: amber, desc: "Skor 50–74" },
                { label: "Beban Rendah", count: wlCat.rendah, color: emerald, desc: "Skor < 50" },
              ].map((w) => (
                <div key={w.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: w.color }}>{w.label}</span>
                      <p style={{ fontSize: 9, color: textSecondary }}>{w.desc}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: w.color }}>{w.count}</span>
                      <p style={{ fontSize: 9, color: textSecondary }}>{Math.round((w.count / totalKader) * 100)}%</p>
                    </div>
                  </div>
                  <div style={{ height: 7, borderRadius: 4, background: "#F1F5F9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(w.count / totalKader) * 100}%`, background: w.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#FAFAFA", borderRadius: 8, padding: "14px 16px", border: `1px solid ${border}` }}>
              <div style={{ fontSize: 9, color: accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${accent}`, paddingLeft: 8, marginBottom: 12 }}>
                Beban Kerja Per Kader
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", fontSize: 9 }}>Nama Kader</th>
                    <th style={{ textAlign: "left", fontSize: 9 }}>Posyandu</th>
                    <th style={{ textAlign: "center", fontSize: 9 }}>Balita</th>
                    <th style={{ textAlign: "center", fontSize: 9 }}>Skor Beban</th>
                    <th style={{ textAlign: "center", fontSize: 9 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...kaderWorkloadData].sort((a, b) => b.skor_beban_kerja - a.skor_beban_kerja).map((k, i) => {
                    const color = k.kategori_beban === "Tinggi" ? red : k.kategori_beban === "Sedang" ? amber : emerald;
                    return (
                      <tr key={i}>
                        <td style={{ fontSize: 11, fontWeight: 600, padding: "6px 14px" }}>{k.nama}</td>
                        <td style={{ fontSize: 10, color: textSecondary, padding: "6px 14px" }}>{k.posyandu}</td>
                        <td style={{ textAlign: "center", fontSize: 11, fontWeight: 600, padding: "6px 14px" }}>{k.jumlah_balita}</td>
                        <td style={{ textAlign: "center", padding: "6px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <div style={{ width: 56, height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${k.skor_beban_kerja}%`, background: color, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color }}>{k.skor_beban_kerja}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "center", padding: "6px 14px" }}>
                          <span className="tag" style={{ background: `${color}15`, color, fontSize: 9, padding: "2px 8px" }}>{k.kategori_beban}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 8, borderTop: `1px solid ${border}` }}>
            <span style={{ fontSize: 8, color: textSecondary }}>Sistem Informasi Posyandu Terpadu — Dokumen Rahasia</span>
            <span style={{ fontSize: 8, color: textSecondary }}>Halaman 2 / 3</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            PAGE 3 — KASUS KRITIS + FOOTER TTD
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="a4-page">
          {/* Page header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 12, borderBottom: `2px solid ${navy}` }}>
            <div>
              <div style={{ fontSize: 7, color: textSecondary, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Sistem Informasi Posyandu Terpadu</div>
              <div style={{ fontSize: 13, color: navy, fontWeight: 800, marginTop: 1 }}>Kasus Kritis & Rekomendasi Tindakan — Halaman 3</div>
            </div>
            <div style={{ background: "#FEF2F2", borderRadius: 5, padding: "3px 10px", border: "1px solid #FECACA" }}>
              <span style={{ color: red, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" }}>🚨 PRIORITAS TINGGI</span>
            </div>
          </div>

          {/* Critical intro */}
          <div style={{ background: "#FFF5F5", borderRadius: 8, padding: "12px 16px", border: "1px solid #FECACA", marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "#7F1D1D", lineHeight: 1.6 }}>
              Berikut adalah <strong>{criticalChildrenData.length} anak</strong> yang teridentifikasi mengalami masalah gizi serius dan/atau stunting.
              Data ini menjadi dasar program <strong>Pemberian Makanan Tambahan (PMT)</strong> dan <strong>kunjungan rumah prioritas</strong>.
              Seluruh kasus ditangani bersama Puskesmas dan Dinas Kesehatan setempat.
            </p>
          </div>

          {/* Critical table */}
          <div className="no-break" style={{ background: "#FAFAFA", borderRadius: 8, padding: "14px 16px", border: `1px solid ${border}`, marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: red, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderLeft: `3px solid ${red}`, paddingLeft: 8, marginBottom: 12 }}>
              Daftar Kasus Kritis — Gizi Buruk & Stunting
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "center", width: 28, fontSize: 9 }}>No</th>
                  <th style={{ textAlign: "left", fontSize: 9 }}>Nama Anak</th>
                  <th style={{ textAlign: "left", fontSize: 9 }}>Nama Ibu</th>
                  <th style={{ textAlign: "left", fontSize: 9 }}>Posyandu</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Usia (Bln)</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Status Gizi</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Stunting</th>
                  <th style={{ textAlign: "center", fontSize: 9 }}>Prioritas</th>
                </tr>
              </thead>
              <tbody>
                {criticalChildrenData.map((child, idx) => (
                  <tr key={idx} style={{ background: child.prioritas === "Sangat Tinggi" ? "#FFF5F5" : undefined }}>
                    <td style={{ textAlign: "center", color: textSecondary, fontWeight: 600, padding: "8px 14px", fontSize: 11 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 700, padding: "8px 14px", fontSize: 11 }}>{child.nama_anak}</td>
                    <td style={{ color: textSecondary, padding: "8px 14px", fontSize: 11 }}>{child.nama_ibu}</td>
                    <td style={{ color: textSecondary, padding: "8px 14px", fontSize: 11 }}>{child.posyandu_nama}</td>
                    <td style={{ textAlign: "center", fontWeight: 600, padding: "8px 14px", fontSize: 11 }}>{child.usia_bulan}</td>
                    <td style={{ textAlign: "center", padding: "8px 14px" }}>
                      <span className="tag" style={{ background: `${giziColor[child.status_gizi] ?? "#6B7280"}15`, color: giziColor[child.status_gizi] ?? "#6B7280", fontSize: 9 }}>
                        {child.status_gizi}
                      </span>
                    </td>
                    <td style={{ textAlign: "center", padding: "8px 14px" }}>
                      {child.status_stunting === "Stunting" ? (
                        <span className="tag" style={{ background: "#FEE2E2", color: red, fontSize: 9 }}>✓ Stunting</span>
                      ) : (
                        <span style={{ color: "#CBD5E1", fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: "center", padding: "8px 14px" }}>
                      <span className="tag" style={{ background: `${priorityColor[child.prioritas]}15`, color: priorityColor[child.prioritas], fontSize: 9 }}>
                        {child.prioritas}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rekomendasi tindakan */}
          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { icon: "💊", title: "Intervensi Gizi", desc: `${criticalChildrenData.filter(c => c.status_gizi === "Gizi Buruk").length} anak gizi buruk memerlukan PMT intensif dan monitoring mingguan oleh kader dan bidan desa.` },
              { icon: "📏", title: "Program Anti-Stunting", desc: `${criticalChildrenData.filter(c => c.status_stunting === "Stunting").length} kasus stunting perlu koordinasi Puskesmas untuk terapi tumbuh kembang dan suplementasi gizi.` },
              { icon: "🏠", title: "Kunjungan Rumah", desc: `Prioritaskan kunjungan rumah untuk ${criticalChildrenData.filter(c => c.prioritas === "Sangat Tinggi").length} kasus dengan prioritas Sangat Tinggi dalam 7 hari ke depan.` },
            ].map((a, i) => (
              <div key={i} style={{ background: "#FFF5F5", borderRadius: 8, padding: "14px 16px", border: "1px solid #FECACA" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>{a.title}</p>
                <p style={{ fontSize: 10, color: "#7F1D1D", lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>

          {/* Signature section */}
          <div style={{
            background: `linear-gradient(135deg, ${navy} 0%, #1a3a6b 100%)`,
            borderRadius: 10, padding: "20px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 14,
          }}>
            <div>
              <p style={{ color: "#93C5FD", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em" }}>SISTEM INFORMASI POSYANDU TERPADU</p>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginTop: 4 }}>Laporan ini dibuat otomatis dan bersifat rahasia</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 }}>Dicetak: {currentDate}</p>
            </div>
            <div style={{ display: "flex", gap: 32 }}>
              {["Kepala Desa", "Mengetahui"].map((role, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, marginBottom: 36 }}>{role}</p>
                  <div style={{ width: 120, height: 1, background: "rgba(255,255,255,0.3)" }} />
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, marginTop: 4 }}>( _________________ )</p>
                </div>
              ))}
            </div>
          </div>

          {/* Page footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${border}` }}>
            <span style={{ fontSize: 8, color: textSecondary }}>Sistem Informasi Posyandu Terpadu — Dokumen Rahasia</span>
            <span style={{ fontSize: 8, color: textSecondary }}>Halaman 3 / 3</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreviewLaporanPage;