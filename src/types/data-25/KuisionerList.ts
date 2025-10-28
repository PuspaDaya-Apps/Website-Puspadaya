export interface PilihanOpsional {
    id: number;
    text: string;
    score: number;
}

export interface Pertanyaan {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    pertanyaan_text: string;
    tipe_pertanyaan: 'radio' | 'checkbox' | 'text' | string;
    pilihan_opsional: PilihanOpsional[];
    urutan: number;
    is_required: boolean;
}

export interface KuisionerList {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    nama_kuisioner: string;
    deskripsi: string;
    kategori: string; // contoh: "ibu_hamil"
    is_active: boolean;
    pertanyaan: Pertanyaan[];
}
