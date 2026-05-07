"use client";
import React, { useEffect, useMemo, useState } from "react";
import { fetchImunisasiKependudukan } from "@/app/api/dashboard-kepala-desa";
import { ImunisasiKependudukanData } from "@/types/kepala-desa";
import { PosyanduItem, DashboardSummary } from "@/types/dashboard-kepala-desa";
import RecentActivityTable from "./RecentActivityTable";

interface ExpandableDataSectionProps {
  summary: DashboardSummary;
  bulan: number;
  tahun: number;
  bulanLabel?: string;
  refreshSignal?: number;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ExpandableSection: React.FC<SectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl bg-white shadow-md dark:bg-gray-dark">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-dark dark:text-white">{title}</h3>
        </div>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">{children}</div>}
    </div>
  );
};

const ExpandableDataSection: React.FC<ExpandableDataSectionProps> = ({
  summary,
  bulan,
  tahun,
  bulanLabel,
  refreshSignal,
}) => {
  const [activeTab, setActiveTab] = useState<"imunisasi" | "kependudukan">("imunisasi");
  const [apiData, setApiData] = useState<ImunisasiKependudukanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const hasExistingData = apiData !== null;

      if (!hasExistingData) {
        setIsLoading(true);
        setErrorMessage(null);
      }

      const result = await fetchImunisasiKependudukan({ bulan, tahun });

      if (!isMounted) {
        return;
      }

      const hasImunisasiError = !(result.successCode === 200 && result.data);

      if (!hasImunisasiError && result.data) {
        setApiData(result.data);
      }

      if (hasImunisasiError && !hasExistingData) {
        setErrorMessage("Gagal memuat data imunisasi dan kependudukan");
      } else if (!hasImunisasiError) {
        setErrorMessage(null);
      }

      if (!hasExistingData) {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [bulan, tahun, refreshSignal]);

  const displayData = useMemo(
    () => ({
      cakupan_persen: apiData?.imunisasi.cakupan_persen ?? 0,
      total_imunisasi: apiData?.imunisasi.total_imunisasi ?? 0,
      imunisasi: {
        bcg: apiData?.imunisasi.detail.bcg ?? 0,
        dpt_1: apiData?.imunisasi.detail.dpt_1 ?? 0,
        dpt_2: apiData?.imunisasi.detail.dpt_2 ?? 0,
        dpt_3: apiData?.imunisasi.detail.dpt_3 ?? 0,
        polio_1: apiData?.imunisasi.detail.polio_1 ?? 0,
        polio_2: apiData?.imunisasi.detail.polio_2 ?? 0,
        polio_3: apiData?.imunisasi.detail.polio_3 ?? 0,
        polio_4: apiData?.imunisasi.detail.polio_4 ?? 0,
        hepatitis: apiData?.imunisasi.detail.hepatitis ?? 0,
        campak: apiData?.imunisasi.detail.campak ?? 0,
      },
      kependudukan: {
        baduta_0_23_months: apiData?.kependudukan.anak.baduta_0_23_bulan ?? 0,
        balita_24_59_months: apiData?.kependudukan.anak.balita_24_59_bulan ?? 0,
        pra_sekolah_60_72_months: apiData?.kependudukan.anak.pra_sekolah_60_72_bulan ?? 0,
        women_post_fertile: apiData?.kependudukan.ibu.wanita_pasca_subur ?? 0,
        pregnant_women_under_energized: apiData?.kependudukan.ibu.ibu_hamil_kek ?? 0,
        high_risk_pregnant_women: apiData?.kependudukan.ibu.ibu_hamil_risiko_tinggi ?? 0,
        breastfeeding_mothers: apiData?.kependudukan.ibu.ibu_menyusui ?? 0,
        newborn_count: apiData?.kependudukan.bayi.bayi_baru_lahir ?? 0,
        pregnant_women_with_insurance: apiData?.kependudukan.ibu.ibu_hamil_asuransi ?? 0,
        infant_with_insurance: apiData?.kependudukan.bayi.bayi_0_12_bulan_asuransi ?? 0,
        children_under_5_with_insurance:
          apiData?.kependudukan.balita_asuransi.balita_13_59_bulan_asuransi ??
          apiData?.kependudukan.balita_asuransi.balita_0_59_bulan_asuransi ??
          0,
        kb_acceptors: apiData?.kependudukan.kesehatan_reproduksi.akseptor_kb ?? 0,
      },
    }),
    [apiData]
  );

  const safePercent = (value: number, total: number) => {
    if (!total) return 0;
    return (value / total) * 100;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-dark">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white">Data Lengkap</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {bulanLabel ? `Periode ${bulanLabel} ${tahun}` : `Periode bulan ${bulan} ${tahun}`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="mb-6 rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Memuat data imunisasi dan kependudukan...
        </div>
      ) : errorMessage ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      {/* Data Imunisasi dan Kependudukan */}
      <div className="mb-6">
        <ExpandableSection
          title="Data Imunisasi dan Kependudukan"
          icon={
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          defaultOpen={false}
        >
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("imunisasi")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "imunisasi"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Imunisasi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("kependudukan")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "kependudukan"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Kependudukan
            </button>
          </div>

          {activeTab === "imunisasi" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {displayData.cakupan_persen}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Cakupan Total</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {displayData.total_imunisasi}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Imunisasi</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {displayData.imunisasi.bcg}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">BCG</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {displayData.imunisasi.dpt_3}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">DPT 3</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {displayData.imunisasi.campak}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Campak</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { label: "BCG", value: displayData.imunisasi.bcg, color: "blue" },
                  { label: "DPT 1", value: displayData.imunisasi.dpt_1, color: "green" },
                  { label: "DPT 2", value: displayData.imunisasi.dpt_2, color: "green" },
                  { label: "DPT 3", value: displayData.imunisasi.dpt_3, color: "green" },
                  { label: "Polio 1", value: displayData.imunisasi.polio_1, color: "purple" },
                  { label: "Polio 2", value: displayData.imunisasi.polio_2, color: "purple" },
                  { label: "Polio 3", value: displayData.imunisasi.polio_3, color: "purple" },
                  { label: "Polio 4", value: displayData.imunisasi.polio_4, color: "purple" },
                  { label: "Hepatitis", value: displayData.imunisasi.hepatitis, color: "orange" },
                  { label: "Campak", value: displayData.imunisasi.campak, color: "red" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 text-center ${
                      item.color === "blue"
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : item.color === "green"
                        ? "bg-green-50 dark:bg-green-900/20"
                        : item.color === "purple"
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : item.color === "orange"
                        ? "bg-orange-50 dark:bg-orange-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.label}</p>
                    <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "kependudukan" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Baduta 0-23 Bulan", value: displayData.kependudukan.baduta_0_23_months, icon: "👶", color: "emerald" },
                { label: "Balita 24-59 Bulan", value: displayData.kependudukan.balita_24_59_months, icon: "🧒", color: "blue" },
                { label: "Pra Sekolah 60-72 Bulan", value: displayData.kependudukan.pra_sekolah_60_72_months, icon: "🧑", color: "violet" },
                { label: "Wanita Pasca Subur", value: displayData.kependudukan.women_post_fertile, icon: "👩", color: "purple" },
                { label: "Ibu Hamil KEK", value: displayData.kependudukan.pregnant_women_under_energized, icon: "🤰", color: "pink" },
                { label: "Ibu Hamil Risiko Tinggi", value: displayData.kependudukan.high_risk_pregnant_women, icon: "🔴", color: "red" },
                { label: "Ibu Menyusui", value: displayData.kependudukan.breastfeeding_mothers, icon: "💝", color: "amber" },
                { label: "Bayi Baru Lahir", value: displayData.kependudukan.newborn_count, icon: "🍼", color: "teal" },
                { label: "Ibu Hamil dengan Asuransi", value: displayData.kependudukan.pregnant_women_with_insurance, icon: "🛡️", color: "cyan" },
                { label: "Bayi 0-12 Bulan dengan Asuransi", value: displayData.kependudukan.infant_with_insurance, icon: "👶", color: "cyan" },
                { label: "Balita 13-59 Bulan dengan Asuransi", value: displayData.kependudukan.children_under_5_with_insurance, icon: "🧒", color: "cyan" },
                { label: "Akseptor KB", value: displayData.kependudukan.kb_acceptors, icon: "💊", color: "indigo" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 rounded-lg p-4 ${
                    item.color === "blue"
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : item.color === "emerald"
                      ? "bg-emerald-50 dark:bg-emerald-900/20"
                      : item.color === "violet"
                      ? "bg-violet-50 dark:bg-violet-900/20"
                      : item.color === "purple"
                      ? "bg-purple-50 dark:bg-purple-900/20"
                      : item.color === "pink"
                      ? "bg-pink-50 dark:bg-pink-900/20"
                      : item.color === "red"
                      ? "bg-red-50 dark:bg-red-900/20"
                      : item.color === "amber"
                      ? "bg-amber-50 dark:bg-amber-900/20"
                      : item.color === "teal"
                      ? "bg-teal-50 dark:bg-teal-900/20"
                      : item.color === "cyan"
                      ? "bg-cyan-50 dark:bg-cyan-900/20"
                      : "bg-indigo-50 dark:bg-indigo-900/20"
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                    <p className="text-xl font-bold text-dark dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ExpandableSection>
      </div>

      {/* Aktivitas Terbaru */}
      <div className="mb-6">
        <ExpandableSection
          title="Aktivitas Terbaru"
          icon={
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          defaultOpen={false}
        >
          <RecentActivityTable bulan={bulan} tahun={tahun} bulanLabel={bulanLabel} refreshSignal={refreshSignal} />
        </ExpandableSection>
      </div>
    </div>
  );
};

export default ExpandableDataSection;
