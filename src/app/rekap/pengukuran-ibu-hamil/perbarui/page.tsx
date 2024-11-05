"use client";
import { IconCalendarEvent } from "@tabler/icons-react";
import {
    AutoComplete,
    AutoCompleteChangeEvent,
    AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import React, { useEffect, useState } from "react";

type Name = string;

type FormData = {
    nama: string;
    posyandu: string;
    tanggalPemeriksaan: string;
    usiakehamilan: string;
    umurIbu: string;
    jumlahTablet: string;
    hemoglobin: string;
    catatan: string;
    tgl_awal_haid: string;
    tgl_akhir_haid: string;
    tinggi_badan: string;
    berat_badan: string;
    lingkar_lengan_atas: string;
    tinggi_fundus: string;
};

const existingNames: Name[] = [
    "Budi Santoso",
    "Siti Aminah",
    "Andi Wijaya",
    "Putri Maharani",
    "Rizky Pratama",
    "Desi Puspitasari",
    "Agus Supriyadi",
    "Lestari Dewi",
    "Bayu Saputra",
    "Ratna Sari",
    "Eko Purwanto",
    "Fitriani Rahma",
    "Teguh Wibowo",
    "Dewi Sartika",
    "Hariyanto Siregar",
    "Lina Kusuma",
    "Wawan Setiawan",
    "Ayu Lestari",
    "Fajar Nugraha",
    "Rina Puspita",
];

const Page: React.FC = () => {
    const [timezone, setTimezone] = useState("Asia/Jakarta");
    const [filteredNames, setFilteredNames] = useState<Name[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [ingredient, setIngredient] = useState<string>("");
    const [ingredients, setIngredients] = useState<string>("");

    const [formData, setFormData] = useState<FormData>({
        nama: "",
        posyandu: "",
        tanggalPemeriksaan: "",
        usiakehamilan: "25",
        umurIbu: "29",
        jumlahTablet: "",
        hemoglobin: "",
        catatan: "",
        tgl_awal_haid: "23/02/2024",
        tgl_akhir_haid: "02/03/2024",
        tinggi_badan: "",
        berat_badan: "",
        lingkar_lengan_atas: "",
        tinggi_fundus: "",

    });

    const getCurrentDateTime = (): string => {
        const now = new Date();
        return now.toLocaleString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setFormData((prevState) => ({
                ...prevState,
                tanggalPemeriksaan: getCurrentDateTime(),
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAutoCompleteChange = (e: AutoCompleteChangeEvent) => {
        const { value } = e;
        setFormData((prevState) => ({
            ...prevState,
            nama: value,
        }));
        searchName(value);
    };

    // Search for names
    const searchName = (query: string) => {
        let filtered: Name[];
        if (!query.trim().length) {
            filtered = [];
        } else {
            filtered = existingNames.filter((name) =>
                name.toLowerCase().includes(query.toLowerCase()),
            );
        }
        setFilteredNames(filtered);
        setShowPopup(filtered.length === 0);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };

    const itemTemplate = (item: string, index: number) => (
        <div key={index}>
            <div className="cursor-pointer px-4 py-2 hover:bg-gray-100">{item}</div>
            {index < filteredNames.length - 1 && (
                <div className="border-b border-gray-200"></div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto">
            <div className="mb-2 rounded-lg bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    Perbarui Rekap Pengukuran
                </h1>
                <h5 className="text-lg text-gray-600">
                    Untuk melihat detail informasi data Ibu Hamil
                </h5>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="nama"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Nama Lengkap
                            </label>
                            <AutoComplete
                                id="nama"
                                name="nama"
                                value={formData.nama}
                                suggestions={filteredNames}
                                completeMethod={(e: AutoCompleteCompleteEvent) =>
                                    searchName(e.query)
                                }
                                onChange={handleAutoCompleteChange}
                                className="w-full placeholder:text-xs"
                                inputClassName="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                panelClassName="bg-white shadow-lg rounded-md mt-1 border-none"
                                placeholder="Masukkan Nama Lengkap"
                                itemTemplate={itemTemplate}
                            />
                            {showPopup && (
                                <div className="mt-1 rounded-md bg-red-100 p-2 text-red-700">
                                    Nama tidak ditemukan dalam database.
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="posyandu"
                                    className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                >
                                    Posyandu
                                </label>
                                <InputText
                                    id="posyandu"
                                    name="posyandu"
                                    value={formData.posyandu}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"

                                    placeholder="Posyandu Mawar 6"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="tanggalPemeriksaan"
                                    className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                >
                                    Tanggal Pendampingan (Waktu Lokal)
                                </label>
                                <div className="relative">
                                    <InputText
                                        id="tanggalPemeriksaan"
                                        name="tanggalPemeriksaan"
                                        value={formData.tanggalPemeriksaan}
                                        className="w-full rounded-md border border-gray-300 p-2 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        readOnly
                                    />
                                    <IconCalendarEvent
                                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                                        size={20}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {/* Usia Kehamilan */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="tinggiBadan"
                                        className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                    >
                                        Usia Kehamilan
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="number"
                                            required
                                            readOnly
                                            id="tinggiBadan"
                                            name="tinggiBadan"
                                            value={formData.usiakehamilan}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan Usia Kehamilan"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                                            Mn
                                        </span>
                                    </div>



                                </div>

                                {/* Input Berat Badan */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="beratBadan"
                                        className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                    >
                                        Usia Ibu Hamil
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="number"
                                            required
                                            readOnly
                                            id="beratBadan"
                                            name="beratBadan"
                                            value={formData.umurIbu}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan Umur Ibu Hamil"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                                            Tahun
                                        </span>
                                    </div>
                                </div>


                            </div>


                            <div className="flex gap-4">
                                {/* Input Lingkar Lengan Atas */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="lingkarLenganAtas"
                                        className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                    >
                                        Jumlah Tablet (Fe) Yang Diminum
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="number"
                                            required
                                            id="lingkarLenganAtas"
                                            name="lingkarLenganAtas"
                                            value={formData.jumlahTablet}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan jumlah tablet Fe"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                                            Btr
                                        </span>
                                    </div>
                                </div>

                                {/* Input Lingkar Kepala */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="lingkarKepala"
                                        className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                    >
                                        Hemoglobin
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="number"
                                            required
                                            id="lingkarKepala"
                                            name="lingkarKepala"
                                            value={formData.hemoglobin}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan Lingkar Kepala"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                                            g/dl
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {/* Input Lingkar Lengan Atas */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="lingkarLenganAtas"
                                        className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                    >
                                        Tanggal Pertama Haid
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="text"
                                            required
                                            id="lingkarLenganAtas"
                                            name="lingkarLenganAtas"
                                            value={formData.tgl_awal_haid}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan jumlah tablet Fe"
                                        />
                                        <IconCalendarEvent
                                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                                            size={20}
                                        />
                                    </div>
                                </div>

                                {/* Input Lingkar Kepala */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="lingkarKepala"
                                        className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                    >
                                        Tanggal Terakhir Haid
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="text"
                                            required
                                            id="lingkarKepala"
                                            name="lingkarKepala"
                                            readOnly
                                            value={formData.tgl_akhir_haid}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan Lingkar Kepala"
                                        />
                                        <IconCalendarEvent
                                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                                            size={20}
                                        />
                                    </div>
                                </div>
                            </div>





                        </div>

                        <div>

                            <div className="flex gap-4">
                                {/* Input Lingkar Lengan Atas */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="lingkarLenganAtas"
                                        className="mb-1  block text-sm font-medium text-gray-700"
                                    >
                                        Tinggi Badan
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="number"
                                            required
                                            id="lingkarLenganAtas"
                                            name="lingkarLenganAtas"
                                            value={formData.tinggi_badan}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan jumlah tablet Fe"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                                            Cm
                                        </span>
                                    </div>
                                </div>

                                {/* Input Lingkar Kepala */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="lingkarKepala"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Berat Badan
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="number"
                                            required
                                            id="lingkarKepala"
                                            name="lingkarKepala"
                                            value={formData.berat_badan}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan Lingkar Kepala"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                                            Kg
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <div className="flex gap-4">
                                {/* Input Lingkar Lengan Atas */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="lingkarLenganAtas"
                                        className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                    >
                                        Lingkar Lengan Atas
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="number"
                                            required
                                            id="lingkarLenganAtas"
                                            name="lingkarLenganAtas"
                                            value={formData.lingkar_lengan_atas}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan jumlah tablet Fe"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                                            Cm
                                        </span>
                                    </div>
                                </div>

                                {/* Input Lingkar Kepala */}
                                <div className="w-1/2">
                                    <label
                                        htmlFor="lingkarKepala"
                                        className="mb-1 mt-4 block text-sm font-medium text-gray-700"
                                    >
                                        Tinggi Fundus Utari
                                    </label>
                                    <div className="relative">
                                        <InputText
                                            type="number"
                                            required
                                            id="lingkarKepala"
                                            name="lingkarKepala"
                                            value={formData.tinggi_fundus}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border border-gray-300 p-2 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                            placeholder="Masukkan Lingkar Kepala"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                                            Cm
                                        </span>
                                    </div>
                                </div>
                            </div>




                            <div className="grid grid-cols-2 gap-6 pt-2">
                                {/* Kolom Kiri: Catatan */}
                                <div >
                                    <label
                                        htmlFor="catatan"
                                        className="mb-1 mt-2 block text-sm font-medium text-gray-700"
                                    >
                                        Catatan
                                    </label>
                                    <InputTextarea
                                        id="catatan"
                                        name="catatan"
                                        value={formData.catatan}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                                        placeholder="Masukkan catatan"
                                    />
                                </div>

                                {/* Kolom Kanan: Radio Button */}
                                <div>
                                    <label
                                        htmlFor="mpasi"
                                        className="mb-1  mt-2 block text-sm font-medium text-gray-700"
                                    >
                                        Keterpaparan Asap Rokok
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex cursor-pointer items-center">
                                            <RadioButton
                                                inputId="ingredient1"
                                                value="Ya"
                                                onChange={(e: RadioButtonChangeEvent) =>
                                                    setIngredient(e.value)
                                                }
                                                checked={ingredient === "Ya"}
                                            />
                                            <span className="ml-2">Ya</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center">
                                            <RadioButton
                                                inputId="ingredient2"
                                                value="Tidak"
                                                onChange={(e: RadioButtonChangeEvent) =>
                                                    setIngredient(e.value)
                                                }
                                                checked={ingredient === "Tidak"}
                                            />
                                            <span className="ml-2">Tidak</span>
                                        </label>
                                    </div>
                                </div>
                            </div>




                        </div>

                    </div>



                    <div className="flex justify-center md:col-span-4">
                        <Button
                            type="submit"
                            label="Simpan"
                            className="rounded bg-[#486284] px-20 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-[#3a4f6a] mt-6"
                        />
                    </div>

                </form>


            </div>
        </div>
    );
};

export default Page;