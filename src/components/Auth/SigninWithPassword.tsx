"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/api/login/loginApi";

// Satu kelas dipakai dua input supaya tinggi, radius, dan perilaku fokusnya
// tidak pernah berbeda. Border #8792A6 dipilih karena 3,14:1 terhadap putih --
// batas kontrol yang lebih terang dari itu gagal WCAG 1.4.11.
const FIELD_CLASS =
  "h-12 w-full rounded-xl border border-[#8792A6] bg-white px-4 text-base text-[#111928] caret-[#3A75E3] outline-none transition duration-200 placeholder:text-[#5A6578] focus:border-[#3A75E3] focus:ring-4 focus:ring-[#3A75E3]/20 disabled:cursor-not-allowed disabled:bg-[#F4F6FB] disabled:text-[#5A6578] dark:border-[#5D6B85] dark:bg-[#131C2E] dark:text-[#F3F6FC] dark:placeholder:text-[#8491A8] dark:focus:border-[#7FB4FF] dark:focus:ring-[#7FB4FF]/25 dark:disabled:bg-[#111A2B]";

const LABEL_CLASS =
  "mb-2 block text-sm font-medium text-[#36405A] dark:text-[#BFC9DA]";

export default function SigninWithPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // loginUser hanya selesai setelah TokenManager.saveToken() menulis cookie
      // `token` lewat document.cookie (sinkron), jadi cookie sudah ada sebelum
      // navigasi di bawah -- middleware pasti melihatnya di request pertama.
      await loginUser(username, password);

      // Langsung navigasi setelah login sukses. Prefetch tidak ditunggu karena
      // bisa menahan login sampai 7-14 detik; dashboard akan memuat datanya
      // sendiri lewat React Query.
      router.replace("/");
      // Biarkan tombol tetap disabled sampai halaman baru mengambil alih.
    } catch (err: any) {
      setError(err.message || "Login gagal. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full" autoComplete="on">
      <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#111928] dark:text-[#F3F6FC] sm:text-[30px]">
        Masuk
      </h1>
      <p className="mt-2 text-sm text-[#5A6578] dark:text-[#9AA6BC]">
        Masukkan akun Anda untuk melanjutkan.
      </p>

      {/* aria-live memastikan pesan gagal login dibacakan screen reader, bukan
          hanya muncul secara visual. */}
      <div aria-live="polite">
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-[#F1B4B4] bg-[#FDF2F2] px-4 py-3 text-sm text-[#C1272D] dark:border-[#7F2B2B] dark:bg-[#2A1416] dark:text-[#FCA5A5]"
          >
            {error}
          </p>
        )}
      </div>

      <div className="mt-8">
        <label htmlFor="username" className={LABEL_CLASS}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Masukkan username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSubmitting}
          className={FIELD_CLASS}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="password" className={LABEL_CLASS}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            placeholder="Masukkan password"
            className={`${FIELD_CLASS} pr-14`}
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-[#5A6578] transition hover:bg-[#F4F6FB] hover:text-[#111928] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A75E3] dark:text-[#9AA6BC] dark:hover:bg-[#1B2538] dark:hover:text-[#F3F6FC]"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.36 18.36 0 0 1 3.86-5.54"></path>
                <path d="M8.72 3.72A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.36 18.36 0 0 1-3.86 5.54"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Oranye hati pada logo dipakai persis sekali di halaman ini: tombol yang
          ditekan. Tintanya gelap, bukan putih -- oranye logo terhadap putih
          hanya 2,29:1, terhadap #111928 7,68:1. */}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="mt-8 flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#FF8D4D] text-base font-bold text-[#111928] shadow-[0_10px_24px_-10px_rgba(255,122,46,0.8)] transition duration-200 hover:bg-[#FF7A2E] hover:shadow-[0_14px_28px_-10px_rgba(255,122,46,0.9)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF8D4D]/45 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
      >
        {isSubmitting && (
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-[#111928] border-t-transparent"
          />
        )}
        {isSubmitting ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
