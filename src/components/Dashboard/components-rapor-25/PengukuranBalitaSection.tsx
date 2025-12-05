import React from "react";
import { PengukuranAnakResponseRapor } from "@/types/data-25/RaporResponse";

interface Props {
    pengukuranBalita: PengukuranAnakResponseRapor[];
}

const PengukuranBalitaSection: React.FC<Props> = ({ pengukuranBalita }) => {
    // Jika null/undefined/"" → 0
    const toNumberOrZero = (value: any) =>
        value === null || value === undefined || value === "" ? 0 : value;

    // Format tanggal → DD-MM-YYYY
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "-";

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    };

    return (
        <section>
            <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
                D. Pengukuran Balita
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left font-medium">Tanggal</th>
                            <th className="px-4 py-2 text-left font-medium">Berat (kg)</th>
                            <th className="px-4 py-2 text-left font-medium">Tinggi (cm)</th>
                            <th className="px-4 py-2 text-left font-medium">LILA (cm)</th>
                            <th className="px-4 py-2 text-left font-medium">Lingkar Kepala (cm)</th>
                            <th className="px-4 py-2 text-left font-medium">ASI Eksklusif</th>
                            <th className="px-4 py-2 text-left font-medium">MPASI</th>
                            <th className="px-4 py-2 text-left font-medium">Stunting</th>
                            <th className="px-4 py-2 text-left font-medium">Status Gizi</th>
                            <th className="px-4 py-2 text-left font-medium">Wasting</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {pengukuranBalita.map((p, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{formatDate(p.tanggal_pengukuran)}</td>
                                <td className="px-4 py-2">{toNumberOrZero(p.berat_badan)}</td>
                                <td className="px-4 py-2">{toNumberOrZero(p.tinggi_badan)}</td>
                                <td className="px-4 py-2">{toNumberOrZero(p.lingkar_lengan_atas)}</td>
                                <td className="px-4 py-2">{toNumberOrZero(p.lingkar_kepala)}</td>

                                <td className="px-4 py-2">{p.asi_eksklusif ?? "-"}</td>
                                <td className="px-4 py-2">{p.mpasi ?? "-"}</td>
                                <td className="px-4 py-2">{p.status_stunting ?? "-"}</td>
                                <td className="px-4 py-2">{p.status_gizi ?? "-"}</td>
                                <td className="px-4 py-2">{p.status_wasting ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default PengukuranBalitaSection;
