// /components/KehadiranGrafik/KehadiranGrafik.tsx
import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Cell,
} from "recharts";

interface KehadiranGrafikProps {
    kader: any;
    chartData: { name: string; value: number; color: string }[];
}

const KehadiranGrafik: React.FC<KehadiranGrafikProps> = ({ kader, chartData }) => {
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
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legenda Kustom */}
                <div className="mt-4 flex justify-center">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {chartData.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <div className={`h-4 w-4 rounded`} style={{ backgroundColor: item.color }}></div>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Kegiatan Bulanan */}
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                    Aktivitas Bulan Ini
                </h2>
                <div className="h-72 overflow-y-auto pr-2">
                    <div className="space-y-4">
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="font-medium text-dark dark:text-white">Balita</h3>
                            <ul className="mt-2 space-y-2">
                                {kader.laporan.jumlah_balita_hadir_per_kompetensi.detail.map(
                                    (item: any, index: number) => (
                                        <li key={index} className="flex justify-between">
                                            <span className="text-gray-700 dark:text-gray-300">{item.kompetensi}</span>
                                            <span className="font-medium text-dark dark:text-white">{item.jumlah}</span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="font-medium text-dark dark:text-white">Ibu Hamil</h3>
                            <ul className="mt-2 space-y-3">
                                {kader.laporan.jumlah_ibu_hamil_hadir_per_kompetensi.detail.map(
                                    (item: any, index: number) => (
                                        <li key={index}>
                                            <p className="font-medium text-gray-700 dark:text-gray-300">{item.kompetensi}</p>
                                            <ul className="mt-1 space-y-1 pl-4">
                                                {item.aktivitas_kader.map((aktivitas: string, i: number) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="mr-2 text-primary">•</span>
                                                        <span className="text-gray-600 dark:text-gray-400">{aktivitas}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KehadiranGrafik;
