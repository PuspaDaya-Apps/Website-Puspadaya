// /components/DurasiJarak/DurasiJarak.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Cell,
    LabelList,
} from "recharts";
import { StatistikJarakTempuh } from "@/app/api/dashboatrd-new/statistikjaraktempuh";
import { BebanKerjaData } from "@/types/data-25/statistikbebankerja";


const DurasiJarak: React.FC = () => {
    const [data, setData] = useState<BebanKerjaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await StatistikJarakTempuh();
                if (response.successCode === 200 && response.data) {
                    setData(response.data);
                } else {
                    // Jika API gagal, tetapkan data default daripada menampilkan error
                    setData({
                        durasi_kerja_posyandu: 0,
                        durasi_kunjungan_rumah: 0,
                        jarak_total_kunjungan_rumah: 0
                    });
                }
            } catch (error) {
                // Tangani error tanpa menampilkan di console
                setData({
                    durasi_kerja_posyandu: 0,
                    durasi_kunjungan_rumah: 0,
                    jarak_total_kunjungan_rumah: 0
                });
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-6 text-center shadow-md dark:bg-gray-dark">
                <p className="text-gray-600 dark:text-gray-300">
                    Memuat data durasi dan jarak tempuh...
                </p>
            </div>
        );
    }

    // 🧮 Handle null → 0
    const durasiPosyandu = data?.durasi_kerja_posyandu ?? 0;
    const durasiKunjungan = data?.durasi_kunjungan_rumah ?? 0;
    const jarakKunjungan = data?.jarak_total_kunjungan_rumah ?? 0;

    // 🎨 Data untuk Chart
    const chartData = [
        { name: "Kerja Posyandu", value: durasiPosyandu, unit: "", color: "#3b82f6" },
        { name: "Kunjungan Rumah", value: durasiKunjungan, unit: "", color: "#8b5cf6" },
        { name: "Jarak Tempuh", value: jarakKunjungan, unit: "", color: "#ec4899" },
    ];

    return (
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
            <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                Durasi Kerja dan Jarak Tempuh
            </h2>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Info Summary */}
                <div className="space-y-4 lg:col-span-1">
                    <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
                        <h3 className="font-medium text-indigo-700 dark:text-indigo-300">
                            Durasi Kerja di Posyandu
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                            {durasiPosyandu} jam
                        </p>
                        <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                            Waktu yang dihabiskan untuk kegiatan di posyandu
                        </p>
                    </div>

                    <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                        <h3 className="font-medium text-violet-700 dark:text-violet-300">
                            Durasi Kunjungan Rumah
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-violet-900 dark:text-violet-100">
                            {durasiKunjungan} jam
                        </p>
                        <p className="mt-2 text-sm text-violet-600 dark:text-violet-400">
                            Waktu yang dihabiskan untuk kunjungan rumah keluarga
                        </p>
                    </div>

                    <div className="rounded-lg bg-pink-50 p-4 dark:bg-pink-900/20">
                        <h3 className="font-medium text-pink-700 dark:text-pink-300">
                            Jarak Total Kunjungan Rumah
                        </h3>
                        <p className="mt-1 text-2xl font-bold text-pink-900 dark:text-pink-100">
                            {jarakKunjungan} km
                        </p>
                        <p className="mt-2 text-sm text-pink-600 dark:text-pink-400">
                            Total jarak tempuh selama kunjungan rumah
                        </p>
                    </div>
                </div>

                {/* Chart Visual */}
                <div className="flex h-80 flex-col justify-between lg:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                stroke="#6b7280"
                                tick={{ fill: "#6b7280" }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                            <Tooltip
                                formatter={(value: number, _: string, props: any) => [
                                    `${value} ${props.payload.unit}`,
                                    "",
                                ]}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "0.5rem",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Bar dataKey="value" name="">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    formatter={(label: any) =>
                                        `${label} ${chartData[0].unit}`
                                    }
                                    fill="#374151"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DurasiJarak;
