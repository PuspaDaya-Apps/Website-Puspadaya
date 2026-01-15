import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";
import { FaBaby, FaUserNurse, FaUsers, FaHeartbeat, FaStethoscope, FaWeight, FaSyringe } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Puspadaya - Login",
  description: "Login ke sistem Puspadaya Posyandu",
};

const SignIn: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card w-full max-w-6xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Welcome Section - Visible on all screens but with different layout */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-500 to-teal-600 dark:from-green-700 dark:to-teal-800 p-8 lg:p-12 text-white">
            <div className="flex flex-col h-full justify-between">
              <div>
                <Link className="inline-block mb-8" href="/">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Image
                      src={"/images/logo/logo-puspa.png"}
                      alt="Logo"
                      width={120}
                      height={26}
                    />
                    <div>
                      <h1 className="text-xl font-bold text-white sm:text-2xl md:text-heading-3">
                        Puspadaya
                      </h1>
                      <p className="mt-1 text-sm font-medium text-white/90 sm:text-base">
                        Pemberdayaan Perempuan Berdaya
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <FaHeartbeat className="text-white text-4xl" />
                    </div>
                  </div>
                  <h1 className="text-center text-2xl font-bold sm:text-3xl">
                    Sistem Informasi Posyandu
                  </h1>
                </div>

                <p className="mb-8 text-center max-w-[375px] font-medium text-white/90 sm:text-lg mx-auto">
                  Platform digital untuk mendukung pelayanan kesehatan ibu dan anak di Posyandu
                </p>
              </div>

              <div className="mt-8 lg:mt-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center mb-4">
                    <FaStethoscope className="text-white mr-2" />
                    <h3 className="font-bold text-lg">Fitur Utama:</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center bg-white/10 p-2 rounded">
                      <FaBaby className="text-white mr-2 text-sm" />
                      <span className="text-xs">Pemantauan Balita</span>
                    </div>
                    <div className="flex items-center bg-white/10 p-2 rounded">
                      <FaSyringe className="text-white mr-2 text-sm" />
                      <span className="text-xs">Imunisasi</span>
                    </div>
                    <div className="flex items-center bg-white/10 p-2 rounded">
                      <FaUserNurse className="text-white mr-2 text-sm" />
                      <span className="text-xs">Data Ibu Hamil</span>
                    </div>
                    <div className="flex items-center bg-white/10 p-2 rounded">
                      <FaWeight className="text-white mr-2 text-sm" />
                      <span className="text-xs">Berat Badan</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-white/20 p-2 rounded-full mb-1">
                      <FaUserNurse className="text-white text-lg" />
                    </div>
                    <span className="text-xs text-center">Bidan</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/20 p-2 rounded-full mb-1">
                      <FaUsers className="text-white text-lg" />
                    </div>
                    <span className="text-xs text-center">Kader</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/20 p-2 rounded-full mb-1">
                      <FaBaby className="text-white text-lg" />
                    </div>
                    <span className="text-xs text-center">Anak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section - Full width on mobile, half on desktop */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-dark p-6 sm:p-8 md:p-12.5 lg:p-10 xl:p-15 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <Signin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
