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
    tipe_pertanyaan: string;
    pilihan_opsional: PilihanOpsional[];
    urutan: number;
    is_required: boolean;
}

export interface Jawaban {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    respon_id: string;
    pertanyaan_id: string;
    jawaban_value: string;
    pertanyaan: Pertanyaan;
}

export interface Kuisioner {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    nama_kuisioner: string;
    deskripsi: string;
    kategori: string;
    is_active: boolean;
}

export interface KuisionerList {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    target_type: string;
    target_id: string;
    tanggal_pengisian: string;
    status: string;
    kuisioner: Kuisioner;
    jawaban: Jawaban[];
}