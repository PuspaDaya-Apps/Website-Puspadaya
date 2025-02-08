import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Signin from "@/components/Auth/Signin";

export const metadata: Metadata = {
  title: "Pusapdaya",
  description: "Puspadaya",
};

const SignIn: React.FC = () => {
  return (
    <>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2"> 
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signin />
            </div>
          </div>

          <div className="hidden p-7.5 xl:block xl:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
            <Link className="mb-25 inline-block flex items-center gap-4" href="/">
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-puspa.png"}
                  alt="Logo"
                  width={150}
                  height={32}
                />
                <div>
                <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-2">
                  Puspadaya
                </h1>
                <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Pemberdayaan Perempuan Berdaya
              </p>
                </div>
                
              </Link>

              <h1 className=" text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Selamat Datang!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
              Silakan masuk ke akun Anda dengan mengisi kolom yang diperlukan di bawah ini.
              </p>

              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
   </>
  );
};

export default SignIn;
