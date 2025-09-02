import Image from "next/image";
import DropdownUser from "./DropdownUser";
import { IconMenu2 } from "@tabler/icons-react";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full border-b-[1px] border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 py-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hamburger Toggle BTN for mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="block lg:hidden"
            aria-label="Toggle sidebar"
          >
            <IconMenu2 className="h-6 w-6 text-dark dark:text-white" />
          </button>

          {/* Logo and Title - Visible on all screens but adjusted for mobile */}
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
                Dashboard
              </h1>
              <p className="hidden text-sm font-medium md:block">Puspadaya</p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {/* User Area */}
          <div className="flex items-center">
            <ul className="flex items-center">
              <DropdownUser />
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
