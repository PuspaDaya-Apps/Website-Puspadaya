// /components/KaderStats/KaderStats.tsx
import React from "react";

interface StatistikProps {
    kader: {
        laporan: {
            jumlah_balita_hadir_per_kompetensi: { total_hadir_balita: number };
            jumlah_ibu_hamil_hadir_per_kompetensi: { total_ibu_hamil: number };
            skor_beban_kerja: number;
        };
    };
}

const KaderStats: React.FC<StatistikProps> = ({ kader }) => {
    const { laporan } = kader;
    const skor = laporan.skor_beban_kerja;

    const getBebanKerjaLabel = (score: number) => {
        if (score >= 80) return "Beban kerja tinggi";
        if (score >= 60) return "Beban kerja sedang";
        return "Beban kerja rendah";
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Kartu Statistik Kehadiran */}
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                    Statistik Kehadiran
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-indigo-50 p-4 text-center dark:bg-indigo-900/20">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                            {laporan.jumlah_balita_hadir_per_kompetensi.total_hadir_balita}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Balita</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                            {laporan.jumlah_ibu_hamil_hadir_per_kompetensi.total_ibu_hamil}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Ibu Hamil</p>
                    </div>
                </div>
            </div>

            {/* Kartu Skor Beban Kerja */}
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                    Skor Beban Kerja
                </h2>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-dark dark:text-white">
                        {skor}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/ 100</span>
                </div>
                <div className="mt-4 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        style={{ width: `${skor}%` }}
                    ></div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {getBebanKerjaLabel(skor)}
                </p>
            </div>
        </div>
    );
};

export default KaderStats;
