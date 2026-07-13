import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StatistikJenisPekerjaan } from "@/app/api/dashboatrd-new/statistikjenispekerjaan";
import { Statistikbebankerja } from "@/app/api/dashboatrd-new/statistikbebankerja";
import { StatistikBulanan } from "@/app/api/dashboatrd-new/statistikbulanan";
import { StatistikJarakTempuh } from "@/app/api/dashboatrd-new/statistikjaraktempuh";
import { Ibuhamil } from "@/app/api/kuesioner/ibuhamil";
import {
  JawabanKuesionerBySession,
  JawabanKuesionerResponse,
} from "@/app/api/kuesioner/detail-kuesioner";

// ─── DATA TYPES ──────────────────────────────────────────────
interface KaderPDFData {
  profil: {
    nama_kader: string;
    nama_role: string;
    jenis_pekerjaan: string[];
  } | null;
  statistik: {
    total_anak_diukur_bulan_ini: number;
    total_ibu_hamil_diukur_bulan_ini: number;
    skor_beban_kerja_bulan_ini: number;
  } | null;
  aktivitas: {
    jumlah_kehadiran_balita: number;
    jumlah_kehadiran_ibu_hamil: number;
    jenis_pekerjaan: { jenis: string; kategori: string }[];
  } | null;
  durasi: {
    durasi_kerja_posyandu: number;
    durasi_kunjungan_rumah: number;
    jarak_total_kunjungan_rumah: number;
  } | null;
  kuesionerIbuHamil: {
    nama: string;
    jawaban: JawabanKuesionerResponse[];
  } | null;
}

async function fetchAllKaderData(): Promise<KaderPDFData> {
  const [profilRes, statistikRes, aktivitasRes, durasiRes, ibuHamilRes] =
    await Promise.all([
      StatistikJenisPekerjaan(false),
      Statistikbebankerja(false),
      StatistikBulanan(false),
      StatistikJarakTempuh(false),
      Ibuhamil(),
    ]);

  let kuesionerIbuHamil: {
    nama: string;
    jawaban: JawabanKuesionerResponse[];
  } | null = null;
  const firstIbu = ibuHamilRes.data?.data?.[0];
  if (firstIbu?.id) {
    const kuesionerRes = await JawabanKuesionerBySession(firstIbu.id);
    if (kuesionerRes.data && kuesionerRes.data.length > 0) {
      kuesionerIbuHamil = {
        nama: firstIbu.nama_ibu,
        jawaban: kuesionerRes.data,
      };
    }
  }

  return {
    profil: profilRes.data,
    statistik: statistikRes.data,
    aktivitas: aktivitasRes.data,
    durasi: durasiRes.data,
    kuesionerIbuHamil,
  };
}

// ─── COLOR PALETTE ───────────────────────────────────────────
type RGB = [number, number, number];

// Primary palette — pink, biru, oranye: ceria & hangat untuk ibu-ibu kader
const navy: RGB = [15, 32, 75]; // cover utama — biru gelap
const blue: RGB = [37, 99, 235]; // biru cerah — profil & aksen utama
const blueLight: RGB = [219, 234, 254]; // background biru muda
const orange: RGB = [234, 88, 12]; // oranye — kehadiran & durasi
const orangeLight: RGB = [255, 237, 213]; // background oranye muda
const pink: RGB = [219, 39, 119]; // pink — ibu hamil & kuesioner
const pinkLight: RGB = [252, 231, 243]; // background pink muda
const neutralLight: RGB = [241, 245, 249]; // background netral untuk kartu

const txtDark: RGB = [15, 23, 42]; // teks utama — hampir hitam
const txtMuted: RGB = [100, 116, 139]; // teks sekunder
const white: RGB = [255, 255, 255];
const bgPage: RGB = [248, 250, 252]; // background halaman

