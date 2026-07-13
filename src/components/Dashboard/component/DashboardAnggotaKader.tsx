import React, { useState } from "react";
import DurationDistanceChart from "../dashboard/DurationDistanceChart";
import RaportBalita from "../dashboard/ChartRaporBaby";
import { downloadKaderPDF } from "@/utils/generateKaderPDF";

const DashboardAnggotaKader: React.FC = () => {
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setLoadingPDF(true);
    try {
      await downloadKaderPDF();
    } catch (err) {
      console.error("Gagal download PDF:", err);
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-dark">
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
            Cetak Laporan Kader
          </span>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={loadingPDF}
          className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {loadingPDF ? (
            <>
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memproses...
            </>
          ) : (
            "Download"
          )}
        </button>
      </div>

      <div className="mb-4">
        <DurationDistanceChart />
      </div>
      <RaportBalita />
    </div>
  );
};

export default DashboardAnggotaKader;