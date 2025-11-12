import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";

export const metadata: Metadata = {
  title: "Puspadaya",
  description: "Puspadaya",
};

const SignIn: React.FC = () => {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-wrap">
        {/* Form Section - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2">
          <div className="w-full p-4 sm:p-8 md:p-12.5 lg:p-10 xl:p-15">
            <Signin />
          </div>
        </div>

        {/* Welcome Section - Hidden on mobile, shown on desktop */}
        <div className="hidden w-full p-5 lg:block lg:w-1/2">
          <div className="custom-gradient-1 dark:!bg-dark-2 dark:bg-none flex h-full flex-col justify-center overflow-hidden rounded-2xl px-6 py-10 sm:px-10 sm:py-12.5 xl:px-12.5 xl:py-15">
            <div className="mb-8">
              <Link className="inline-block" href="/">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Image
                    className="dark:hidden"
                    src={"/images/logo/logo-puspa.png"}
                    alt="Logo"
                    width={120}
                    height={26}
                  />
                  <div>
                    <h1 className="text-xl font-bold text-dark dark:text-white sm:text-2xl md:text-heading-3">
                      Puspadaya
                    </h1>
                    <p className="mt-1 text-sm font-medium text-dark dark:text-white sm:text-base">
                      Pemberdayaan Perempuan Berdaya
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
              Selamat Datang!
            </h1>

            <p className="mb-8 max-w-[375px] font-medium text-dark-4 dark:text-dark-6 sm:text-lg">
              Silakan masuk ke akun Anda dengan mengisi kolom yang diperlukan di bawah ini.
            </p>

            <div className="mt-5 sm:mt-10">
              <Image
                src={"/images/grids/grid-02.svg"}
                alt="Welcome"
                width={300}
                height={240}
                className="mx-auto dark:opacity-30 md:w-[350px] md:h-[280px] xl:w-[405px] xl:h-[325px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