// Palet logo Puspadaya — dipakai khusus di cover & closing page saja,
// terpisah dari palet isi dokumen di atas.
const logoPink: RGB = [236, 72, 153];
const logoOrange: RGB = [245, 166, 61];
const coverBg: RGB = [45, 20, 80]; // ungu gelap — background cover & closing
const LOGO_URL = "/images/logo/logo-puspa.png";
const LOGO_ASPECT = 3011 / 4006; // height / width asli logo

// Helper shortcuts
const fill = (d: jsPDF, c: RGB) => d.setFillColor(c[0], c[1], c[2]);
const text = (d: jsPDF, c: RGB) => d.setTextColor(c[0], c[1], c[2]);
const draw = (d: jsPDF, c: RGB) => d.setDrawColor(c[0], c[1], c[2]);

/** Fetch logo dari /public dan ubah ke data URL untuk doc.addImage. */
async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(LOGO_URL);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── DRAWING HELPERS ─────────────────────────────────────────

/** Draws a rounded rectangle (since jsPDF roundedRect exists) */
function roundRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor: RGB,
  strokeColor?: RGB
) {
  fill(doc, fillColor);
  if (strokeColor) {
    draw(doc, strokeColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, r, r, "FD");
  } else {
    doc.roundedRect(x, y, w, h, r, r, "F");
  }
}

