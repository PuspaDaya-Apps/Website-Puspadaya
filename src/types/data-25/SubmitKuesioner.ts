export interface Jawaban {
    pertanyaan_id: string;
    jawaban_value: string;
}

export interface SubmitPayload {
    kuisioner_id: string;
    target_type: string;   // contoh: "ibu_hamil"
    target_id: string;
    kader_id: string;
    tanggal_pengisian: string; // format YYYY-MM-DD
    jawaban: Jawaban[];
}
