import React from "react";

interface DashboardErrorProps {
  /** Apa yang gagal dimuat, mis. "informasi data desa". */
  pesan: string;
  onRetry?: () => void;
}

/**
 * Dipakai sebagai pengganti isi kartu saat query-nya gagal, bukan sebagai
 * spanduk di atasnya. Menampilkan pesan error berdampingan dengan angka
 * fallback 0 membuat kegagalan terbaca sebagai data asli: pembaca melihat
 * "Total Balita 0", bukan "angkanya tidak diketahui".
 */
const DashboardError: React.FC<DashboardErrorProps> = ({ pesan, onRetry }) => {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-900/20"
    >
      <p className="text-sm text-red-700 dark:text-red-300">{pesan}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-dark"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
};

export default DashboardError;
