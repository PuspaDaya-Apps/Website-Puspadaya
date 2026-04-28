"use client";
import React, { useState } from "react";
import { PosyanduItem, DashboardSummary, RecentActivity } from "@/types/dashboard-kepala-desa";

interface ExpandableDataSectionProps {
  posyanduList: PosyanduItem[];
  summary: DashboardSummary;
  activities: RecentActivity[];
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
  posyanduList,
  summary,
  activities,
}) => {
  const [activeTab, setActiveTab] = useState<"imunisasi" | "kependudukan">("imunisasi");

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
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Data Lengkap
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Informasi detail untuk analisis mendalam
          </p>
        </div>
      </div>

      {/* Stunting & Gizi Buruk per Posyandu */}
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
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {summary.infant_immunization_coverage.cakupan_persentase}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Cakupan Total</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summary.infant_immunization_coverage.total_imunisasi}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Imunisasi</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {summary.infant_immunization_coverage.bcg}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">BCG</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {summary.infant_immunization_coverage.dpt_3}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">DPT 3</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {summary.infant_immunization_coverage.campak}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Campak</p>
              </div>
            </div>

            {/* Detailed immunization cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: "BCG", value: summary.infant_immunization_coverage.bcg, color: "blue" },
                { label: "DPT 1", value: summary.infant_immunization_coverage.dpt_1, color: "green" },
                { label: "DPT 2", value: summary.infant_immunization_coverage.dpt_2, color: "green" },
                { label: "DPT 3", value: summary.infant_immunization_coverage.dpt_3, color: "green" },
                { label: "Polio 1", value: summary.infant_immunization_coverage.polio_1, color: "purple" },
                { label: "Polio 2", value: summary.infant_immunization_coverage.polio_2, color: "purple" },
                { label: "Polio 3", value: summary.infant_immunization_coverage.polio_3, color: "purple" },
                { label: "Polio 4", value: summary.infant_immunization_coverage.polio_4, color: "purple" },
                { label: "Hepatitis", value: summary.infant_immunization_coverage.hepatitis, color: "orange" },
                { label: "Campak", value: summary.infant_immunization_coverage.campak, color: "red" },
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
              { label: "Baduta 0-23 Bulan", value: summary.baduta_0_23_months, icon: "👶", color: "emerald" },
              { label: "Balita 24-59 Bulan", value: summary.balita_24_59_months, icon: "🧒", color: "blue" },
              { label: "Pra Sekolah 60-72 Bulan", value: summary.pra_sekolah_60_72_months, icon: "👦", color: "violet" },
              { label: "Wanita Pasca Subur", value: summary.women_post_fertile, icon: "👩", color: "purple" },
              { label: "Ibu Hamil KEK", value: summary.pregnant_women_under_energized, icon: "🤰", color: "pink" },
              { label: "Ibu Hamil Risiko Tinggi", value: summary.high_risk_pregnant_women, icon: "🔴", color: "red" },
              { label: "Ibu Menyusui", value: summary.breastfeeding_mothers, icon: "💝", color: "amber" },
              { label: "Bayi Baru Lahir", value: summary.newborn_count, icon: "🍼", color: "teal" },
              { label: "Ibu Hamil dengan Asuransi", value: summary.pregnant_women_with_insurance, icon: "🛡️", color: "cyan" },
              { label: "Bayi 0-12 Bulan dengan Asuransi", value: summary.infant_with_insurance, icon: "👶", color: "cyan" },
              { label: "Balita 0-59 Bulan dengan Asuransi", value: summary.children_under_5_with_insurance, icon: "🧒", color: "cyan" },
              { label: "Akseptor KB", value: summary.kb_acceptors, icon: "💊", color: "indigo" },
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
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Posyandu</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aktivitas</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Kader</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {activities.slice(0, 10).map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(activity.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-dark dark:text-white">
                    {activity.posyandu_nama}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      activity.activity_type === "pengukuran_balita"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : activity.activity_type === "pengukuran_ibu_hamil"
                        ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                        : activity.activity_type === "kuesioner"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                      {activity.activity_type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {activity.kader_nama}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ExpandableSection>
      </div>
    </div>
  );
};

export default ExpandableDataSection;
