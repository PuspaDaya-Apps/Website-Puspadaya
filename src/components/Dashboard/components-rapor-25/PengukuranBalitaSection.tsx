import React from "react";
import { PengukuranBalita } from "../../../types/data-25/dummyDataBaby";

interface Props {
    pengukuranBalita: PengukuranBalita[];
}

const PengukuranBalitaSection: React.FC<Props> = ({ pengukuranBalita }) => {
    return (
        <section>
            <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
                D. Pengukuran Balita
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Tanggal</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Tempat</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Posisi</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Tinggi (cm)</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Berat (kg)</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">LILA (cm)</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Lingkar Kepala (cm)</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">ASI Eksklusif</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">MPASI</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Stunting</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Underweight</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Wasting</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {pengukuranBalita.map((p, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-900">{p.tanggal}</td>
                                <td className="px-4 py-2 text-gray-900">{p.tempat}</td>
                                <td className="px-4 py-2 text-gray-900">{p.posisi}</td>
                                <td className="px-4 py-2 text-gray-900">{p.tinggi}</td>
                                <td className="px-4 py-2 text-gray-900">{p.berat}</td>
                                <td className="px-4 py-2 text-gray-900">{p.lila}</td>
                                <td className="px-4 py-2 text-gray-900">{p.lingkarKepala}</td>
                                <td className="px-4 py-2 text-gray-900">{p.asiEksklusif}</td>
                                <td className="px-4 py-2 text-gray-900">{p.mpasi}</td>
                                <td className="px-4 py-2 text-gray-900">{p.stunting}</td>
                                <td className="px-4 py-2 text-gray-900">{p.underweight}</td>
                                <td className="px-4 py-2 text-gray-900">{p.wasting}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default PengukuranBalitaSection;
