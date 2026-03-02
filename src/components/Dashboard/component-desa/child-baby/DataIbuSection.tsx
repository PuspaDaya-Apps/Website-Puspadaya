import React from "react";
import { IbuResponseRapor } from "@/types/data-25/RaporResponse";

interface DataIbuSectionProps {
    dataIbu: IbuResponseRapor;
}

const DataIbuSection: React.FC<DataIbuSectionProps> = ({ dataIbu }) => {

    // Helper null -> "-"
    const orDash = (value: any) =>
        value === null || value === undefined || value === "" ? "-" : value;

    // Format tanggal menjadi DD-MM-YYYY
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return "-";

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "-";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    return (
        <section>
            <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
                C. Data Ibu
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <tbody className="divide-y divide-gray-200">

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">
                                NIK Ibu
                            </td>
                            <td className="px-4 py-2 text-gray-900">{orDash(dataIbu.nik)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Nama Ibu
                            </td>
                            <td className="px-4 py-2 text-gray-900">{orDash(dataIbu.nama_ibu)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Tanggal Lahir
                            </td>
                            <td className="px-4 py-2 text-gray-900">
                                {formatDate(dataIbu.tanggal_lahir)}
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Tempat Lahir
                            </td>
                            <td className="px-4 py-2 text-gray-900">{orDash(dataIbu.tempat_lahir)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Nomor Telepon
                            </td>
                            <td className="px-4 py-2 text-gray-900">{orDash(dataIbu.nomor_telepon)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Golongan Darah
                            </td>
                            <td className="px-4 py-2 text-gray-900">{orDash(dataIbu.gol_darah)}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Jenis KB
                            </td>
                            <td className="px-4 py-2 text-gray-900">{orDash(dataIbu.jenis_kb)}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default DataIbuSection;
