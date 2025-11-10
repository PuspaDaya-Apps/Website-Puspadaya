'use client';
import React, { useEffect, useState } from 'react';
import { KaderStatisticsData } from '@/types/data-25/statistikbebankerja';
import { Statistikbebankerja } from '@/app/api/dashboatrd-new/statistikbebankerja';

const KaderStats: React.FC = () => {
    const [data, setData] = useState<KaderStatisticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const getBebanKerjaLabel = (score: number) => {
        if (score >= 80) return 'Beban kerja tinggi';
        if (score >= 60) return 'Beban kerja sedang';
        return 'Beban kerja rendah';
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await Statistikbebankerja(); // useCache is true by default
            if (result.data) {
                setData(result.data);
            } else {
                // Jika data null, tetapkan default 0
                setData({
                    total_anak_diukur_bulan_ini: 0,
                    total_ibu_hamil_diukur_bulan_ini: 0,
                    skor_beban_kerja_bulan_ini: 0,
                });
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-gray-500">Memuat data...</p>;

    // Pastikan semua data aman (null === 0)
    const totalBalita = data?.total_anak_diukur_bulan_ini ?? 0;
    const totalIbuHamil = data?.total_ibu_hamil_diukur_bulan_ini ?? 0;
    const skor = data?.skor_beban_kerja_bulan_ini ?? 0;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Statistik Kehadiran */}
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">Statistik Kehadiran</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-indigo-50 p-4 text-center dark:bg-indigo-900/20">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                            {totalBalita}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Balita</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                            {totalIbuHamil}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Ibu Hamil</p>
                    </div>
                </div>
            </div>

            {/* Skor Beban Kerja */}
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">Skor Beban Kerja</h2>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-dark dark:text-white">{skor}</span>
                    <span className="text-gray-500 dark:text-gray-400">/ ♾️</span>
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
