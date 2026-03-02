import React from "react";
import { AnakResponseRapor } from "@/types/data-25/RaporResponse";

interface Props {
    identitasBalita: AnakResponseRapor;
}

// Helper format tanggal
const formatTanggal = (tanggal: string | null | undefined) => {
    if (!tanggal) return "-";
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return "-";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
};

// Helper default "-"
const safe = (val: any) => (val === null || val === undefined || val === "" ? "-" : val);

const IdentitasBalitaSection: React.FC<Props> = ({ identitasBalita }) => {
    return (
        <section>
            <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
                A. Identitas Balita
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <tbody className="divide-y divide-gray-200">

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50 w-1/3">NIK Balita</td>
                            <td className="px-4 py-2">{safe(identitasBalita.nik)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Nama Balita</td>
                            <td className="px-4 py-2">{safe(identitasBalita.nama_anak)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Tanggal Lahir</td>
                            <td className="px-4 py-2">
                                {formatTanggal(identitasBalita.tanggal_lahir)}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Tempat Lahir</td>
                            <td className="px-4 py-2">{safe(identitasBalita.tempat_lahir)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Jenis Kelamin</td>
                            <td className="px-4 py-2">{safe(identitasBalita.jenis_kelamin)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Anak Ke</td>
                            <td className="px-4 py-2">{safe(identitasBalita.anak_ke)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Berat Badan Lahir</td>
                            <td className="px-4 py-2">{safe(identitasBalita.berat_badan_lahir)} kg</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Tinggi Badan Lahir</td>
                            <td className="px-4 py-2">{safe(identitasBalita.tinggi_badan_lahir)} cm</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Lingkar Lengan Atas</td>
                            <td className="px-4 py-2">{safe(identitasBalita.lingkar_lengan_atas_lahir)} cm</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium bg-gray-50">Lingkar Kepala</td>
                            <td className="px-4 py-2">{safe(identitasBalita.lingkar_kepala_lahir)} cm</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default IdentitasBalitaSection;
