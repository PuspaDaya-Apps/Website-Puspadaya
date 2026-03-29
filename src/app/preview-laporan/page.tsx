"use client";
import React, { useEffect, useState } from "react";
import {
  DashboardSummary,
  CriticalChild,
  PosyanduItem,
  PosyanduPerformance,
  MonthlyTrendData,
  KaderWorkload,
} from "@/types/dashboard-kepala-desa";
import {
  posyanduListData,
  dashboardSummaryData,
  monthlyTrendData,
  posyanduPerformanceData,
  kaderWorkloadData,
  criticalChildrenData,
} from "@/data/dummy-dashboard-kepala-desa";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  navy:    "#0F2044",
  accent:  "#1D6FE8",
  emerald: "#059669",
  amber:   "#D97706",
  red:     "#DC2626",
  purple:  "#7C3AED",
  pink:    "#DB2777",
  orange:  "#EA580C",
  border:  "#E2E8F0",
  muted:   "#F8FAFC",
  text:    "#0F172A",
  textSub: "#64748B",
  white:   "#FFFFFF",
};

// ─── Tiny reusable components ─────────────────────────────────────────────────
const Tag: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    padding: "2px 9px", borderRadius: 20,
    fontSize: 10, fontWeight: 700,
    background: `${color}18`, color,
    border: `1px solid ${color}30`,
  }}>{label}</span>
);

const SectionHeader: React.FC<{ title: string; color?: string; icon?: string }> = ({ title, color = T.accent, icon }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, color,
    letterSpacing: "0.09em", textTransform: "uppercase" as const,
    borderLeft: `3px solid ${color}`, paddingLeft: 9,
    marginBottom: 12, display: "flex", alignItems: "center", gap: 5,
  }}>
    {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
    {title}
  </div>
);

