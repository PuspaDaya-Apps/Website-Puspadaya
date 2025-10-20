import ClickOutside from "@/components/ClickOutside";
import { IconSettings, IconUser, IconLogout } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const AUTO_LOGOUT_TIME = 10 * 60 * 1000;

  // Menggunakan useMemo untuk menghindari pengambilan data dari sessionStorage setiap render
  const roleUser = useMemo(() => sessionStorage.getItem("user_role"), []);
  const namaLengkap = useMemo(() => sessionStorage.getItem("nama_lengkap"), []);

  // Menggunakan useCallback untuk memastikan referensi fungsi tetap konsisten
  const handleLogout = useCallback(() => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/auth/signin";
  }, []);

  const roleImageMap: { [key: string]: string } = {
    "Admin": "/images/user/admin.png",
    "Dinas Kesehatan": "/images/user/dinkes.png",
    "Dinas Sosial": "/images/user/dinsos.svg",
    "Kepala Camat": "/images/user/kepala_desa_kec.png",
    "Kepala Desa": "/images/user/kepala_desa_kec.png",
    "TPG": "/images/user/tpg.png",
    "Ketua Kader": "/images/user/ketua_kader.png",
    "Kader": "/images/user/anggota_kader.png",
  };

  const imageSrc = roleImageMap[roleUser || "/images/user/user-03.png"];

  // Efek untuk menangani auto logout setelah periode tidak aktif
  useEffect(() => {
    let logoutTimer: any;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(handleLogout, AUTO_LOGOUT_TIME);
    };

    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    activityEvents.forEach((event) =>
      document.addEventListener(event, resetTimer),
    );

    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      activityEvents.forEach((event) =>
        document.removeEventListener(event, resetTimer),
      );
    };
  }, [handleLogout]);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 focus:outline-none"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span className="h-10 w-10 rounded-full">
          <Image
            width={190}
            height={190}
            src={imageSrc}
            alt="User"
            style={{ width: "auto", height: "auto" }}
            className="overflow-hidden rounded-full"
          />
        </span>

        {/* Nama pengguna dan role tetap ditampilkan di semua ukuran layar */}
        <span className="hidden items-center gap-1 font-medium text-dark dark:text-dark-6 md:flex">
          <div>
            <span className="block">{namaLengkap}</span>
            <span className="block text-sm text-left">{roleUser}</span>

          </div>
          <svg
            className={`fill-current duration-200 ease-in ${dropdownOpen ? "rotate-180" : ""}`}
            width="20"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.6921 7.09327C3.91674 6.83119 4.3113 6.80084 4.57338 7.02548L9.99997 11.6768L15.4266 7.02548C15.6886 6.80084 16.0832 6.83119 16.3078 7.09327C16.5325 7.35535 16.5021 7.74991 16.24 7.97455L10.4067 12.9745C10.1727 13.1752 9.82728 13.1752 9.59322 12.9745L3.75989 7.97455C3.49781 7.74991 3.46746 7.35535 3.6921 7.09327Z"
              fill=""
            />
          </svg>
        </span>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-2 w-[280px] rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark sm:mt-7.5`}
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <span className="relative block h-10 w-10 rounded-full">
              <Image
                width={112}
                height={112}
                src={imageSrc}
                alt="User"
                style={{ width: "auto", height: "auto" }}
                className="overflow-hidden rounded-full"
              />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark"></span>
            </span>

            <span className="block">
              <span className="block font-medium text-dark dark:text-white">
                {namaLengkap}
              </span>
              <span className="block font-medium text-dark-5 dark:text-dark-6">
                {roleUser}
              </span>
            </span>
          </div>
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            <li>
              <Link
                href="/pengaturan/akun-saya"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
              >
                <IconUser className="h-5 w-5 fill-current" />
                Akun Saya
              </Link>
            </li>
          </ul>
          <div className="p-2.5">
            <button
              className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
              onClick={handleLogout}
            >
              <IconLogout className="h-5 w-5 fill-current" />
              Logout
            </button>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
