"use client";
import React from "react";
import { DashboardSummary as DashboardSummaryType } from "@/types/dashboard-kepala-desa";

interface AdditionalMetricsProps {
  summary: DashboardSummaryType;
}

const AdditionalMetrics: React.FC<AdditionalMetricsProps> = ({ summary }) => {
  return (
    <div className="space-y-6">
      {/* Data Kependudukan */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Data Kependudukan
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Wanita Pasca Subur</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-300">{summary.women_post_fertile}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
                <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Akseptor KB</p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-300">{summary.kb_acceptors}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-cyan-50 p-4 dark:bg-cyan-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-800">
                <svg className="h-6 w-6 text-cyan-600 dark:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Hamil Asuransi</p>
                <p className="text-xl font-bold text-cyan-600 dark:text-cyan-300">{summary.pregnant_women_with_insurance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kunjungan Posyandu Berdasarkan Usia */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Kunjungan Posyandu Berdasarkan Usia
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bayi (0-12 Bulan)</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{summary.infant_0_12_months}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800">
                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-emerald-200 dark:bg-emerald-700">
              <div 
                className="h-2 rounded-full bg-emerald-500" 
                style={{ width: `${(summary.infant_0_12_months / summary.total_balita) * 100}%` }}
              />
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Balita (0-23 Bulan)</p>
                <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.children_0_23_months}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-blue-200 dark:bg-blue-700">
              <div 
                className="h-2 rounded-full bg-blue-500" 
                style={{ width: `${(summary.children_0_23_months / summary.total_balita) * 100}%` }}
              />
            </div>
          </div>
          <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Balita (0-59 Bulan)</p>
                <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">{summary.children_0_59_months}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-800">
                <svg className="h-6 w-6 text-violet-600 dark:text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-violet-200 dark:bg-violet-700">
              <div 
                className="h-2 rounded-full bg-violet-500" 
                style={{ width: `${(summary.children_0_59_months / summary.total_balita) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kesehatan Ibu & Bayi */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Kesehatan Ibu & Bayi
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-pink-50 p-4 dark:bg-pink-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-800">
                <svg className="h-6 w-6 text-pink-600 dark:text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Hamil KEK</p>
                <p className="text-xl font-bold text-pink-600 dark:text-pink-300">{summary.pregnant_women_under_energized}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
                <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Hamil Risiko Tinggi</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-300">{summary.high_risk_pregnant_women}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800">
                <svg className="h-6 w-6 text-amber-600 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ibu Menyusui</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-300">{summary.breastfeeding_mothers}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-800">
                <svg className="h-6 w-6 text-teal-600 dark:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Bayi Baru Lahir</p>
                <p className="text-xl font-bold text-teal-600 dark:text-teal-300">{summary.newborn_count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Imunisasi Bayi */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Cakupan Imunisasi Bayi
        </h2>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Imunisasi: <span className="font-semibold text-dark dark:text-white">{summary.infant_immunization_coverage.total_imunisasi}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cakupan: <span className="font-bold text-emerald-600 dark:text-emerald-400">{summary.infant_immunization_coverage.cakupan_persentase}%</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <ImunisasiCard label="BCG" value={summary.infant_immunization_coverage.bcg} color="blue" />
          <ImunisasiCard label="DPT 1" value={summary.infant_immunization_coverage.dpt_1} color="green" />
          <ImunisasiCard label="DPT 2" value={summary.infant_immunization_coverage.dpt_2} color="green" />
          <ImunisasiCard label="DPT 3" value={summary.infant_immunization_coverage.dpt_3} color="green" />
          <ImunisasiCard label="Polio 1" value={summary.infant_immunization_coverage.polio_1} color="purple" />
          <ImunisasiCard label="Polio 2" value={summary.infant_immunization_coverage.polio_2} color="purple" />
          <ImunisasiCard label="Polio 3" value={summary.infant_immunization_coverage.polio_3} color="purple" />
          <ImunisasiCard label="Polio 4" value={summary.infant_immunization_coverage.polio_4} color="purple" />
          <ImunisasiCard label="Hepatitis" value={summary.infant_immunization_coverage.hepatitis} color="orange" />
          <ImunisasiCard label="Campak" value={summary.infant_immunization_coverage.campak} color="red" />
        </div>
      </div>

      {/* Prevalensi Balita */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Prevalensi Balita
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <PrevalensiCard 
            title="Stunting" 
            jumlah={summary.stunting_prevalence.jumlah} 
            prevalensi={summary.stunting_prevalence.prevalensi_persentase}
            total={summary.stunting_prevalence.total_balita}
            color="red"
          />
          <PrevalensiCard 
            title="Wasting" 
            jumlah={summary.wasting_prevalence.jumlah} 
            prevalensi={summary.wasting_prevalence.prevalensi_persentase}
            total={summary.wasting_prevalence.total_balita}
            color="orange"
          />
          <PrevalensiCard 
            title="Underweight" 
            jumlah={summary.underweight_prevalence.jumlah} 
            prevalensi={summary.underweight_prevalence.prevalensi_persentase}
            total={summary.underweight_prevalence.total_balita}
            color="amber"
          />
        </div>
      </div>
    </div>
  );
};

interface ImunisasiCardProps {
  label: string;
  value: number;
  color: "blue" | "green" | "purple" | "orange" | "red";
}

const ImunisasiCard: React.FC<ImunisasiCardProps> = ({ label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div className={`rounded-lg p-3 text-center ${colorClasses[color]}`}>
      <p className="text-xs font-medium">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
};

interface PrevalensiCardProps {
  title: string;
  jumlah: number;
  prevalensi: number;
  total: number;
  color: "red" | "orange" | "amber";
}

const PrevalensiCard: React.FC<PrevalensiCardProps> = ({ title, jumlah, prevalensi, total, color }) => {
  const colorClasses = {
    red: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    orange: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800",
    amber: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
  };

  const textColors = {
    red: "text-red-600 dark:text-red-400",
    orange: "text-orange-600 dark:text-orange-400",
    amber: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${textColors[color]}`}>{title}</h3>
        <span className={`text-3xl font-bold ${textColors[color]}`}>{jumlah}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Prevalensi</span>
          <span className={`font-bold ${textColors[color]}`}>{prevalensi}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-3 rounded-full ${color === "red" ? "bg-red-500" : color === "orange" ? "bg-orange-500" : "bg-amber-500"}`} 
            style={{ width: `${prevalensi}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          dari {total} balita
        </p>
      </div>
    </div>
  );
};

export default AdditionalMetrics;
