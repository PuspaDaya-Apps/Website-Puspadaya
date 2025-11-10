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
import { MonthlyActivityData } from "@/types/data-25/statistikbebankerja";
import { StatistikBulanan } from "@/app/api/dashboatrd-new/statistikbulanan";

const KehadiranGrafik: React.FC = () => {
    const [data, setData] = useState<MonthlyActivityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await StatistikBulanan();
                if (response.successCode === 200 && response.data) {
                    setData(response.data);
                } else {
                    // Jika API gagal, tetapkan data default daripada menampilkan error
                    setData({
                        jumlah_kehadiran_balita: 0,
                        jumlah_kehadiran_ibu_hamil: 0,
                        jenis_pekerjaan: []
                    });
                }
            } catch (error) {
                // Tangani error tanpa menampilkan di console
                setData({
                    jumlah_kehadiran_balita: 0,
                    jumlah_kehadiran_ibu_hamil: 0,
                    jenis_pekerjaan: []
                });
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-6 text-center shadow-md dark:bg-gray-dark">
                <p className="text-gray-600 dark:text-gray-300">Memuat data aktivitas...</p>
            </div>
        );
    }

    // ✅ Data untuk grafik tetap ditampilkan
    const chartData = [
        { name: "Balita", value: data.jumlah_kehadiran_balita || 0, color: "#3b82f6" },
        { name: "Ibu Hamil", value: data.jumlah_kehadiran_ibu_hamil || 0, color: "#10b981" },
    ];

    // ✅ Group jenis_pekerjaan jika ada
    const groupedData = data.jenis_pekerjaan?.reduce((acc: Record<string, string[]>, item) => {
        if (!acc[item.jenis]) acc[item.jenis] = [];
        acc[item.jenis].push(item.kategori);
        return acc;
    }, {}) || {};

    const hasJenisPekerjaan = data.jenis_pekerjaan && data.jenis_pekerjaan.length > 0;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Grafik Kehadiran */}
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                    Grafik Kehadiran Bulanan
                </h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                            <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "0.5rem",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Bar dataKey="value" name="Jumlah">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                {/* ✅ Tambahkan label angka di atas batang */}
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    style={{
                                        fill: "#111827",
                                        fontSize: 13,
                                        fontWeight: 600,
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legenda */}
                <div className="mt-4 flex justify-center flex-wrap gap-4">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className="h-4 w-4 rounded"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {item.name}: <strong>{item.value}</strong>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Aktivitas Bulanan */}
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                    Aktivitas Bulan Ini
                </h2>
                <div className="h-72 overflow-y-auto pr-2 space-y-4">
                    {hasJenisPekerjaan ? (
                        Object.entries(groupedData).map(([jenis, kategoriList], idx) => (
                            <div
                                key={idx}
                                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                            >
                                <h3 className="font-medium text-dark dark:text-white mb-2">
                                    {jenis}
                                </h3>
                                <ul className="space-y-2">
                                    {kategoriList.map((kategori, i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between text-gray-700 dark:text-gray-300"
                                        >
                                            <span>{kategori}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Total kompetensi: {kategoriList.length}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-600 dark:text-gray-300">
                            Data aktivitas bulan ini masih belum diisi.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KehadiranGrafik;