/** Draws a stat card with big number + label */
function statCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
  accent: RGB,
  bgColor: RGB
) {
  // Card background
  roundRect(doc, x, y, w, h, 3, bgColor);
  // Left accent bar
  fill(doc, accent);
  doc.roundedRect(x, y, 3, h, 1.5, 1.5, "F");

  // Value
  text(doc, accent);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(value, x + w / 2, y + h / 2 - 2, { align: "center" });

  // Label
  text(doc, txtMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(label, x + w / 2, y + h / 2 + 8, { align: "center" });
}

/** Draws a simple horizontal bar chart */
function barChart(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  items: { label: string; value: number; color: RGB }[]
) {
  const maxVal = Math.max(...items.map((i) => i.value), 1);
  const barH = 10;
  const gap = 6;
  let cy = y;

  for (const item of items) {
    // Label
    text(doc, txtDark);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(item.label, x, cy + 3);

    // Background track
    const barX = x + 55;
    const barW = w - 80;
    fill(doc, [229, 231, 235]);
    doc.roundedRect(barX, cy - 2, barW, barH, 2, 2, "F");

    // Filled bar
    const filledW = Math.max((item.value / maxVal) * barW, 4);
    fill(doc, item.color);
    doc.roundedRect(barX, cy - 2, filledW, barH, 2, 2, "F");

    // Value text
    text(doc, item.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(String(item.value), barX + barW + 4, cy + 5);

    cy += barH + gap;
  }
  return cy;
}

/** Draws a donut/ring chart for percentage (beban kerja) */
function donutChart(
  doc: jsPDF,
  cx: number,
  cy: number,
  radius: number,
  percentage: number,
  color: RGB,
  label: string
) {
  const segments = 60;
  const anglePerSeg = (2 * Math.PI) / segments;
  const filled = Math.round((percentage / 100) * segments);

  // Background ring
  draw(doc, [229, 231, 235]);
  doc.setLineWidth(4);
  for (let i = 0; i < segments; i++) {
    const a1 = i * anglePerSeg - Math.PI / 2;
    const a2 = (i + 1) * anglePerSeg - Math.PI / 2;
    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy + radius * Math.sin(a1);
    const x2 = cx + radius * Math.cos(a2);
    const y2 = cy + radius * Math.sin(a2);
    doc.line(x1, y1, x2, y2);
  }

  // Filled ring
  draw(doc, color);
  doc.setLineWidth(4);
  for (let i = 0; i < filled; i++) {
    const a1 = i * anglePerSeg - Math.PI / 2;
    const a2 = (i + 1) * anglePerSeg - Math.PI / 2;
    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy + radius * Math.sin(a1);
    const x2 = cx + radius * Math.cos(a2);
    const y2 = cy + radius * Math.sin(a2);
    doc.line(x1, y1, x2, y2);
  }

  // Center text
  text(doc, color);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${percentage}`, cx, cy + 2, { align: "center" });
  text(doc, txtMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(label, cx, cy + 8, { align: "center" });
}

/** Draws a mini icon/badge circle with a symbol letter */
function iconBadge(
  doc: jsPDF,
  x: number,
  y: number,
  r: number,
  letter: string,
  color: RGB
) {
  fill(doc, color);
  doc.circle(x, y, r, "F");
  text(doc, white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(r * 1.8);
  doc.text(letter, x, y + r * 0.4, { align: "center" });
}

// ─── SECTION HEADER ──────────────────────────────────────────
function sectionHeader(
  doc: jsPDF,
  title: string,
  color: RGB,
  pw: number,
  m: number,
  y: number
): number {
  const cw = pw - m * 2;
  // Accent line
  fill(doc, color);
  doc.rect(m, y, cw, 1, "F");
  // Title row
  fill(doc, color);
  doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
  doc.rect(m, y + 1, cw, 10, "F");
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  text(doc, color);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, m + 5, y + 8);
  return y + 18;
}

// ─── MAIN PDF EXPORT ─────────────────────────────────────────
export async function downloadKaderPDF(): Promise<void> {
  const data = await fetchAllKaderData();

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 18; // margin
  const cw = pw - m * 2;
  let y = 0;

  const now = new Date();
  const periodeText = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const dicetakText = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const checkPage = (need: number) => {
    if (y > ph - need) {
      doc.addPage();
      y = 22;
    }
  };

  const logoDataUrl = await loadLogoDataUrl();

  // ════════════════════════════════════════════
  // COVER PAGE — High contrast redesign
  // ════════════════════════════════════════════

  // Full page dark purple background — selaras dengan logo Puspadaya
  fill(doc, coverBg);
  doc.rect(0, 0, pw, ph, "F");

  // Decorative geometric shapes (subtle) — variasi warna logo
  doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
  fill(doc, logoPink);
  doc.circle(pw + 20, -20, 100, "F");
  fill(doc, logoOrange);
  doc.circle(-30, ph + 10, 80, "F");
  fill(doc, white);
  doc.rect(pw - 60, ph - 120, 80, 80, "F");
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // Top accent stripe
  fill(doc, logoPink);
  doc.rect(0, 0, pw, 4, "F");

  // Central content area — white card on dark bg for max contrast
  const cardX = 25;
  const cardY = 65;
  const cardW = pw - 50;
  const cardH = 120;
  roundRect(doc, cardX, cardY, cardW, cardH, 5, white);

  // Pink accent bar inside card top
  fill(doc, logoPink);
  doc.roundedRect(cardX, cardY, cardW, 5, 5, 5, "F");
  fill(doc, white);
  doc.rect(cardX, cardY + 3, cardW, 4, "F");

  // Logo Puspadaya — di atas judul, center horizontal
  const coverLogoW = 28;
  const coverLogoH = coverLogoW * LOGO_ASPECT;
  const coverLogoY = cardY + 12;
  if (logoDataUrl) {
    doc.addImage(
      logoDataUrl,
      "PNG",
      pw / 2 - coverLogoW / 2,
      coverLogoY,
      coverLogoW,
      coverLogoH
    );
  }

  // Title on the white card — dark text for contrast
  const titleY = coverLogoY + coverLogoH + 13;
  text(doc, navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("LAPORAN KINERJA", pw / 2, titleY, { align: "center" });
  doc.setFontSize(20);
  text(doc, logoPink);
  doc.text("KADER POSYANDU", pw / 2, titleY + 12, { align: "center" });

  // Divider line
  draw(doc, [252, 231, 243]);
  doc.setLineWidth(0.5);
  doc.line(cardX + 30, titleY + 20, cardX + cardW - 30, titleY + 20);

  // Kader name & role on card
  text(doc, txtDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(data.profil?.nama_kader ?? "Kader", pw / 2, titleY + 34, {
    align: "center",
  });
  text(doc, txtMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.profil?.nama_role ?? "", pw / 2, titleY + 43, {
    align: "center",
  });

  // Periode badge on card
  roundRect(doc, pw / 2 - 30, titleY + 50, 60, 10, 3, [252, 231, 243]);
  text(doc, logoPink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(periodeText, pw / 2, titleY + 57, { align: "center" });

  // Bottom info on dark background — light pink/purple text
  text(doc, [200, 170, 220]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Dicetak: ${dicetakText}`, pw / 2, ph - 40, { align: "center" });

  text(doc, [200, 170, 220]);
  doc.setFontSize(8);
  doc.text(
    "Dokumen Resmi — Dashboard Posyandu",
    pw / 2,
    ph - 30,
    { align: "center" }
  );

  // Bottom accent stripe
  fill(doc, logoPink);
  doc.rect(0, ph - 4, pw, 4, "F");

  // ════════════════════════════════════════════
  // PAGE 2 — DAFTAR ISI
  // ════════════════════════════════════════════
  doc.addPage();
  y = 28;

  text(doc, navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Daftar Isi", m, y);
  y += 4;
  fill(doc, blue);
  doc.rect(m, y, 30, 1.5, "F");
  y += 12;

  const tocItems: [string, string, RGB][] = [
    ["01", "Profil Kader", blue],
    ["02", "Statistik Kehadiran & Beban Kerja", orange],
    ["03", "Grafik Kehadiran Bulanan", orange],
    ["04", "Kuesioner Ibu Hamil", pink],
    ["05", "Durasi Kerja & Jarak Tempuh", blue],
  ];

  for (const [no, title, color] of tocItems) {
    roundRect(doc, m, y - 4, cw, 12, 2, neutralLight);
    // Number badge
    iconBadge(doc, m + 8, y + 2, 4, no, color);
    // Title
    text(doc, txtDark);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(title, m + 18, y + 3.5);
    y += 16;
  }

  // ════════════════════════════════════════════
  // PAGE 3 — PROFIL + STATISTIK + CHARTS
  // ════════════════════════════════════════════
  doc.addPage();
  y = 22;

  // --- 1. PROFIL KADER ---
  y = sectionHeader(doc, "1.  Profil Kader", blue, pw, m, y);
  if (data.profil) {
    autoTable(doc, {
      startY: y,
      head: [["Informasi", "Keterangan"]],
      body: [
        ["Nama Kader", data.profil.nama_kader],
        ["Jabatan / Role", data.profil.nama_role],
        [
          "Jenis Pekerjaan",
          (data.profil.jenis_pekerjaan ?? []).join(", ") || "-",
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: blue,
        textColor: white,
        fontSize: 10,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        textColor: txtDark,
        lineColor: [219, 234, 254],
        lineWidth: 0.3,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50, fillColor: blueLight },
        1: { cellWidth: 120 },
      },
      margin: { left: m, right: m },
    });
    y = (doc as any).lastAutoTable.finalY + 16;
  }

  // --- 2. STATISTIK KEHADIRAN & BEBAN KERJA ---
  y = sectionHeader(doc, "2.  Statistik Kehadiran & Beban Kerja", orange, pw, m, y);

  if (data.statistik) {
    const balita = data.statistik.total_anak_diukur_bulan_ini;
    const ibuHamil = data.statistik.total_ibu_hamil_diukur_bulan_ini;
    const skor = data.statistik.skor_beban_kerja_bulan_ini;

    // ── 3 stat cards in a row ──
    const cardW2 = (cw - 8) / 3;
    const cardH2 = 32;
    statCard(doc, m, y, cardW2, cardH2, String(balita), "Balita Diukur", orange, orangeLight);
    statCard(doc, m + cardW2 + 4, y, cardW2, cardH2, String(ibuHamil), "Ibu Hamil Diukur", pink, pinkLight);
    statCard(doc, m + (cardW2 + 4) * 2, y, cardW2, cardH2, String(skor), "Skor Beban Kerja", blue, blueLight);
    y += cardH2 + 12;

    // ── Donut chart + bar chart side by side ──
    checkPage(70);
    // Donut for beban kerja
    const donutCx = m + 28;
    const donutCy = y + 25;
    const kategori =
      skor >= 80 ? "Tinggi" : skor >= 60 ? "Sedang" : "Rendah";
    const skorColor: RGB =
      skor >= 80 ? pink : skor >= 60 ? orange : blue;

    donutChart(doc, donutCx, donutCy, 18, skor, skorColor, "poin");
    text(doc, txtDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Beban Kerja", donutCx, donutCy + 26, { align: "center" });
    // Kategori badge
    const katColor: RGB =
      skor >= 80 ? pinkLight : skor >= 60 ? orangeLight : blueLight;
    roundRect(doc, donutCx - 14, donutCy + 29, 28, 8, 2, katColor);
    text(doc, skorColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(kategori, donutCx, donutCy + 34.5, { align: "center" });

    // Bar chart on the right
    const barX = m + 70;
    barChart(doc, barX, y + 6, cw - 70, [
      { label: "Balita Diukur", value: balita, color: orange },
      { label: "Ibu Hamil Diukur", value: ibuHamil, color: pink },
      { label: "Skor Beban Kerja", value: skor, color: blue },
    ]);

    y += 60;
  }

  // ════════════════════════════════════════════
  // 3. GRAFIK KEHADIRAN BULANAN
  // ════════════════════════════════════════════
  doc.addPage();
  y = 22;
  y = sectionHeader(doc, "3.  Grafik Kehadiran Bulanan", orange, pw, m, y);

  if (data.aktivitas) {
    const balitaH = data.aktivitas.jumlah_kehadiran_balita;
    const ibuH = data.aktivitas.jumlah_kehadiran_ibu_hamil;

    // Side by side stat cards
    const hw = (cw - 6) / 2;
    statCard(doc, m, y, hw, 28, String(balitaH), "Kehadiran Balita", orange, orangeLight);
    statCard(doc, m + hw + 6, y, hw, 28, String(ibuH), "Kehadiran Ibu Hamil", pink, pinkLight);
    y += 36;

    // Visual comparison bar
    checkPage(30);
    text(doc, txtDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Perbandingan Kehadiran", m, y);
    y += 6;

    const total = balitaH + ibuH || 1;
    const balitaPct = (balitaH / total) * 100;
    const ibuPct = (ibuH / total) * 100;
    const barFullW = cw;
    const barBalita = (balitaH / total) * barFullW;

    // Stacked bar
    fill(doc, orange);
    doc.roundedRect(m, y, barFullW, 10, 3, 3, "F");
    fill(doc, pink);
    doc.roundedRect(m + barBalita, y, barFullW - barBalita, 10, 0, 0, "F");
    // Fix right corner
    if (barBalita < barFullW - 3) {
      fill(doc, pink);
      doc.roundedRect(m + barBalita, y, barFullW - barBalita, 10, 3, 3, "F");
      fill(doc, orange);
      doc.roundedRect(m, y, barBalita + 3, 10, 3, 3, "F");
      // Overlap fix
      fill(doc, orange);
      doc.rect(m + barBalita - 1, y, 4, 10, "F");
    }

    // Legend
    y += 16;
    fill(doc, orange);
    doc.circle(m + 3, y, 2.5, "F");
    text(doc, txtDark);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(
      `Balita: ${balitaH} (${balitaPct.toFixed(0)}%)`,
      m + 8,
      y + 1.5
    );

    fill(doc, pink);
    doc.circle(m + 60, y, 2.5, "F");
    doc.text(
      `Ibu Hamil: ${ibuH} (${ibuPct.toFixed(0)}%)`,
      m + 65,
      y + 1.5
    );
    y += 12;

    // Aktivitas Jenis Pekerjaan
    if (data.aktivitas.jenis_pekerjaan?.length > 0) {
      checkPage(40);
      text(doc, txtDark);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Aktivitas Bulan Ini", m, y);
      y += 8;

      const grouped = data.aktivitas.jenis_pekerjaan.reduce(
        (acc: Record<string, string[]>, item) => {
          if (!acc[item.jenis]) acc[item.jenis] = [];
          acc[item.jenis].push(item.kategori);
          return acc;
        },
        {}
      );

      for (const [jenis, kategoris] of Object.entries(grouped)) {
        checkPage(kategoris.length * 6 + 16);
        // Card style
        roundRect(
          doc,
          m,
          y - 2,
          cw,
          kategoris.length * 6 + 10,
          3,
          neutralLight,
          [219, 234, 254]
        );

        // Title with icon
        iconBadge(doc, m + 6, y + 3, 3, ">", orange);
        text(doc, navy);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text(jenis, m + 12, y + 4.5);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        text(doc, txtMuted);
        for (const k of kategoris) {
          doc.text(`•  ${k}`, m + 14, y + 1.5);
          y += 6;
        }
        y += 6;
      }
    }
  } else {
    text(doc, txtMuted);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Data aktivitas belum tersedia.", m + 4, y);
    y += 12;
  }

  // ════════════════════════════════════════════
  // 4. KUESIONER IBU HAMIL
  // ════════════════════════════════════════════
  if (data.kuesionerIbuHamil) {
    checkPage(50);
    y = sectionHeader(
      doc,
      `4.  Kuesioner Ibu Hamil — ${data.kuesionerIbuHamil.nama}`,
      pink,
      pw,
      m,
      y
    );

    for (const sesi of data.kuesionerIbuHamil.jawaban) {
      checkPage(50);

      // Session header card
      const tgl = new Date(sesi.tanggal_pengisian).toLocaleDateString("id-ID");
      roundRect(doc, m, y - 3, cw, 10, 2, pinkLight);
      text(doc, pink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(`${sesi.kuisioner.nama_kuisioner}`, m + 5, y + 3.5);
      text(doc, txtMuted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(tgl, pw - m - 5, y + 3.5, { align: "right" });
      y += 14;

      autoTable(doc, {
        startY: y,
        head: [["Pertanyaan", "Jawaban"]],
        body: sesi.jawaban.map((j) => [
          j.pertanyaan.pertanyaan_text,
          j.jawaban_value,
        ]),
        theme: "striped",
        headStyles: {
          fillColor: pink,
          textColor: white,
          fontSize: 9.5,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: txtDark,
          lineColor: [252, 231, 243],
          lineWidth: 0.2,
        },
        alternateRowStyles: { fillColor: pinkLight },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 95 },
          1: { cellWidth: 75 },
        },
        margin: { left: m, right: m },
      });
      y = (doc as any).lastAutoTable.finalY + 12;
    }
  }

  // ════════════════════════════════════════════
  // 5. DURASI KERJA & JARAK TEMPUH
  // ════════════════════════════════════════════
  checkPage(70);
  y = sectionHeader(doc, "5.  Durasi Kerja & Jarak Tempuh", blue, pw, m, y);

  if (data.durasi) {
    // 3 stat cards
    const cw3 = (cw - 8) / 3;
    statCard(
      doc,
      m,
      y,
      cw3,
      32,
      `${data.durasi.durasi_kerja_posyandu}`,
      "Jam Kerja Posyandu",
      blue,
      blueLight
    );
    statCard(
      doc,
      m + cw3 + 4,
      y,
      cw3,
      32,
      `${data.durasi.durasi_kunjungan_rumah}`,
      "Jam Kunjungan Rumah",
      orange,
      orangeLight
    );
    statCard(
      doc,
      m + (cw3 + 4) * 2,
      y,
      cw3,
      32,
      `${data.durasi.jarak_total_kunjungan_rumah}`,
      "Km Jarak Tempuh",
      pink,
      pinkLight
    );
    y += 40;

    // Visual bar chart
    checkPage(50);
    text(doc, txtDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Distribusi Waktu & Jarak", m, y);
    y += 8;

    barChart(doc, m, y, cw, [
      {
        label: "Kerja Posyandu",
        value: data.durasi.durasi_kerja_posyandu,
        color: blue,
      },
      {
        label: "Kunjungan Rumah",
        value: data.durasi.durasi_kunjungan_rumah,
        color: orange,
      },
      {
        label: "Jarak (km)",
        value: data.durasi.jarak_total_kunjungan_rumah,
        color: pink,
      },
    ]);
    y += 56;
  }

  // ════════════════════════════════════════════
  // CLOSING PAGE
  // ════════════════════════════════════════════
  doc.addPage();

  // Full dark purple background — sama seperti cover
  fill(doc, coverBg);
  doc.rect(0, 0, pw, ph, "F");

  // Decorative circles — variasi warna logo
  doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
  fill(doc, logoPink);
  doc.circle(pw - 30, 40, 60, "F");
  fill(doc, logoOrange);
  doc.circle(30, ph - 50, 50, "F");
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // Top accent
  fill(doc, logoPink);
  doc.rect(0, 0, pw, 4, "F");

  // Central white card
  const clX = 30;
  const clH = 92;
  const clY = ph / 2 - clH / 2;
  const clW = pw - 60;
  roundRect(doc, clX, clY, clW, clH, 5, white);

  // Pink top bar
  fill(doc, logoPink);
  doc.roundedRect(clX, clY, clW, 4, 5, 5, "F");
  fill(doc, white);
  doc.rect(clX, clY + 2, clW, 4, "F");

  // Logo Puspadaya — di atas teks penutup, center horizontal
  const closeLogoW = 25;
  const closeLogoH = closeLogoW * LOGO_ASPECT;
  const closeLogoY = clY + 10;
  if (logoDataUrl) {
    doc.addImage(
      logoDataUrl,
      "PNG",
      pw / 2 - closeLogoW / 2,
      closeLogoY,
      closeLogoW,
      closeLogoH
    );
  }

  // Closing text
  const closeTitleY = closeLogoY + closeLogoH + 10;
  text(doc, navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("LAPORAN INI DIBUAT", pw / 2, closeTitleY, { align: "center" });
  doc.text("SECARA OTOMATIS", pw / 2, closeTitleY + 10, { align: "center" });

  text(doc, logoPink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("oleh Aplikasi Puspadaya", pw / 2, closeTitleY + 24, {
    align: "center",
  });

  text(doc, txtMuted);
  doc.setFontSize(9);
  doc.text(`Dicetak: ${dicetakText}`, pw / 2, closeTitleY + 36, {
    align: "center",
  });

  // Bottom accent
  fill(doc, logoPink);
  doc.rect(0, ph - 4, pw, 4, "F");

  // ════════════════════════════════════════════
  // FOOTER — Semua halaman kecuali cover & closing
  // ════════════════════════════════════════════
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 2; i < pageCount; i++) {
    doc.setPage(i);
    // Top line
    draw(doc, blueLight);
    doc.setLineWidth(0.3);
    doc.line(m, 14, pw - m, 14);
    // Footer
    doc.setFontSize(7.5);
    text(doc, txtMuted);
    doc.setFont("helvetica", "normal");
    doc.text(`Halaman ${i - 1}`, pw / 2, ph - 10, { align: "center" });
    doc.text("Laporan Kader Posyandu", m, ph - 10);
    doc.text(
      now.toLocaleDateString("id-ID"),
      pw - m,
      ph - 10,
      { align: "right" }
    );
    // Footer line
    draw(doc, blueLight);
    doc.line(m, ph - 14, pw - m, ph - 14);
  }

  // ════════════════════════════════════════════
  // SAVE
  // ════════════════════════════════════════════
  doc.save(
    `Laporan_Kader_${
      data.profil?.nama_kader?.replace(/\s+/g, "_") ?? "Posyandu"
    }.pdf`
  );
}