const PageHeader: React.FC<{ title: string; page: number; total: number; date: string }> = ({ title, page, total, date }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 9, borderBottom: `2px solid ${T.navy}` }}>
    <div>
      <div style={{ fontSize: 7, color: T.textSub, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>Sistem Informasi Posyandu Terpadu</div>
      <div style={{ fontSize: 13, color: T.navy, fontWeight: 800, marginTop: 1 }}>{title}</div>
    </div>
    <div style={{ display: "flex", gap: 7 }}>
      <div style={{ background: T.navy, borderRadius: 5, padding: "3px 10px" }}>
        <span style={{ color: "#93C5FD", fontSize: 9, fontWeight: 700 }}>{date}</span>
      </div>
      <div style={{ background: "#F1F5F9", borderRadius: 5, padding: "3px 10px" }}>
        <span style={{ color: T.textSub, fontSize: 9, fontWeight: 600 }}>Hal. {page}/{total}</span>
      </div>
    </div>
  </div>
);

const PageFooter: React.FC<{ page: number; total: number }> = ({ page, total }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 7, borderTop: `1px solid ${T.border}` }}>
    <span style={{ fontSize: 8, color: T.textSub }}>Sistem Informasi Posyandu Terpadu — Dokumen Rahasia Internal</span>
    <span style={{ fontSize: 8, color: T.textSub }}>Halaman {page} / {total}</span>
  </div>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; noBreak?: boolean }> = ({ children, style, noBreak }) => (
  <div className={noBreak ? "no-break" : ""} style={{ background: "#FAFAFA", borderRadius: 8, padding: "12px 14px", border: `1px solid ${T.border}`, ...style }}>
    {children}
  </div>
);

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
const LineChart: React.FC<{ data: { label: string; balita: number; ibu_hamil: number; imunisasi: number }[] }> = ({ data }) => {
  const W = 610, H = 170, PL = 42, PB = 28, PT = 18, PR = 10;
  const cW = W - PL - PR, cH = H - PB - PT;
  const maxV = Math.max(...data.flatMap(d => [d.balita, d.ibu_hamil, d.imunisasi]));
  const yMax = Math.ceil(maxV / 50) * 50 + 50;
  const xStep = cW / (data.length - 1);

  const pts = (key: "balita" | "ibu_hamil" | "imunisasi") =>
    data.map((d, i) => [PL + i * xStep, PT + cH - (d[key] / yMax) * cH] as [number, number]);

  const linePath = (points: [number, number][]) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  const areaPath = (points: [number, number][]) =>
    `${linePath(points)} L${points[points.length - 1][0].toFixed(1)},${(PT + cH).toFixed(1)} L${points[0][0].toFixed(1)},${(PT + cH).toFixed(1)} Z`;

  const series = [
    { key: "balita" as const, color: "#3B82F6", label: "Balita" },
    { key: "ibu_hamil" as const, color: "#EC4899", label: "Ibu Hamil" },
    { key: "imunisasi" as const, color: "#10B981", label: "Imunisasi" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", fontFamily: "DM Sans, sans-serif" }}>
      <defs>
        {series.map(s => (
          <linearGradient key={s.key} id={`lg-${s.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0, 1, 2, 3, 4, 5].map(i => {
        const v = Math.round((yMax / 5) * i);
        const y = PT + cH - (v / yMax) * cH;
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#E2E8F0" strokeWidth="0.7" strokeDasharray="3,3" />
            <text x={PL - 4} y={y + 3} textAnchor="end" fontSize="8" fill={T.textSub}>{v}</text>
          </g>
        );
      })}
      {series.map(s => <path key={s.key} d={areaPath(pts(s.key))} fill={`url(#lg-${s.key})`} />)}
      {series.map(s => <path key={s.key} d={linePath(pts(s.key))} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />)}
      {series.map(s => pts(s.key).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill={s.color} stroke="white" strokeWidth="1.5" />
          <text x={x} y={y - 6} textAnchor="middle" fontSize="8" fill={s.color} fontWeight="700">{data[i][s.key]}</text>
        </g>
      )))}
      {data.map((d, i) => (
        <text key={i} x={PL + i * xStep} y={H - 5} textAnchor="middle" fontSize="9" fill={T.textSub} fontWeight="500">{d.label}</text>
      ))}
      <line x1={PL} y1={PT} x2={PL} y2={PT + cH} stroke={T.border} strokeWidth="1.2" />
      <line x1={PL} y1={PT + cH} x2={W - PR} y2={PT + cH} stroke={T.border} strokeWidth="1.2" />
      {series.map((s, i) => (
        <g key={i} transform={`translate(${PL + i * 110}, ${H - 1})`}>
          <rect width="10" height="3" fill={s.color} rx="1.5" y="-3" />
          <text x="13" y="0" fontSize="8" fill={T.textSub}>{s.label}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
const DonutChart: React.FC<{
  segments: { label: string; value: number; color: string }[];
  centerLabel: string; centerValue: string | number; size?: number;
}> = ({ segments, centerLabel, centerValue, size = 100 }) => {
  const total = segments.reduce((s, d) => s + d.value, 0);
  const r = 38, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="13" />
          {segments.map((seg, i) => {
            const dash = (seg.value / total) * circ;
            const gap = circ - dash;
            const el = (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="13"
                strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} transform="rotate(-90 50 50)" strokeLinecap="butt" />
            );
            offset += dash;
            return el;
          })}
          <text x={cx} y={cy - 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={T.navy}>{centerValue}</text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="7" fill={T.textSub}>{centerLabel}</text>
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9.5, color: T.text, fontWeight: 600 }}>{seg.label}</span>
            <span style={{ fontSize: 9.5, color: seg.color, fontWeight: 800, marginLeft: 2 }}>{seg.value}</span>
            <span style={{ fontSize: 8.5, color: T.textSub }}>({Math.round((seg.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Horizontal Bar Row ───────────────────────────────────────────────────────
const HBarRow: React.FC<{ label: string; value: number; max: number; color: string; rank: number }> = ({ label, value, max, color, rank }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
    <div style={{ width: 22, height: 22, borderRadius: 5, background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{rank}</div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{value}</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 3 }} />
      </div>
    </div>
  </div>
);

// ─── Imunisasi Column ─────────────────────────────────────────────────────────
const ImuCol: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ height: 56, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 3 }}>
      <div style={{ width: 20, borderRadius: "3px 3px 0 0", height: `${Math.max((value / total) * 56, 3)}px`, background: color, position: "relative" }}>
        <span style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", fontSize: 7.5, fontWeight: 800, color, whiteSpace: "nowrap" }}>{value}</span>
      </div>
    </div>
    <div style={{ fontSize: 7.5, color: T.textSub, fontWeight: 600 }}>{label}</div>
  </div>
);

// ─── Prevalensi Card ──────────────────────────────────────────────────────────
const PrevalensiCard: React.FC<{ title: string; tag: string; jumlah: number; pct: number; color: string }> = ({ title, tag, jumlah, pct, color }) => (
  <div style={{ background: `${color}08`, borderRadius: 8, padding: "11px 13px", border: `1.5px solid ${color}25` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{title}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color, background: `${color}18`, padding: "2px 7px", borderRadius: 10 }}>{tag}</span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 7 }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{jumlah}</div>
        <div style={{ fontSize: 9, color: T.textSub, marginTop: 2 }}>balita</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color }}>{pct}%</div>
        <div style={{ fontSize: 9, color: T.textSub }}>prevalensi</div>
      </div>
    </div>
    <div style={{ height: 5, borderRadius: 3, background: `${color}20`, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }} />
    </div>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
const PreviewLaporanPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const currentDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const currentYear = new Date().getFullYear();

  const totalPosyandu = posyanduListData.length;
  const totalKader    = kaderWorkloadData.length;
  const avgScore      = Math.round(posyanduPerformanceData.reduce((s, p) => s + p.skor_kinerja, 0) / posyanduPerformanceData.length);
  const totalBalita   = monthlyTrendData[monthlyTrendData.length - 1].balita;

  const perfCat = {
    sangatBaik: posyanduPerformanceData.filter(p => p.kategori === "Sangat Baik").length,
    baik:       posyanduPerformanceData.filter(p => p.kategori === "Baik").length,
    cukup:      posyanduPerformanceData.filter(p => p.kategori === "Cukup").length,
    kurang:     posyanduPerformanceData.filter(p => p.kategori === "Kurang").length,
  };

  const wlCat = {
    tinggi: kaderWorkloadData.filter(k => k.kategori_beban === "Tinggi").length,
    sedang: kaderWorkloadData.filter(k => k.kategori_beban === "Sedang").length,
    rendah: kaderWorkloadData.filter(k => k.kategori_beban === "Rendah").length,
  };

  const top5    = [...posyanduPerformanceData].sort((a, b) => b.skor_kinerja - a.skor_kinerja).slice(0, 5);
  const bottom5 = [...posyanduPerformanceData].sort((a, b) => a.skor_kinerja - b.skor_kinerja).slice(0, 5);

  const skdn          = dashboardSummaryData.skdn_data;
  const kehadiranKomp = dashboardSummaryData.kehadiran_kompetensi;
  const durasiJarak   = dashboardSummaryData.durasi_jarak_agregat;
  const bebanKerjaTim = dashboardSummaryData.beban_kerja_tim;
  const imunisasi     = dashboardSummaryData.infant_immunization_coverage;
  const stunting      = dashboardSummaryData.stunting_prevalence;
  const wasting       = dashboardSummaryData.wasting_prevalence;
  const underweight   = dashboardSummaryData.underweight_prevalence;

  const chartData = monthlyTrendData.map(m => ({ label: m.bulan.slice(0, 3), balita: m.balita, ibu_hamil: m.ibu_hamil, imunisasi: m.imunisasi }));
  const catColor  = (k: string) => k === "Sangat Baik" ? T.emerald : k === "Baik" ? T.accent : k === "Cukup" ? T.amber : T.red;

  const imuColors: Record<string, string> = {
    bcg: "#3B82F6", dpt_1: "#8B5CF6", dpt_2: "#7C3AED", dpt_3: "#6D28D9",
    polio_1: "#EC4899", polio_2: "#DB2777", polio_3: "#BE185D", polio_4: "#9D174D",
    hepatitis: "#10B981", campak: "#F59E0B",
  };

  const priorityColor: Record<string, string> = { "Sangat Tinggi": T.red, "Tinggi": T.orange, "Sedang": T.amber };
  const giziColor: Record<string, string>      = { "Gizi Buruk": T.red, "Gizi Kurang": T.orange, "Gizi Baik": T.emerald };

  const TOTAL_PAGES = 5;

  useEffect(() => {
    const t = setTimeout(() => window.print(), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @media print {
          @page { size: A4 portrait; margin: 10mm 12mm; }
          html, body { width: 210mm; background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .screen-wrapper { background: white !important; padding: 0 !important; }
          .a4-cover { width: auto !important; height: auto !important; min-height: 277mm; box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; }
          .a4-page { width: auto !important; box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; padding: 0 !important; page-break-after: always; }
          .a4-page:last-child { page-break-after: auto; }
          .no-break { page-break-inside: avoid; break-inside: avoid; }
          table { page-break-inside: auto; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; break-inside: avoid; }
        }

        .screen-wrapper { background: #CBD5E1; padding: 36px 0; min-height: 100vh; }
        .a4-cover { width: 210mm; height: 297mm; background: white; margin: 0 auto 24px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.2); border-radius: 2px; display: flex; flex-direction: column; }
        .a4-page { width: 210mm; background: white; margin: 0 auto 24px; padding: 13mm 15mm; box-shadow: 0 8px 40px rgba(0,0,0,0.18); border-radius: 2px; }
        .no-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      {/* Nav */}
      <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 50, background: T.navy, boxShadow: "0 4px 20px rgba(15,32,68,0.3)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "13px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Laporan Analitik Posyandu</div>
              <div style={{ color: "#93C5FD", fontSize: 10 }}>Kepala Desa — {currentDate}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => window.print()} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              ↓ Export PDF
            </button>
            <button onClick={() => window.close()} style={{ background: "rgba(255,255,255,0.11)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, padding: "8px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Tutup
            </button>
          </div>
        </div>
      </div>

      <div className="screen-wrapper">

        {/* ══ COVER ═══════════════════════════════════════════ */}
        <div className="a4-cover">
          <div style={{ height: 7, background: `linear-gradient(90deg,${T.navy},${T.accent},#60A5FA)` }} />
          <div style={{ flex: 1, background: `linear-gradient(155deg,${T.navy} 0%,#1a3a6b 55%,#0d1f3c 100%)`, padding: "42px 50px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            {[{ t: -80, r: -80, s: 360 }, { b: 40, l: -60, s: 250 }, { t: "38%", r: "8%", s: 140 }].map((c: any, i) => (
              <div key={i} style={{ position: "absolute", borderRadius: "50%", background: "rgba(29,111,232,0.09)", width: c.s, height: c.s, top: c.t, right: c.r, bottom: c.b, left: c.l, pointerEvents: "none" }} />
            ))}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 32 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(29,111,232,0.5)" }}>
                  <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div>
                  <div style={{ color: "#93C5FD", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em" }}>SISTEM INFORMASI POSYANDU TERPADU</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9.5, marginTop: 2 }}>Kementerian Kesehatan Republik Indonesia</div>
                </div>
              </div>
              <div style={{ width: 50, height: 3, background: T.accent, borderRadius: 2, marginBottom: 24 }} />
              <div style={{ display: "inline-block", background: "rgba(29,111,232,0.2)", border: "1px solid rgba(29,111,232,0.35)", borderRadius: 6, padding: "4px 12px", marginBottom: 16 }}>
                <span style={{ color: "#93C5FD", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em" }}>LAPORAN ANALITIK RESMI</span>
              </div>
              <h1 style={{ color: "#fff", fontSize: 40, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 13 }}>
                Laporan Analitik<br /><span style={{ color: "#60A5FA" }}>Kinerja Posyandu</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 13, lineHeight: 1.65, maxWidth: 390 }}>
                Evaluasi komprehensif kinerja seluruh unit Posyandu, distribusi beban kader, tren kunjungan, cakupan imunisasi, data gizi, dan penanganan kasus kritis.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13, margin: "36px 0" }}>
              {[
                { icon: "🏥", v: totalPosyandu, u: "Posyandu" },
                { icon: "👶", v: totalBalita, u: "Balita (Feb)" },
                { icon: "👩‍⚕️", v: totalKader, u: "Kader Aktif" },
                { icon: "⚠️", v: criticalChildrenData.length, u: "Kasus Kritis" },
              ].map((k, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "15px 17px" }}>
                  <div style={{ fontSize: 19, marginBottom: 6 }}>{k.icon}</div>
                  <div style={{ color: "#fff", fontSize: 25, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>{k.v}</div>
                  <div style={{ color: "rgba(255,255,255,0.42)", fontSize: 9.5, marginTop: 4 }}>{k.u}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.32)", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 5 }}>INFORMASI DOKUMEN</div>
                {[{ l: "Periode", v: `Semester II — Tahun ${currentYear}` }, { l: "Dicetak", v: currentDate }, { l: "Klasifikasi", v: "Rahasia Internal" }].map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 2 }}>
                    <span style={{ color: "rgba(255,255,255,0.32)", fontSize: 9.5, width: 68 }}>{m.l}</span>
                    <span style={{ color: "rgba(255,255,255,0.72)", fontSize: 9.5, fontWeight: 500 }}>{m.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(5,150,105,0.2)", border: "1px solid rgba(5,150,105,0.4)", borderRadius: 10, padding: "11px 18px", textAlign: "right" }}>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 3 }}>INDEKS KINERJA</div>
                <div style={{ color: "#fff", fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>{avgScore}</div>
                <div style={{ color: "#34D399", fontSize: 9.5, fontWeight: 600, marginTop: 3 }}>✦ {avgScore >= 80 ? "Sangat Baik" : avgScore >= 65 ? "Baik" : "Cukup"}</div>
              </div>
            </div>
          </div>
          <div style={{ height: 4, background: `linear-gradient(90deg,${T.accent},#60A5FA,${T.navy})` }} />
        </div>

        {/* ══ PAGE 1 — KPI + KINERJA + TREN ════════════════════ */}
        <div className="a4-page">
          <PageHeader title="Ringkasan Kinerja & Tren Kunjungan" page={1} total={TOTAL_PAGES} date={currentDate} />

          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9, marginBottom: 13 }}>
            {[
              { label: "Total Posyandu", value: totalPosyandu, unit: "unit aktif", color: T.accent, bg: "#EFF6FF", icon: "🏥" },
              { label: "Balita Terdaftar", value: totalBalita, unit: "anak (Feb)", color: T.emerald, bg: "#ECFDF5", icon: "👶" },
              { label: "Total Kader", value: totalKader, unit: "kader bertugas", color: T.purple, bg: "#F5F3FF", icon: "👩‍⚕️" },
              { label: "Kasus Kritis", value: criticalChildrenData.length, unit: "butuh intervensi", color: T.red, bg: "#FEF2F2", icon: "⚠️" },
            ].map((k, i) => (
              <div key={i} style={{ background: k.bg, borderRadius: 8, padding: "11px 12px", border: `1px solid ${k.color}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: k.color, fontWeight: 700 }}>{k.label}</span>
                  <span style={{ fontSize: 17 }}>{k.icon}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: k.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{k.value}</div>
                <div style={{ fontSize: 9, color: T.textSub, marginTop: 3 }}>{k.unit}</div>
                <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: `${k.color}20` }}>
                  <div style={{ height: "100%", width: "100%", background: k.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 13 }}>
            <Card>
              <SectionHeader title="Distribusi Kategori Kinerja" icon="📊" />
              <DonutChart
                segments={[
                  { label: "Sangat Baik (≥80)", value: perfCat.sangatBaik, color: T.emerald },
                  { label: "Baik (65–79)",       value: perfCat.baik,       color: T.accent  },
                  { label: "Cukup (50–64)",       value: perfCat.cukup,      color: T.amber   },
                  { label: "Kurang (<50)",         value: perfCat.kurang,     color: T.red     },
                ]}
                centerLabel="posyandu" centerValue={totalPosyandu} size={105}
              />
              <div style={{ marginTop: 9, padding: "7px 9px", background: "#EFF6FF", borderRadius: 6, border: "1px solid #BFDBFE" }}>
                <p style={{ fontSize: 9.5, color: T.navy, lineHeight: 1.55 }}>
                  <strong style={{ color: T.emerald }}>{perfCat.sangatBaik + perfCat.baik}</strong>/{totalPosyandu} ({Math.round(((perfCat.sangatBaik + perfCat.baik) / totalPosyandu) * 100)}%) berperforma baik.{" "}
                  <strong style={{ color: T.red }}>{perfCat.cukup + perfCat.kurang}</strong> posyandu butuh pembinaan.
                </p>
              </div>
            </Card>
            <Card>
              <SectionHeader title="Skor Kinerja Per Posyandu" icon="📈" />
              {posyanduPerformanceData.map((p, i) => {
                const col = catColor(p.kategori);
                return (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: T.text }}>{p.nama_posyandu}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Tag label={p.kategori} color={col} />
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: col }}>{p.skor_kinerja}</span>
                      </div>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.skor_kinerja}%`, background: col, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          <Card noBreak>
            <SectionHeader title="Tren Kunjungan 6 Bulan (Sep 2024 – Feb 2025)" icon="📉" />
            <LineChart data={chartData} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7, marginTop: 8 }}>
              {[
                { l: "Balita (Feb)", v: monthlyTrendData[5].balita, p: monthlyTrendData[4].balita, c: "#3B82F6" },
                { l: "Ibu Hamil (Feb)", v: monthlyTrendData[5].ibu_hamil, p: monthlyTrendData[4].ibu_hamil, c: "#EC4899" },
                { l: "Imunisasi (Feb)", v: monthlyTrendData[5].imunisasi ?? 0, p: monthlyTrendData[4].imunisasi ?? 0, c: "#10B981" },
              ].map((s, i) => {
                const ch = s.v - s.p;
                const pct = Math.round((ch / s.p) * 100);
                return (
                  <div key={i} style={{ background: T.white, borderRadius: 6, padding: "7px 9px", border: `1px solid ${T.border}` }}>
                    <p style={{ fontSize: 8.5, color: T.textSub, fontWeight: 600 }}>{s.l}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 2 }}>
                      <span style={{ fontSize: 19, fontWeight: 800, color: s.c }}>{s.v}</span>
                      <span style={{ fontSize: 9.5, color: ch >= 0 ? T.emerald : T.red, fontWeight: 700 }}>{ch >= 0 ? "▲" : "▼"}{Math.abs(pct)}%</span>
                    </div>
                    <p style={{ fontSize: 8.5, color: T.textSub }}>vs bln lalu: {s.p}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <PageFooter page={1} total={TOTAL_PAGES} />
        </div>

        {/* ══ PAGE 2 — TOP/BOTTOM + KADER + SKDN ══════════════ */}
      <div className="a4-page">
  <PageHeader title="Perbandingan Posyandu, Beban Kader & SKDN" page={2} total={TOTAL_PAGES} date={currentDate} />

  <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 13 }}>
    <Card style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
      <SectionHeader title="Top 5 Posyandu Terbaik" color={T.emerald} icon="🏆" />
      {top5.map((p, i) => <HBarRow key={i} label={p.nama_posyandu} value={p.skor_kinerja} max={100} color={i === 0 ? T.emerald : i === 1 ? "#10B981" : "#34D399"} rank={i + 1} />)}
    </Card>
    <Card style={{ background: "#FFF5F5", border: "1px solid #FECACA" }}>
      <SectionHeader title="Perlu Perhatian" color={T.red} icon="⚠️" />
      {bottom5.map((p, i) => <HBarRow key={i} label={p.nama_posyandu} value={p.skor_kinerja} max={100} color={i === 0 ? T.red : i === 1 ? "#EF4444" : "#F87171"} rank={i + 1} />)}
      <div style={{ marginTop: 7, padding: "7px 9px", background: "#FEF2F2", borderRadius: 6, border: "1px solid #FECACA" }}>
        <p style={{ fontSize: 9, color: "#7F1D1D", lineHeight: 1.5 }}>⚡ Rekomendasikan kunjungan pembinaan ke <strong>{perfCat.cukup + perfCat.kurang}</strong> posyandu kategori Cukup & Kurang.</p>
      </div>
    </Card>
  </div>

  {/* ── Beban Kader Summary ── */}
  <Card noBreak style={{ marginBottom: 11 }}>
    <SectionHeader title="Distribusi Beban Kader" icon="👥" />
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center" }}>
      <DonutChart
        segments={[
          { label: "Tinggi", value: wlCat.tinggi, color: T.red },
          { label: "Sedang", value: wlCat.sedang, color: T.amber },
          { label: "Rendah", value: wlCat.rendah, color: T.emerald },
        ]}
        centerLabel="kader" centerValue={totalKader} size={110}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { lbl: "Beban Tinggi", val: wlCat.tinggi, color: T.red, bg: "#FEF2F2", border: "#FECACA" },
          { lbl: "Beban Sedang", val: wlCat.sedang, color: T.amber, bg: "#FFFBEB", border: "#FDE68A" },
          { lbl: "Beban Rendah", val: wlCat.rendah, color: T.emerald, bg: "#ECFDF5", border: "#A7F3D0" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 7, padding: "10px 12px", border: `1px solid ${s.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: T.textSub, fontWeight: 600, marginBottom: 3 }}>{s.lbl}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 8.5, color: T.textSub, marginTop: 2 }}>kader</div>
          </div>
        ))}
        <div style={{ gridColumn: "span 3", background: "#EFF6FF", borderRadius: 7, padding: "9px 12px", border: "1px solid #BFDBFE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, color: T.textSub, fontWeight: 600 }}>Total Kader Aktif</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.accent, lineHeight: 1 }}>{totalKader}</div>
            <div style={{ fontSize: 8.5, color: T.textSub }}>seluruh posyandu</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: T.textSub, fontWeight: 600 }}>Rata-rata Skor Beban</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.navy, lineHeight: 1 }}>
              {Math.round(kaderWorkloadData.reduce((s, k) => s + k.skor_beban_kerja, 0) / kaderWorkloadData.length)}
            </div>
            <div style={{ fontSize: 8.5, color: T.textSub }}>dari 100</div>
          </div>
        </div>
      </div>
    </div>
  </Card>

  {/* ── Detail Beban Kerja Per Kader ── */}
  <Card noBreak style={{ marginBottom: 13 }}>
    <SectionHeader title="Detail Beban Kerja Per Kader" icon="📋" />
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#F1F5F9" }}>
          {["Nama Kader", "Posyandu", "Balita", "Skor Beban", "Status"].map(h => (
            <th key={h} style={{ padding: "5px 9px", fontSize: 8.5, fontWeight: 700, color: T.textSub, textAlign: h === "Nama Kader" || h === "Posyandu" ? "left" : "center", textTransform: "uppercase" as const, letterSpacing: "0.05em", borderBottom: `2px solid ${T.border}` }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...kaderWorkloadData].sort((a, b) => b.skor_beban_kerja - a.skor_beban_kerja).map((k, i) => {
          const col = k.kategori_beban === "Tinggi" ? T.red : k.kategori_beban === "Sedang" ? T.amber : T.emerald;
          return (
            <tr key={i} style={{ borderBottom: `1px solid #F8FAFC` }}>
              <td style={{ padding: "5px 9px", fontSize: 10.5, fontWeight: 600 }}>{k.nama}</td>
              <td style={{ padding: "5px 9px", fontSize: 9.5, color: T.textSub }}>{k.posyandu}</td>
              <td style={{ padding: "5px 9px", fontSize: 10.5, fontWeight: 700, textAlign: "center" }}>{k.jumlah_balita}</td>
              <td style={{ padding: "5px 9px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  <div style={{ width: 46, height: 4, borderRadius: 2, background: "#F1F5F9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${k.skor_beban_kerja}%`, background: col, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: col }}>{k.skor_beban_kerja}</span>
                </div>
              </td>
              <td style={{ padding: "5px 9px", textAlign: "center" }}><Tag label={k.kategori_beban} color={col} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </Card>

  <Card noBreak>
    <SectionHeader title="SKDN — Sistem Kunjungan Dasar Nutrisi" icon="📊" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 9, marginBottom: 9 }}>
      {[
        { lbl: "S — Semua Balita", val: skdn.S, sub: "0–59 bln", color: "#3B82F6", bg: "#EFF6FF" },
        { lbl: "K — Kunjungan", val: skdn.K, sub: "Balita datang", color: T.purple, bg: "#F5F3FF" },
        { lbl: "D — Ditimbang", val: skdn.D, sub: "Berat badan", color: T.emerald, bg: "#ECFDF5" },
        { lbl: "N — Naik BB", val: skdn.N, sub: "Berat naik", color: T.orange, bg: "#FFF7ED" },
        { lbl: "Level SKDN", val: "4", sub: "Posyandu Mandiri", color: T.emerald, bg: "#ECFDF5" },
      ].map((s, i) => (
        <div key={i} style={{ background: s.bg, borderRadius: 7, padding: "9px 10px", border: `1px solid ${s.color}20`, textAlign: "center" }}>
          <div style={{ fontSize: 9.5, color: T.textSub, fontWeight: 600, marginBottom: 3 }}>{s.lbl}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
          <div style={{ fontSize: 8.5, color: T.textSub, marginTop: 2 }}>{s.sub}</div>
        </div>
      ))}
    </div>
    <div style={{ background: "#FFF7ED", borderRadius: 6, padding: "9px 12px", display: "flex", alignItems: "center", gap: 14 }}>
      <div>
        <div style={{ fontSize: 8.5, color: T.textSub, fontWeight: 600 }}>Persentase Kenaikan BB</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.orange }}>{skdn.persentase_kenaikan_bb}%</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ height: 9, borderRadius: 5, background: "#FED7AA", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${skdn.persentase_kenaikan_bb}%`, background: T.orange, borderRadius: 5 }} />
        </div>
      </div>
    </div>
  </Card>

  <PageFooter page={2} total={TOTAL_PAGES} />
</div>

        {/* ══ PAGE 3 — KEHADIRAN + DURASI + USIA ════════════════ */}
        <div className="a4-page">
          <PageHeader title="Kehadiran Per Kompetensi, Durasi Kerja & Usia" page={3} total={TOTAL_PAGES} date={currentDate} />

          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 13 }}>
            <Card>
              <SectionHeader title="Kehadiran Balita Per Kompetensi" color="#3B82F6" icon="👶" />
              {kehadiranKomp.balita.detail.map((item: any, idx: number) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: "#3B82F6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 800, flexShrink: 0 }}>{idx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600 }}>{item.kompetensi}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#3B82F6" }}>{item.jumlah}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "#DBEAFE", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(item.jumlah / Math.max(...kehadiranKomp.balita.detail.map((d: any) => d.jumlah))) * 100}%`, background: "#3B82F6", borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHeader title="Kehadiran Ibu Hamil Per Kompetensi" color={T.pink} icon="🤰" />
              {kehadiranKomp.ibu_hamil.detail.map((item: any, idx: number) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 9 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: T.pink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 800, flexShrink: 0 }}>{idx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <div>
                        <span style={{ fontSize: 10.5, fontWeight: 600 }}>{item.kompetensi}</span>
                        {item.aktivitas_kader && <p style={{ fontSize: 8, color: T.textSub, marginTop: 1 }}>{item.aktivitas_kader.slice(0, 2).join(", ")}</p>}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: T.pink }}>{item.jumlah}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "#FCE7F3", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(item.jumlah / Math.max(...kehadiranKomp.ibu_hamil.detail.map((d: any) => d.jumlah))) * 100}%`, background: T.pink, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 13 }}>
            <Card>
              <SectionHeader title="Durasi Kerja Kader" color={T.purple} icon="⏱️" />
              {[
                { l: "Durasi Kerja Posyandu (total)", v: durasiJarak.total_durasi_kerja_posyandu, u: "jam", c: "#3B82F6" },
                { l: "Durasi Kunjungan Rumah (total)", v: durasiJarak.total_durasi_kunjungan_rumah, u: "jam", c: T.purple },
                { l: "Rata-rata Durasi Posyandu", v: durasiJarak.rata_rata_durasi_posyandu, u: "jam/kader", c: T.navy },
                { l: "Rata-rata Durasi Kunjungan", v: durasiJarak.rata_rata_durasi_kunjungan, u: "jam/kader", c: T.navy },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 10, color: T.textSub }}>{r.l}</span>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: r.c }}>{r.v}</span>
                    <span style={{ fontSize: 8.5, color: T.textSub, marginLeft: 3 }}>{r.u}</span>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHeader title="Jarak Kerja & Beban Tim" color={T.orange} icon="📍" />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${T.border}`, marginBottom: 9 }}>
                <span style={{ fontSize: 10, color: T.textSub }}>Total Jarak Kunjungan Rumah</span>
                <div><span style={{ fontSize: 15, fontWeight: 800, color: T.orange }}>{durasiJarak.total_jarak_kunjungan_rumah}</span><span style={{ fontSize: 8.5, color: T.textSub, marginLeft: 3 }}>km</span></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                <span style={{ fontSize: 10, color: T.textSub }}>Rata-rata Jarak</span>
                <div><span style={{ fontSize: 15, fontWeight: 800, color: T.navy }}>{durasiJarak.rata_rata_jarak}</span><span style={{ fontSize: 8.5, color: T.textSub, marginLeft: 3 }}>km/kader</span></div>
              </div>
              <div style={{ background: "#FFF7ED", borderRadius: 7, padding: "9px 11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: "#92400E", fontWeight: 600 }}>Skor Beban Kerja Rata-rata</span>
                  <span style={{ fontSize: 17, fontWeight: 800, color: T.orange }}>{bebanKerjaTim.skor_beban_rata_rata}</span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: "#FED7AA", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${bebanKerjaTim.skor_beban_rata_rata}%`, background: T.orange, borderRadius: 4 }} />
                </div>
              </div>
            </Card>
          </div>

          <Card noBreak>
            <SectionHeader title="Kunjungan Posyandu Berdasarkan Usia" icon="👶" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 11 }}>
              {[
                { lbl: "Infant (0–12 Bulan)", sub: "Bayi berkunjung", val: dashboardSummaryData.infant_0_12_months, color: "#3B82F6", bg: "#EFF6FF" },
                { lbl: "Toddler (0–23 Bulan)", sub: "Bawah 2 tahun", val: dashboardSummaryData.children_0_23_months, color: T.purple, bg: "#F5F3FF" },
                { lbl: "Under 5 (0–59 Bulan)", sub: "Balita berkunjung", val: dashboardSummaryData.children_0_59_months, color: T.emerald, bg: "#ECFDF5" },
              ].map((u, i) => (
                <div key={i} style={{ background: u.bg, borderRadius: 8, padding: "13px 15px", border: `1.5px solid ${u.color}25`, textAlign: "center" }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: `${u.color}20`, margin: "0 auto 9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: u.color }}>{u.val}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.navy }}>{u.lbl}</div>
                  <div style={{ fontSize: 9, color: T.textSub, marginTop: 2 }}>{u.sub}</div>
                </div>
              ))}
            </div>
          </Card>

          <PageFooter page={3} total={TOTAL_PAGES} />
        </div>

        {/* ══ PAGE 4 — WANITA + IMUNISASI + PREVALENSI ═════════ */}
        <div className="a4-page">
          <PageHeader title="Data Ibu & Anak, Imunisasi & Prevalensi Gizi" page={4} total={TOTAL_PAGES} date={currentDate} />

          <div className="no-break" style={{ marginBottom: 13 }}>
            <SectionHeader title="Data Wanita, Ibu Hamil & KB" color={T.pink} icon="👩" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9, marginBottom: 9 }}>
              {[
                { lbl: "Wanita Pasca Subur", sub: "> 49 tahun", val: dashboardSummaryData.women_post_fertile, color: T.pink, bg: "#FDF2F8" },
                { lbl: "Ibu Hamil KEK", sub: "Kurang Energi Kronis", val: dashboardSummaryData.pregnant_women_under_energized, color: T.red, bg: "#FEF2F2" },
                { lbl: "Ibu Hamil Risiko Tinggi", sub: "Perlu perhatian khusus", val: dashboardSummaryData.high_risk_pregnant_women, color: T.orange, bg: "#FFF7ED" },
                { lbl: "Ibu Menyusui", sub: "ASI Eksklusif", val: dashboardSummaryData.breastfeeding_mothers, color: T.emerald, bg: "#ECFDF5" },
              ].map((w, i) => (
                <div key={i} style={{ background: w.bg, borderRadius: 8, padding: "10px 12px", border: `1px solid ${w.color}20`, textAlign: "center" }}>
                  <div style={{ fontSize: 21, fontWeight: 800, color: w.color, lineHeight: 1 }}>{w.val}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.navy, marginTop: 5 }}>{w.lbl}</div>
                  <div style={{ fontSize: 8.5, color: T.textSub, marginTop: 2 }}>{w.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
              {[
                { lbl: "Penerima KB", sub: "Jumlah akseptor", val: dashboardSummaryData.kb_acceptors, color: "#3B82F6", bg: "#EFF6FF" },
                { lbl: "Ibu Hamil dengan Asuransi", sub: "Jaminan kesehatan", val: dashboardSummaryData.pregnant_women_with_insurance, color: T.emerald, bg: "#ECFDF5" },
                { lbl: "Balita dengan Asuransi", sub: "0–59 bulan", val: dashboardSummaryData.children_under_5_with_insurance, color: T.purple, bg: "#F5F3FF" },
              ].map((k, i) => (
                <div key={i} style={{ background: k.bg, borderRadius: 7, padding: "9px 11px", border: `1px solid ${k.color}20`, display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${k.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: k.color }}>{k.val}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: T.navy }}>{k.lbl}</div>
                    <div style={{ fontSize: 8.5, color: T.textSub }}>{k.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card noBreak style={{ marginBottom: 13 }}>
            <SectionHeader title="Cakupan Imunisasi Bayi" color={T.accent} icon="💉" />
            <div style={{ display: "flex", alignItems: "flex-end", gap: 9, padding: "6px 2px 0" }}>
              {[
                { label: "BCG", key: "bcg" },
                { label: "DPT 1", key: "dpt_1" },
                { label: "DPT 2", key: "dpt_2" },
                { label: "DPT 3", key: "dpt_3" },
                { label: "Polio 1", key: "polio_1" },
                { label: "Polio 2", key: "polio_2" },
                { label: "Polio 3", key: "polio_3" },
                { label: "Polio 4", key: "polio_4" },
                { label: "Hepatitis", key: "hepatitis" },
                { label: "Campak", key: "campak" },
              ].map((vk, i) => (
                <ImuCol key={i} label={vk.label} value={(imunisasi as any)[vk.key]} total={imunisasi.total_imunisasi} color={imuColors[vk.key]} />
              ))}
            </div>
            <div style={{ marginTop: 12, background: "#F8FAFC", borderRadius: 6, padding: "9px 11px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8.5, color: T.textSub, fontWeight: 600 }}>Total Imunisasi</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: T.navy }}>{imunisasi.total_imunisasi}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 9, borderRadius: 5, background: "#D1FAE5", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${imunisasi.cakupan_persentase}%`, background: T.emerald, borderRadius: 5 }} />
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 8.5, color: T.textSub, fontWeight: 600 }}>Cakupan</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: T.emerald }}>{imunisasi.cakupan_persentase}%</div>
              </div>
            </div>
          </Card>

          <div className="no-break">
            <SectionHeader title="Jumlah & Prevalensi Masalah Gizi Balita" color={T.red} icon="📊" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 11 }}>
              <PrevalensiCard title="Stunting" tag="Kronis" jumlah={stunting.jumlah} pct={stunting.prevalensi_persentase} color={T.red} />
              <PrevalensiCard title="Wasting" tag="Akut" jumlah={wasting.jumlah} pct={wasting.prevalensi_persentase} color={T.orange} />
              <PrevalensiCard title="Underweight" tag="BB Rendah" jumlah={underweight.jumlah} pct={underweight.prevalensi_persentase} color={T.amber} />
            </div>
            <div style={{ marginTop: 10, background: "#FAFAFA", borderRadius: 7, padding: "10px 12px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, color: T.textSub, marginBottom: 7, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Perbandingan Prevalensi Visual</div>
              {[
                { lbl: "Stunting", val: stunting.prevalensi_persentase, col: T.red },
                { lbl: "Wasting", val: wasting.prevalensi_persentase, col: T.orange },
                { lbl: "Underweight", val: underweight.prevalensi_persentase, col: T.amber },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: T.text, width: 75, flexShrink: 0 }}>{p.lbl}</span>
                  <div style={{ flex: 1, height: 9, borderRadius: 5, background: "#F1F5F9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(p.val * 2.5, 100)}%`, background: p.col, borderRadius: 5 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: p.col, width: 34, textAlign: "right" }}>{p.val}%</span>
                </div>
              ))}
            </div>
          </div>

          <PageFooter page={4} total={TOTAL_PAGES} />
        </div>

        {/* ══ PAGE 5 — KASUS KRITIS + TTD ══════════════════════ */}
        <div className="a4-page">
          <PageHeader title="Kasus Kritis & Rekomendasi Tindakan" page={5} total={TOTAL_PAGES} date={currentDate} />

          <div className="no-break" style={{ background: "#FEF2F2", borderRadius: 8, padding: "9px 13px", border: "1px solid #FECACA", marginBottom: 13, display: "flex", gap: 9, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
            <p style={{ fontSize: 10, color: "#7F1D1D", lineHeight: 1.6 }}>
              Terdapat <strong>{criticalChildrenData.length} anak</strong> yang teridentifikasi mengalami masalah gizi serius dan/atau stunting.
              Data ini menjadi dasar program <strong>Pemberian Makanan Tambahan (PMT)</strong> dan <strong>kunjungan rumah prioritas</strong>.
              Seluruh kasus dikoordinasikan dengan Puskesmas dan Dinas Kesehatan setempat.
            </p>
          </div>

          <Card style={{ marginBottom: 13, border: "1.5px solid #FECACA" }}>
            <SectionHeader title="Daftar Kasus Kritis — Gizi Buruk & Stunting" color={T.red} icon="🚨" />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FEF2F2" }}>
                  {["No", "Nama Anak", "Nama Ibu", "Posyandu", "Usia", "Status Gizi", "Stunting", "Prioritas"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", fontSize: 8.5, fontWeight: 700, color: "#991B1B", textAlign: h === "No" || h === "Usia" || h === "Status Gizi" || h === "Stunting" || h === "Prioritas" ? "center" : "left", textTransform: "uppercase" as const, letterSpacing: "0.05em", borderBottom: "2px solid #FECACA" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criticalChildrenData.map((child: any, idx: number) => (
                  <tr key={idx} style={{ background: child.prioritas === "Sangat Tinggi" ? "#FFF5F5" : T.white, borderBottom: `1px solid #FEF2F2` }}>
                    <td style={{ padding: "7px 10px", textAlign: "center", fontSize: 9.5, color: T.textSub, fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ padding: "7px 10px", fontSize: 11, fontWeight: 700 }}>{child.nama_anak}</td>
                    <td style={{ padding: "7px 10px", fontSize: 10, color: T.textSub }}>{child.nama_ibu}</td>
                    <td style={{ padding: "7px 10px", fontSize: 10, color: T.textSub }}>{child.posyandu_nama}</td>
                    <td style={{ padding: "7px 10px", textAlign: "center", fontSize: 11, fontWeight: 700 }}>{child.usia_bulan}</td>
                    <td style={{ padding: "7px 10px", textAlign: "center" }}><Tag label={child.status_gizi} color={giziColor[child.status_gizi] ?? T.textSub} /></td>
                    <td style={{ padding: "7px 10px", textAlign: "center" }}>
                      {child.status_stunting === "Stunting" ? <Tag label="✓ Ya" color={T.red} /> : <span style={{ color: "#CBD5E1", fontSize: 11 }}>—</span>}
                    </td>
                    <td style={{ padding: "7px 10px", textAlign: "center" }}><Tag label={child.prioritas} color={priorityColor[child.prioritas] ?? T.textSub} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="no-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 15 }}>
            {[
              { icon: "💊", title: "Intervensi Gizi", color: T.red, desc: `${criticalChildrenData.filter((c: any) => c.status_gizi === "Gizi Buruk").length} anak gizi buruk perlu PMT intensif dan monitoring mingguan oleh kader dan bidan desa.` },
              { icon: "📏", title: "Program Anti-Stunting", color: T.orange, desc: `${criticalChildrenData.filter((c: any) => c.status_stunting === "Stunting").length} kasus stunting perlu koordinasi Puskesmas untuk terapi tumbuh kembang dan suplementasi.` },
              { icon: "🏠", title: "Kunjungan Rumah", color: T.amber, desc: `Prioritaskan ${criticalChildrenData.filter((c: any) => c.prioritas === "Sangat Tinggi").length} kasus Sangat Tinggi dalam 7 hari ke depan.` },
            ].map((a, i) => (
              <div key={i} style={{ background: `${a.color}08`, borderRadius: 8, padding: "12px 13px", border: `1px solid ${a.color}25` }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{a.icon}</div>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: a.color, marginBottom: 5 }}>{a.title}</p>
                <p style={{ fontSize: 9, color: T.text, lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background: `linear-gradient(135deg,${T.navy} 0%,#1a3a6b 100%)`, borderRadius: 10, padding: "17px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#93C5FD", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em" }}>SISTEM INFORMASI POSYANDU TERPADU</p>
              <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginTop: 3 }}>Laporan ini dibuat secara otomatis dan bersifat rahasia</p>
              <p style={{ color: "rgba(255,255,255,0.43)", fontSize: 9, marginTop: 2 }}>Dicetak: {currentDate}</p>
            </div>
            <div style={{ display: "flex", gap: 32 }}>
              {["Kepala Desa", "Mengetahui"].map((role, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.43)", fontSize: 8.5, marginBottom: 32 }}>{role}</p>
                  <div style={{ width: 110, height: 1, background: "rgba(255,255,255,0.28)" }} />
                  <p style={{ color: "rgba(255,255,255,0.33)", fontSize: 8.5, marginTop: 3 }}>( _______________ )</p>
                </div>
              ))}
            </div>
          </div>

          <PageFooter page={5} total={TOTAL_PAGES} />
        </div>

      </div>
    </div>
  );
};

export default PreviewLaporanPage;