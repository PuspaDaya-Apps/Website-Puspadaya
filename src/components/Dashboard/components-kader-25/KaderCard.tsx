// /components/KaderCard/KaderCard.tsx
import React from "react";

interface Laporan {
    jumlah_balita_hadir_per_kompetensi: any;
    jumlah_ibu_hamil_hadir_per_kompetensi: any;
    durasi_kerja_posyandu: string;
    durasi_kerja_kunjungan_rumah: string;
    jarak_ke_posyandu: string;
    jarak_total_kunjungan_rumah: string;
    skor_beban_kerja: number;
}

interface Kader {
    nama: string;
    jabatan: string;
    jenis_pekerjaan: string[];
    laporan: Laporan;
}

interface KaderCardProps {
    kader: Kader;
}

const KaderCard: React.FC<KaderCardProps> = ({ kader }) => {
    return (
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
            <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                Profil Kader
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="mb-2">
                        <span className="font-medium text-dark dark:text-white">Nama:</span>{" "}
                        <span className="text-gray-700 dark:text-gray-300">{kader.nama}</span>
                    </p>
                    <p>
                        <span className="font-medium text-dark dark:text-white">Jabatan:</span>{" "}
                        <span className="text-gray-700 dark:text-gray-300">{kader.jabatan}</span>
                    </p>
                </div>
                <div>
                    <p className="mb-2 font-medium text-dark dark:text-white">
                        Jenis Pekerjaan:
                    </p>
                    <ul className="space-y-1">
                        {kader.jenis_pekerjaan.map((pekerjaan, i) => (
                            <li key={i} className="flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                <span className="text-gray-700 dark:text-gray-300">{pekerjaan}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default KaderCard;
