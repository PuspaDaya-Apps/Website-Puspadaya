import { PengukuranIbuHamil } from "@/types/data-25/RaporResponse";
import React from "react";


interface Props {
    pengukuranIbuHamil: PengukuranIbuHamil[];
}

const PengukuranIbuHamilTable: React.FC<Props> = ({ pengukuranIbuHamil }) => {
    if (pengukuranIbuHamil.length === 0) return null;

    return (
        <section>
            <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
                E. Pengukuran Ibu Hamil
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Tanggal</th>
                            <th className="px-4 py-2 text-left">Tempat</th>
                            <th className="px-4 py-2 text-left">Usia Kehamilan (minggu)</th>
                            <th className="px-4 py-2 text-left">Tinggi (cm)</th>
                            <th className="px-4 py-2 text-left">Berat (kg)</th>
                            <th className="px-4 py-2 text-left">LILA (cm)</th>
                            <th className="px-4 py-2 text-left">Tinggi Fundus (cm)</th>
                            <th className="px-4 py-2 text-left">Hemoglobin (g/dl)</th>
                            <th className="px-4 py-2 text-left">Tgl Pertama Haid</th>
                            <th className="px-4 py-2 text-left">Asap Rokok</th>
                            <th className="px-4 py-2 text-left">Tablet Fe</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {pengukuranIbuHamil.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{p.tanggal}</td>
                                <td className="px-4 py-2">{p.tempat}</td>
                                <td className="px-4 py-2">{p.usiaKehamilan}</td>
                                <td className="px-4 py-2">{p.tinggi}</td>
                                <td className="px-4 py-2">{p.berat}</td>
                                <td className="px-4 py-2">{p.lila}</td>
                                <td className="px-4 py-2">{p.tinggiFundus}</td>
                                <td className="px-4 py-2">{p.hemoglobin}</td>
                                <td className="px-4 py-2">{p.tglHaid}</td>
                                <td className="px-4 py-2">{p.asapRokok}</td>
                                <td className="px-4 py-2">{p.tabletFe}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default PengukuranIbuHamilTable;
