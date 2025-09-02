"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/api/login/loginApi";

export default function SigninWithPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-xl sm:p-8"
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
            type="text"
            placeholder="Enter your username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border p-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white sm:p-4"
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border p-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white sm:p-4"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
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
          className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 sm:py-4 sm:text-lg"
        >
          Login
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
