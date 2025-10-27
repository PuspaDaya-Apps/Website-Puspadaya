"use client";
import ClickOutside from "@/components/ClickOutside";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    menuItems: [


      {
        icon: (
          <Image
            src="/images/menus/dashboard.svg"
            alt=""
            width={16}
            height={16}
            className="fill-current"
          />
        ),
        label: "Dashboard",
        route: "/",
      },

      {
        icon: (
          <Image
            src="/images/menus/daftar-hadir.svg"
            alt=""
            width={16}
            height={16}
            className="fill-current"
          />
        ),
        label: "Kuisioner",
        route: "/kuisioner-ibuhamil",
      },

      {
        icon: (
          <Image
            src="/images/menus/pengaturan.svg"
            alt=""
            width={16}
            height={16}
            className="fill-current"
          />
        ),
        label: "Pengaturan",
        route: "#",
        children: [
          {
            icon: (
              <Image
                src="/images/menus/user.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),

            label: "Akun Saya",
            route: "/pengaturan/akun-saya",
          },
          {
            icon: (
              <Image
                src="/images/menus/kebijakan-aplikasi.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Kebijakan Aplikasi",
            route: "/pengaturan/kebijakan-aplikasi",
          },

        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState("");

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const resetActiveMenu = () => {
    setPageName("defaultPageName");
  };

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      {/* Overlay (background blur) */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-12 z-50 h-full w-64 border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:static lg:translate-x-0`}
      >
        <div className="no-scrollbar h-full overflow-y-auto duration-300 ease-linear">
          <nav className="flex flex-col items-start justify-start gap-2 p-4">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="w-full">
                <ul>
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <li key={menuIndex} className="w-full">
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                        isOpen={openDropdown === menuItem.label.toLowerCase()}
                        setIsOpen={setOpenDropdown}
                        resetActiveMenu={resetActiveMenu}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>

  );
};
export default Sidebar;
