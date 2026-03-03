import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  posyanduListData,
  dashboardSummaryData,
  monthlyTrendData,
  posyanduPerformanceData,
  kaderWorkloadData,
  criticalChildrenData,
} from "@/data/dummy-dashboard-kepala-desa";

interface ReportOptions {
  includeCharts: boolean;
  includePosyanduDetails: boolean;
  includeKaderData: boolean;
  includeCriticalChildren: boolean;
  includeRecommendations: boolean;
}

export const generateComprehensiveReport = async (
  options: ReportOptions = {
    includeCharts: true,
    includePosyanduDetails: true,
    includeKaderData: true,
    includeCriticalChildren: true,
    includeRecommendations: true,
  }
): Promise<Blob> => {
  try {
    console.log("📝 Starting PDF generation...");
    
    // Create PDF with A4 format
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPos = 20;

    // ============================================
    // COVER PAGE
    // ============================================
    console.log("📄 Creating cover page...");
    
    // Header bar
    doc.setFillColor(87, 80, 241);
    doc.rect(0, 0, pageWidth, 50, "F");
    
    // Title - White text on purple background
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LAPORAN KOMPREHENSIF", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("DASHBOARD POSYANDU", pageWidth / 2, 30, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Kecamatan Puspadaya - Kabupaten Garut", pageWidth / 2, 40, { align: "center" });
    
    // Subtitle
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Analisis Kinerja Posyandu & Kesehatan Masyarakat", pageWidth / 2, 65, { align: "center" });
    
    // Period box
    doc.setDrawColor(87, 80, 241);
    doc.setLineWidth(1);
    doc.rect(55, 75, 100, 12, "S");
    doc.setTextColor(87, 80, 241);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      `Periode: ${new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`,
      pageWidth / 2,
      83,
      { align: "center" }
    );
    
    // Generated date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Dicetak: ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
      pageWidth / 2,
      100,
      { align: "center" }
    );
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Dokumen Resmi - Dashboard Posyandu Kecamatan Puspadaya", pageWidth / 2, 280, { align: "center" });
    
    // Add new page
    doc.addPage();
    yPos = 25;

    // ============================================
    // DAFTAR ISI
    // ============================================
    console.log("📑 Creating table of contents...");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(87, 80, 241);
    doc.text("DAFTAR ISI", margin, yPos);
    yPos += 8;
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    const tableOfContents = [
      { section: "1. Ringkasan Eksekutif", page: "2" },
      { section: "2. Statistik Utama", page: "2" },
      { section: "3. Data Per Posyandu", page: "3" },
      { section: "4. Analisis Kinerja", page: "4" },
      { section: "5. Tren Bulanan", page: "5" },
      { section: "6. Beban Kerja Kader", page: "6" },
      { section: "7. Peringkat Integritas Kader", page: "7" },
      { section: "8. Anak Gizi Buruk & Stunting", page: "8" },
      { section: "9. Rekomendasi Program", page: "9" },
      { section: "10. Timeline Aksi", page: "10" },
    ];
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    tableOfContents.forEach((item) => {
      doc.text(item.section, margin, yPos);
      doc.text(`halaman ${item.page}`, pageWidth - margin - 20, yPos, { align: "right" });
      yPos += 7;
    });
    
    doc.addPage();
    yPos = 25;

    // ============================================
    // 1. RINGKASAN EKSEKUTIF
    // ============================================
    console.log("📝 Adding executive summary...");
    
    // Section header
    doc.setFillColor(87, 80, 241);
    doc.rect(margin, yPos - 5, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("1. RINGKASAN EKSEKUTIF", margin + 5, yPos + 3);
    yPos += 12;
    
    // Content
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const summaryText = `Laporan komprehensif ini menyajikan analisis mendalam terhadap kinerja ${dashboardSummaryData.total_posyandu} posyandu di wilayah Kecamatan Puspadaya.

CAPAIAN UTAMA:
• Total ${dashboardSummaryData.total_balita} balita dan ${dashboardSummaryData.total_ibu_hamil} ibu hamil terdaftar
• Rata-rata kehadiran ${dashboardSummaryData.rata_rata_kehadiran}% dari total sasaran
• ${dashboardSummaryData.posyandu_aktif} dari ${dashboardSummaryData.total_posyandu} posyandu aktif berkinerja baik

TANTANGAN:
• Masih terdapat ${dashboardSummaryData.kasus_stunting} kasus stunting yang memerlukan intervensi
• ${dashboardSummaryData.kasus_gizi_buruk} kasus gizi buruk memerlukan penanganan segera`;
    
    const lines = doc.splitTextToSize(summaryText, contentWidth - 5);
    doc.text(lines, margin + 5, yPos);
    yPos += lines.length * 5 + 10;

    // ============================================
    // 2. STATISTIK UTAMA
    // ============================================
    console.log("📊 Adding statistics...");
    
    doc.setFillColor(87, 80, 241);
    doc.rect(margin, yPos - 5, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("2. STATISTIK UTAMA", margin + 5, yPos + 3);
    yPos += 12;
    
    const statsData = [
      ["Total Posyandu", dashboardSummaryData.total_posyandu.toString(), "Unit"],
      ["Total Balita", dashboardSummaryData.total_balita.toString(), "Anak"],
      ["Total Ibu Hamil", dashboardSummaryData.total_ibu_hamil.toString(), "Ibu"],
      ["Total Kader", dashboardSummaryData.total_kader.toString(), "Orang"],
      ["Rata-rata Kehadiran", `${dashboardSummaryData.rata_rata_kehadiran}%`, "Persen"],
      ["Kasus Stunting", dashboardSummaryData.kasus_stunting.toString(), "Kasus"],
      ["Kasus Gizi Buruk", dashboardSummaryData.kasus_gizi_buruk.toString(), "Kasus"],
      ["Posyandu Aktif", `${dashboardSummaryData.posyandu_aktif}/${dashboardSummaryData.total_posyandu}`, "Unit"],
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [["Indikator", "Nilai", "Satuan"]],
      body: statsData,
      theme: "striped",
      headStyles: { fillColor: [87, 80, 241], fontSize: 10, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 90, fontStyle: "bold", fontSize: 9 },
        1: { cellWidth: 50, halign: "center", fontSize: 9 },
        2: { cellWidth: 40, halign: "center", fontSize: 9 },
      },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 2 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // ============================================
    // 3. DATA PER POSYANDU
    // ============================================
    if (options.includePosyanduDetails) {
      console.log("📍 Adding posyandu data...");
      
      doc.setFillColor(87, 80, 241);
      doc.rect(margin, yPos - 5, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("3. DATA PER POSYANDU", margin + 5, yPos + 3);
      yPos += 12;
      
      const posyanduTableData = posyanduListData.map((p) => [
        p.nama_posyandu,
        p.nama_dusun,
        p.total_balita.toString(),
        p.total_ibu_hamil.toString(),
        p.total_kader.toString(),
        `${p.persentase_kehadiran}%`,
        p.status_stunting.toString(),
        p.status_gizi_buruk.toString(),
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [["Posyandu", "Dusun", "Balita", "Ibu Hamil", "Kader", "Kehadiran", "Stunting", "Gizi Buruk"]],
        body: posyanduTableData,
        theme: "striped",
        headStyles: { fillColor: [34, 173, 92], fontSize: 9, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 30, fontStyle: "bold", fontSize: 8 },
          1: { cellWidth: 28, fontSize: 8 },
          2: { cellWidth: 14, halign: "center", fontSize: 8 },
          3: { cellWidth: 16, halign: "center", fontSize: 8 },
          4: { cellWidth: 14, halign: "center", fontSize: 8 },
          5: { cellWidth: 17, halign: "center", fontSize: 8 },
          6: { cellWidth: 17, halign: "center", fontSize: 8 },
          7: { cellWidth: 18, halign: "center", fontSize: 8 },
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 1.5 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // ============================================
    // 4. ANALISIS KINERJA
    // ============================================
    console.log("📈 Adding performance analysis...");
    
    doc.setFillColor(87, 80, 241);
    doc.rect(margin, yPos - 5, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("4. ANALISIS KINERJA", margin + 5, yPos + 3);
    yPos += 12;
    
    const rankedPosyandu = [...posyanduPerformanceData].sort((a, b) => b.skor_kinerja - a.skor_kinerja);
    const performanceTableData = rankedPosyandu.map((p, index) => [
      `#${index + 1}`,
      p.nama_posyandu,
      p.skor_kinerja.toString(),
      p.kategori,
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [["Rank", "Posyandu", "Skor", "Kategori"]],
      body: performanceTableData,
      theme: "striped",
      headStyles: { fillColor: [60, 80, 224], fontSize: 9, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 15, halign: "center", fontStyle: "bold", fontSize: 9 },
        1: { cellWidth: 60, fontStyle: "bold", fontSize: 8 },
        2: { cellWidth: 20, halign: "center", fontStyle: "bold", fontSize: 9 },
        3: { cellWidth: 55, halign: "center", fontSize: 8 },
      },
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 1.5 },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 0) {
          if (data.cell.raw === "#1") {
            data.cell.styles.fillColor = [255, 215, 0];
            data.cell.styles.textColor = [255, 255, 255];
          } else if (data.cell.raw === "#2") {
            data.cell.styles.fillColor = [192, 192, 192];
            data.cell.styles.textColor = [255, 255, 255];
          } else if (data.cell.raw === "#3") {
            data.cell.styles.fillColor = [205, 127, 50];
            data.cell.styles.textColor = [255, 255, 255];
          }
        }
      },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // ============================================
    // 5. TREN BULANAN
    // ============================================
    if (options.includeCharts) {
      console.log("📊 adding monthly trends...");
      
      doc.setFillColor(87, 80, 241);
      doc.rect(margin, yPos - 5, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("5. TREN BULANAN", margin + 5, yPos + 3);
      yPos += 12;
      
      const trendTableData = monthlyTrendData.map((m) => [
        m.bulan,
        m.balita.toString(),
        m.ibu_hamil.toString(),
        m.kader.toString(),
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [["Bulan", "Balita", "Ibu Hamil", "Kader"]],
        body: trendTableData,
        theme: "striped",
        headStyles: { fillColor: [242, 48, 48], fontSize: 9, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: "bold", fontSize: 9 },
          1: { cellWidth: 40, halign: "center", fontSize: 9 },
          2: { cellWidth: 45, halign: "center", fontSize: 9 },
          3: { cellWidth: 40, halign: "center", fontSize: 9 },
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 2 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // ============================================
    // 6. BEBAN KERJA KADER
    // ============================================
    if (options.includeKaderData) {
      console.log("👥 adding kader workload...");
      
      doc.setFillColor(87, 80, 241);
      doc.rect(margin, yPos - 5, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("6. BEBAN KERJA KADER", margin + 5, yPos + 3);
      yPos += 12;
      
      const workloadSummary = {
        total: kaderWorkloadData.length,
        tinggi: kaderWorkloadData.filter((k) => k.kategori_beban === "Tinggi").length,
        sedang: kaderWorkloadData.filter((k) => k.kategori_beban === "Sedang").length,
        rendah: kaderWorkloadData.filter((k) => k.kategori_beban === "Rendah").length,
      };
      
      const workloadData = [
        ["Total Kader", workloadSummary.total.toString()],
        ["Beban Tinggi", `${workloadSummary.tinggi} kader`],
        ["Beban Sedang", `${workloadSummary.sedang} kader`],
        ["Beban Rendah", `${workloadSummary.rendah} kader`],
      ];
      
      autoTable(doc, {
        startY: yPos,
        body: workloadData,
        theme: "striped",
        headStyles: { fillColor: [139, 92, 246], fontSize: 10, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: "bold", fontSize: 9 },
          1: { cellWidth: 110, fontSize: 9 },
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 2 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
      
      // Top 5 kader
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(242, 48, 48);
      doc.text("KADER DENGAN BEBAN TERTINGGI:", margin + 5, yPos);
      yPos += 8;
      
      const topKader = [...kaderWorkloadData].sort((a, b) => b.skor_beban_kerja - a.skor_beban_kerja).slice(0, 5);
      const topKaderData = topKader.map((k, index) => [
        `${index + 1}`,
        k.nama_kader,
        k.posyandu_nama,
        k.skor_beban_kerja.toString(),
        k.kategori_beban,
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [["#", "Kader", "Posyandu", "Skor", "Kategori"]],
        body: topKaderData,
        theme: "striped",
        headStyles: { fillColor: [242, 48, 48], fontSize: 9, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 10, halign: "center", fontSize: 8 },
          1: { cellWidth: 35, fontStyle: "bold", fontSize: 8 },
          2: { cellWidth: 35, fontSize: 8 },
          3: { cellWidth: 15, halign: "center", fontStyle: "bold", fontSize: 8 },
          4: { cellWidth: 35, halign: "center", fontSize: 8 },
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 1.5 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // ============================================
    // 7. PERINGKAT INTEGRITAS KADER
    // ============================================
    if (options.includeKaderData) {
      console.log("🏆 adding integrity ranking...");
      
      doc.setFillColor(87, 80, 241);
      doc.rect(margin, yPos - 5, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("7. PERINGKAT INTEGRITAS KADER", margin + 5, yPos + 3);
      yPos += 12;
      
      const kaderWithIntegrity = kaderWorkloadData.map((k) => {
        const attendanceScore = Math.min(100, (k.total_balita_dibina + k.total_ibu_hamil_dibina) / 2);
        const workloadBalance = k.skor_beban_kerja >= 60 && k.skor_beban_kerja <= 85 ? 100 : 70;
        const consistencyScore = k.status === "aktif" ? 100 : 50;
        const integrityScore = Math.round((attendanceScore * 0.4) + (workloadBalance * 0.3) + (consistencyScore * 0.3));
        
        return {
          ...k,
          integrity_score: integrityScore,
          integrity_category: integrityScore >= 85 ? "Sangat Tinggi" : integrityScore >= 70 ? "Tinggi" : "Cukup",
        };
      });
      
      const rankedKader = kaderWithIntegrity.sort((a, b) => b.integrity_score - a.integrity_score);
      const integrityTableData = rankedKader.map((k, index) => [
        `${index + 1}`,
        k.nama_kader,
        k.posyandu_nama,
        k.integrity_score.toString(),
        k.integrity_category,
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [["Rank", "Kader", "Posyandu", "Skor", "Kategori"]],
        body: integrityTableData,
        theme: "striped",
        headStyles: { fillColor: [139, 92, 246], fontSize: 9, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 12, halign: "center", fontSize: 8 },
          1: { cellWidth: 35, fontStyle: "bold", fontSize: 8 },
          2: { cellWidth: 35, fontSize: 8 },
          3: { cellWidth: 15, halign: "center", fontStyle: "bold", fontSize: 8 },
          4: { cellWidth: 33, halign: "center", fontSize: 8 },
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 1.5 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // ============================================
    // 8. ANAK GIZI BURUK & STUNTING
    // ============================================
    if (options.includeCriticalChildren) {
      console.log("⚠️ adding critical children...");
      
      doc.setFillColor(87, 80, 241);
      doc.rect(margin, yPos - 5, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("8. ANAK GIZI BURUK & STUNTING", margin + 5, yPos + 3);
      yPos += 12;
      
      const sortedCritical = [...criticalChildrenData].sort((a, b) => {
        const priorityOrder = { "Sangat Tinggi": 0, "Tinggi": 1, "Sedang": 2 };
        return priorityOrder[a.prioritas] - priorityOrder[b.prioritas];
      });
      
      const criticalTableData = sortedCritical.map((c) => [
        c.nama_anak,
        c.usia_bulan.toString(),
        c.posyandu_nama,
        `${c.berat_badan} kg`,
        `${c.tinggi_badan} cm`,
        c.status_gizi,
        c.prioritas,
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [["Nama", "Usia", "Posyandu", "BB", "TB", "Status", "Prioritas"]],
        body: criticalTableData,
        theme: "striped",
        headStyles: { fillColor: [242, 48, 48], fontSize: 9, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 30, fontStyle: "bold", fontSize: 8 },
          1: { cellWidth: 15, halign: "center", fontSize: 8 },
          2: { cellWidth: 28, fontSize: 8 },
          3: { cellWidth: 18, halign: "center", fontSize: 8 },
          4: { cellWidth: 18, halign: "center", fontSize: 8 },
          5: { cellWidth: 22, halign: "center", fontSize: 8 },
          6: { cellWidth: 22, halign: "center", fontSize: 8 },
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 1.5 },
        pageBreak: "auto",
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // ============================================
    // 9. REKOMENDASI PROGRAM
    // ============================================
    if (options.includeRecommendations) {
      console.log("💡 adding recommendations...");
      
      doc.setFillColor(87, 80, 241);
      doc.rect(margin, yPos - 5, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("9. REKOMENDASI PROGRAM", margin + 5, yPos + 3);
      yPos += 12;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(242, 48, 48);
      doc.text("A. INTERVENSI GIZI (PRIORITAS)", margin + 5, yPos);
      yPos += 7;
      
      const interventions = `• Makanan tambahan untuk ${criticalChildrenData.filter((c) => c.status_gizi === "Gizi Buruk").length} anak gizi buruk
• Kunjungan rumah intensif untuk anak prioritas tinggi
• Rujukan ke puskesmas untuk kasus komplikasi`;
      
      const interventionLines = doc.splitTextToSize(interventions, contentWidth - 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(interventionLines, margin + 5, yPos + 5);
      yPos += interventionLines.length * 5 + 10;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(60, 80, 224);
      doc.text("B. PEMBINAAN POSYANDU", margin + 5, yPos);
      yPos += 7;
      
      const pembinaan = `• Pembinaan khusus untuk posyandu kinerja rendah
• Pelatihan kader bulanan
• Monitoring ketat dengan weekly report`;
      
      const pembinaanLines = doc.splitTextToSize(pembinaan, contentWidth - 5);
      doc.setFont("helvetica", "normal");
      doc.text(pembinaanLines, margin + 5, yPos + 5);
      yPos += pembinaanLines.length * 5 + 10;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(139, 92, 246);
      doc.text("C. OPTIMALISASI KADER", margin + 5, yPos);
      yPos += 7;
      
      const optimalisasi = `• Redistribusi beban kerja
• Rekrutmen kader baru
• Pencegahan burnout dengan rotasi tugas`;
      
      const optimalisasiLines = doc.splitTextToSize(optimalisasi, contentWidth - 5);
      doc.setFont("helvetica", "normal");
      doc.text(optimalisasiLines, margin + 5, yPos + 5);
      yPos += optimalisasiLines.length * 5 + 15;
    }

    // ============================================
    // 10. TIMELINE AKSI
    // ============================================
    if (options.includeRecommendations) {
      console.log("📅 adding timeline...");
      
      doc.setFillColor(87, 80, 241);
      doc.rect(margin, yPos - 5, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("10. TIMELINE AKSI", margin + 5, yPos + 3);
      yPos += 12;
      
      const timelineData = [
        ["Minggu 1", "Kunjungan rumah ke anak prioritas tinggi\nRujukan ke puskesmas", "Kader & Puskesmas"],
        ["Minggu 2-4", "Pelatihan kader\nRekrutmen kader baru", "Koordinator Kader"],
        ["Bulan 2-3", "Monitoring intensif\nEvaluasi program", "Kepala Desa & Tim"],
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [["Timeline", "Aksi", "PIC"]],
        body: timelineData,
        theme: "striped",
        headStyles: { fillColor: [34, 173, 92], fontSize: 9, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 35, fontStyle: "bold", fontSize: 9 },
          1: { cellWidth: 100, fontSize: 8 },
          2: { cellWidth: 45, fontSize: 9 },
        },
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 2 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 20;
    }

    // ============================================
    // CLOSING PAGE
    // ============================================
    console.log("📝 adding closing page...");
    
    doc.addPage();
    
    // Closing box
    doc.setFillColor(87, 80, 241);
    doc.rect(margin, 50, contentWidth, 70, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("LAPORAN INI DIBUAT SECARA OTOMATIS", pageWidth / 2, 70, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("oleh Dashboard Posyandu Kecamatan Puspadaya", pageWidth / 2, 80, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(
      `Dicetak pada: ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
      pageWidth / 2,
      95,
      { align: "center" }
    );
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("📞 KONTAK DARURAT:", pageWidth / 2, 105, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.text("Puskesmas: 0262-XXXXXX | Kepala Desa: 0812-XXXX-XXXX", pageWidth / 2, 112, { align: "center" });
    
    // ============================================
    // FOOTERS
    // ============================================
    console.log("📝 adding footers...");
    
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text(`Halaman ${i} dari ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.text("Dashboard Posyandu - Kecamatan Puspadaya", margin, pageHeight - 10);
      doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - margin, pageHeight - 10, { align: "right" });
    }
    
    console.log("✅ PDF generation complete!");
    
    const pdfBlob = doc.output("blob");
    console.log("📦 PDF Blob created:", pdfBlob.size, "bytes");
    
    return pdfBlob;
    
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    throw new Error("Gagal membuat laporan PDF: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};
