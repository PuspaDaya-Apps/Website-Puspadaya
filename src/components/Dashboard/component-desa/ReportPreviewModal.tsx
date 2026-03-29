"use client";
import React, { useState } from "react";
import { generateComprehensiveReport } from "@/utils/generateReportPDF";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    includeCharts: true,
    includePosyanduDetails: true,
    includeKaderData: true,
    includeCriticalChildren: true,
    includeRecommendations: true,
  });

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      const pdfBlob = await generateComprehensiveReport(reportOptions);

      if (!pdfBlob) {
        throw new Error("PDF Blob is null");
      }

      // Get current date and desa name for filename
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Get desa name from current user
      const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
      const desaName = currentUser?.desa_kelurahan?.nama_desa_kelurahan
        ? currentUser.desa_kelurahan.nama_desa_kelurahan
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        : 'Desa';
      
      // Create filename: Laporan-Analitik-Posyandu-Desa-tanggal.pdf
      const filename = `Laporan-Analitik-Posyandu-${desaName}-${dateStr}.pdf`;
      
      // Create download link
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Also open in new tab for preview
      const previewUrl = URL.createObjectURL(pdfBlob);
      window.open(previewUrl, "_blank");

      // Show success message
      alert(`✅ Laporan berhasil dibuat!\n\nFile: ${filename}\n\nPDF sedang di-download dan dibuka di tab baru untuk preview.`);
      onClose();

      // Cleanup after delay
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
        URL.revokeObjectURL(previewUrl);
      }, 60000);
    } catch (error) {
      console.error("Error generating report:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("❌ Gagal membuat laporan.\n\nError: " + errorMessage + "\n\nSilakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-dark max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Buat Laporan Komprehensif
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Generate PDF report lengkap untuk semua posyandu
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Report Options */}
        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Konten Laporan
          </h3>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={reportOptions.includeCharts}
                onChange={(e) =>
                  setReportOptions({
                    ...reportOptions,
                    includeCharts: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-dark dark:text-white">
                  Ringkasan & Statistik Utama
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ringkasan eksekutif, 8 metrik utama, dan daftar isi
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={reportOptions.includePosyanduDetails}
                onChange={(e) =>
                  setReportOptions({
                    ...reportOptions,
                    includePosyanduDetails: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-dark dark:text-white">
                  Data Detail Per Posyandu
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tabel lengkap semua posyandu dengan statistik masing-masing
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={reportOptions.includeKaderData}
                onChange={(e) =>
                  setReportOptions({
                    ...reportOptions,
                    includeKaderData: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-dark dark:text-white">
                  👥 Analisis Beban Kerja Kader
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Distribusi beban kerja, kader dengan beban tertinggi
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={reportOptions.includeCriticalChildren}
                onChange={(e) =>
                  setReportOptions({
                    ...reportOptions,
                    includeCriticalChildren: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-dark dark:text-white">
                  Daftar Anak Gizi Buruk & Stunting
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Daftar lengkap anak dengan prioritas penanganan
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={reportOptions.includeRecommendations}
                onChange={(e) =>
                  setReportOptions({
                    ...reportOptions,
                    includeRecommendations: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-dark dark:text-white">
                  Rekomendasi Program & Tindak Lanjut
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rekomendasi detail dengan timeline dan action plan
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Report Info */}
        <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
            Informasi Laporan
          </h4>
          <div className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <p>✅ Format: PDF (Portable Document Format)</p>
            <p>✅ Ukuran: Sekitar 10-12 halaman</p>
            <p>✅ Bahasa: Indonesia</p>
            <p>✅ Include: Cover, Daftar Isi, Footer</p>
            <p>✅ Periode: {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h4 className="mb-2 font-semibold text-dark dark:text-white">
            Yang Termasuk dalam Laporan:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Cover profesional
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Daftar isi
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Ringkasan eksekutif
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              8 statistik utama
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Data detail per posyandu
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Analisis kinerja
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Tren bulanan (6 bulan)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Beban kerja kader
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Daftar anak gizi buruk
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Rekomendasi program
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Timeline aksi
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Footer & page number
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Batal
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <div>
                  <div>Membuat Laporan...</div>
                  <div className="text-xs font-normal">Mohon tunggu beberapa detik</div>
                </div>
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <div>Generate PDF Report</div>
                  <div className="text-xs font-normal">Preview di tab baru</div>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Laporan ini dibuat otomatis berdasarkan data real-time dari dashboard
        </p>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
