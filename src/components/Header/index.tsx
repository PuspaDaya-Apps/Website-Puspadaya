import Image from "next/image";
import DropdownUser from "./DropdownUser";
import { IconMenu2, IconMenuDeep } from "@tabler/icons-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const handleToggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSidebarOpen(!sidebarOpen); // toggle buka/tutup
  };

  return (
    <header className="sticky top-0 z-50 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-3 py-2 md:px-5 md:py-2 2xl:px-10">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* === Burger Button (mobile only) === */}
          <button
            onClick={handleToggleSidebar}
            className="block lg:hidden transition-transform duration-300"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <IconMenuDeep className="h-6 w-6 text-dark dark:text-white transition-all duration-300" />
            ) : (
              <IconMenu2 className="h-6 w-6 text-dark dark:text-white transition-all duration-300" />
            )}
          </button>

          {/* === Logo & Title === */}
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo/logo-puspa.png"
              alt="Logo"
              width={40}
              height={40}
              className="fill-current md:w-[55px] md:h-[55px]"
            />
            <div className="hidden sm:block">
              <h1 className="mb-0.5 text-lg font-bold text-dark dark:text-white md:text-heading-5">
                Puspadaya
              </h1>
              <p className="hidden text-sm font-medium md:block">Dashboard</p>
            </div>
          </div>
        </div>

        {/* === User Dropdown === */}
        <div className="flex items-center relative z-[1000]">
          <ul className="flex items-center relative">
            <DropdownUser />
          </ul>
        </div>


      </div>
    </header>
  );
};

export default Header;
