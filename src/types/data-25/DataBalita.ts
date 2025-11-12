// types/AnakResponse.ts

export interface AnakItem {
    id: string;
    nik: string;
    nama_anak: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    updated_at: string | null;
    usia: string;
    nama_ibu: string;
    status: string;
}

export interface MetaData {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export interface Links {
    first: string;
    last: string;
    current: string;
    next: string;
    previous: string;
}

export interface AnakResponse {
    data: AnakItem[];
    meta: MetaData;
    links: Links;
    message: string;
}
