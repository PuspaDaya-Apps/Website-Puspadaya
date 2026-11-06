import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";

export const metadata: Metadata = {
  title: "Puspadaya - Login",
  description: "Login ke sistem Puspadaya Posyandu",
};

const SignIn: React.FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F6FB] p-4 selection:bg-[#FF8D4D] selection:text-[#111928] dark:bg-[#070E1B] sm:p-6 lg:p-8">
      <div className="w-full max-w-[1080px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-20px_rgba(10,32,80,0.35)] dark:bg-[#0E1626] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] lg:grid lg:grid-cols-[1.08fr_1fr]">
        {/* Bidang warna logo: biru di awal sapuan, ungu di pertemuan, magenta di
            ujung -- urutan yang sama dengan gradien pada lambang Puspadaya. */}
        <aside className="flex flex-col justify-between gap-7 overflow-hidden bg-[linear-gradient(145deg,#0A3A8F_0%,#6B1FA8_52%,#B5126B_100%)] p-7 selection:bg-white/85 selection:text-[#0A3A8F] sm:p-10 lg:min-h-[640px] lg:gap-10 lg:p-12">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo/logo-puspa.png"
              alt=""
              width={213}
              height={160}
              priority
              className="h-14 w-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.28)] sm:h-16"
            />
            <div>
              <p className="text-xl font-bold tracking-[-0.01em] text-white sm:text-2xl">
                Puspadaya
              </p>
              <p className="mt-0.5 text-sm text-[#CFE0FF]">
                Pemberdayaan Perempuan Berdaya
              </p>
            </div>
          </div>

          {/* Sengaja <p>, bukan <h2>: satu-satunya <h1> halaman ini adalah
              "Masuk" di form, dan heading panel akan mendahuluinya di urutan
              dokumen sehingga outline-nya terbalik bagi pembaca layar. */}
          <div className="max-w-[26rem]">
            <p className="text-balance text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[34px] lg:text-[40px]">
              Sistem Informasi Posyandu
            </p>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-[#CFE0FF] sm:text-base">
              Platform digital untuk mendukung pelayanan kesehatan ibu dan anak
              di Posyandu.
            </p>
          </div>

          {/* Di layar HP baris ini disembunyikan supaya panel tidak mendorong
              form terlalu jauh ke bawah lipatan. */}
          <p className="hidden text-sm text-[#CFE0FF] lg:block">
            Digunakan oleh bidan, kader, dan kepala desa.
          </p>
        </aside>

        <div className="flex items-center p-8 sm:p-10 lg:p-12">
          <div className="w-full">
            <Signin />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
