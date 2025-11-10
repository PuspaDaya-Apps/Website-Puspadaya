"use client";
import React, { useEffect, useState } from "react";
import { KaderProfileData, KaderProfileResponse } from "@/types/data-25/statistikbebankerja";
import { StatistikJenisPekerjaan } from "@/app/api/dashboatrd-new/statistikjenispekerjaan";


const KaderCard: React.FC = () => {
    const [kader, setKader] = useState<KaderProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchKader = async () => {
            setLoading(true);
            const response = await StatistikJenisPekerjaan(); // useCache is true by default
            if (response.successCode === 200 && response.data) {
                setKader(response.data);
            } else {
                setKader(null);
            }
            setLoading(false);
        };

        fetchKader();
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark text-center">
                <p className="text-gray-600 dark:text-gray-300">Memuat data kader...</p>
            </div>
        );
    }

    if (!kader) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark text-center">
                <p className="text-gray-600 dark:text-gray-300">Data kader tidak tersedia</p>
            </div>
        );
    }

    const { nama_kader, nama_role, jenis_pekerjaan } = kader;

    return (
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
            <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                Profil Kader
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Nama dan Jabatan */}
                <div>
                    <p className="mb-2">
                        <span className="font-medium text-dark dark:text-white">Nama: </span>
                        <span className="text-gray-700 dark:text-gray-300">{nama_kader || "-"}</span>
                    </p>
                    <p>
                        <span className="font-medium text-dark dark:text-white">Jabatan: </span>
                        <span className="text-gray-700 dark:text-gray-300">{nama_role || "-"}</span>
                    </p>
                </div>

                {/* Jenis Pekerjaan */}
                <div>
                    <p className="mb-2 font-medium text-dark dark:text-white">Jenis Pekerjaan:</p>
                    {Array.isArray(jenis_pekerjaan) && jenis_pekerjaan.length > 0 ? (
                        <ul className="space-y-1">
                            {jenis_pekerjaan.map((pekerjaan, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="mr-2 text-primary">•</span>
                                    <span className="text-gray-700 dark:text-gray-300">{pekerjaan}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            Data Beban Kerja Belum Diisi
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KaderCard;
