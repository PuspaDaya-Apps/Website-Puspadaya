"use client";
import React, { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/app/api/login/loginApi";

export default function SigninWithPassword() {
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

      // replace(): halaman login tidak perlu tertinggal di history, supaya
      // tombol Back tidak mengembalikan user ke form setelah berhasil login.
      window.location.replace('/');
      // Biarkan tombol tetap disabled sampai halaman baru mengambil alih.
    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-xl sm:p-8"
        autoComplete="on"
      >
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
          Login
        </h1>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Username Input */}
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border p-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white sm:p-4"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
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
              placeholder="Enter your password"
              className="w-full rounded-lg border p-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white sm:p-4"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
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
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.36 18.36 0 0 1 3.86-5.54"></path>
                  <path d="M8.72 3.72A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.36 18.36 0 0 1-3.86 5.54"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:py-4 sm:text-lg"
        >
          {isSubmitting && (
            <span
              aria-hidden="true"
              className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
          )}
          {isSubmitting ? "Memproses..." : "Login"}
        </button>

        {/* Link to Sign Up or Forgot Password */}
        {/* <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/signup" className="text-blue-500 hover:text-blue-700">
            Create an account
          </Link>{" "}
          |{" "}
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div> */}
      </form>
    </div>
  );
}
