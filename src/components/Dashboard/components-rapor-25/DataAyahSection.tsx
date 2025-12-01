import React from "react";
import { DataOrangTua } from "../../../types/data-25/dummyDataBaby";

interface Props {
    dataAyah: DataOrangTua;
}

const DataAyahSection: React.FC<Props> = ({ dataAyah }) => {
    return (
        <section>
            <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
                B. Data Ayah
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">
                                NIK Ayah
                            </td>
                            <td className="px-4 py-2 text-gray-900">{dataAyah.nik}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Nama Ayah
                            </td>
                            <td className="px-4 py-2 text-gray-900">{dataAyah.nama}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Tanggal Lahir
                            </td>
                            <td className="px-4 py-2 text-gray-900">{dataAyah.tanggalLahir}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Tempat Lahir
                            </td>
                            <td className="px-4 py-2 text-gray-900">{dataAyah.tempatLahir}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Jenis Kelamin
                            </td>
                            <td className="px-4 py-2 text-gray-900">{dataAyah.jenisKelamin}</td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Alamat
                            </td>
                            <td className="px-4 py-2 text-gray-900">{dataAyah.alamat}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default DataAyahSection;
