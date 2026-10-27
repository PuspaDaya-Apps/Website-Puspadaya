export interface ApiFetchResult<T> {
  successCode: number;
  data: T | null;
}

export class ApiFetchError extends Error {
  readonly successCode: number;

  constructor(successCode: number, message?: string) {
    super(message ?? `Permintaan gagal dengan kode ${successCode}`);
    this.name = 'ApiFetchError';
    this.successCode = successCode;
  }
}

// Semua fungsi API di proyek ini menelan error dan mengembalikan
// { successCode, data } alih-alih throw. queryFn harus melempar saat gagal:
// kalau tidak, respons gagal ikut tersimpan sebagai data valid selama
// staleTime dan panel dashboard tampak kosong tanpa pesan error.
export const unwrapFetchResult = async <T>(
  request: Promise<ApiFetchResult<T>>,
  errorMessage?: string
): Promise<T> => {
  const result = await request;

  if (result.successCode !== 200 || result.data === null) {
    throw new ApiFetchError(result.successCode, errorMessage);
  }

  return result.data;
};
