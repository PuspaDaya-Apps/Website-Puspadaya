export interface Jawaban {
    pertanyaan_id: string;
    jawaban_value: string;
}

export interface SubmitPayload {
    kuisioner_id: string | null;
    target_type: string;
    target_id: string | null;
    kader_id: string;
    tanggal_pengisian: string;
    jawaban: {
        pertanyaan_id: string;
        jawaban_value: string;
    }[];
}
