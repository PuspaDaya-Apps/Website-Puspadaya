import React from "react";
import { IdentitasBalita } from "../../../types/data-25/dummyDataBaby";

interface Props {
    identitasBalita: IdentitasBalita;
}

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
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">
                                No KK
                            </td>
                            <td className="px-4 py-2 text-gray-900">{identitasBalita.noKK}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                NIK Balita
                            </td>
                            <td className="px-4 py-2 text-gray-900">{identitasBalita.nik}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Nama Balita
                            </td>
                            <td className="px-4 py-2 text-gray-900">{identitasBalita.nama}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Tanggal Lahir
                            </td>
                            <td className="px-4 py-2 text-gray-900">
                                {identitasBalita.tanggalLahir}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Tempat Lahir
                            </td>
                            <td className="px-4 py-2 text-gray-900">
                                {identitasBalita.tempatLahir}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Jenis Kelamin
                            </td>
                            <td className="px-4 py-2 text-gray-900">
                                {identitasBalita.jenisKelamin}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Anak Ke
                            </td>
                            <td className="px-4 py-2 text-gray-900">
                                {identitasBalita.anakKe}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">
                                Cara Lahir
                            </td>
                            <td className="px-4 py-2 text-gray-900">
                                {identitasBalita.caraLahir}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default IdentitasBalitaSection;
