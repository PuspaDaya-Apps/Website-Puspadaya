"use client";
import ClickOutside from "@/components/ClickOutside";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
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
          <img
            src="/images/menus/dashboard.svg"
            alt=""
            width={16}
            height={16}
            className="fill-current"
          />
        ),
        label: "Dashboard",
        route: "#",
        children: [
          {

            label: "eCommerce", route: "/"
          },
        ],
      },


      {
        icon: (
          <img
            src="/images/menus/keluarga.svg"
            alt=""
            width={16}
            height={16}
            className="fill-current"
          />
        ),
        label: "Data Keluarga",
        route: "#",
        children: [
          {
            icon: (
              <img
                src="/images/menus/orgtua.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Data Orang Tua",
            route: "/data-keluarga/data-orang-tua"
          },
          {
            icon: (
              <img
                src="/images/menus/balita.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Data Balita",
            route: "/data-keluarga/data-balita"
          },

          {
            icon: (
              <img
                src="/images/menus/ibu-hamil.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Data Ibu Hamil",
            route: "/data-keluarga/data-bumil"
          },
        ],
      },

      {
        icon: (
          <img
            src="/images/menus/pengukuran.svg"
            alt=""
            width={16}
            height={16}
            className="fill-current"
          />
        ),
        label: "Pemeriksaan",
        route: "#",
        children: [
          {
            icon: (
              <img
                src="/images/menus/pemeriksaan.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Pemeriksaan Balita",  route: "/pemeriksaan/pemeriksaan-balita"
          },



          {
            icon: (
              <img
                src="/images/menus/rekap.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Rekap Pemeriksaan", route: "/pemeriksaan/rekap-pemeriksaan"
          },
          {
            icon: (
              <img
                src="/images/menus/riwayat.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Riwayat Pemeriksaan", route: "/pemeriksaan/riwayat-pemeriksaan"
          },
          {
            icon: (
              <img
                src="/images/menus/jadwal.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Jadwal Pemeriksaan",  route: "/pemeriksaan/jadwal-pemeriksaan"
          },
        ],
      },

      {
        icon: (
          <img
            src="/images/menus/monitoring.svg"
            alt=""
            width={16}
            height={16}
            className="fill-current"
          />
        ),
        label: "Monitoring",
        route: "#",
        children: [
          {
            icon: (
              <img
                src="/images/menus/parameter.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),

            label: "Parameter Stunting", route: "/monitoring/parameter-stunting"
          },

          {
            icon: (
              <img
                src="/images/menus/status-monitoring.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Monitoring Stunting",route: "/monitoring/monitoring-stunting"
          },

          {
            icon: (
              <img
                src="/images/menus/status-monitoring.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Monitoring Gizi", route: "/monitoring/monitoring-gizi"
          },
        ],
      },

      {
        icon: (
          <img
            src="/images/menus/posyandu.svg"
            alt=""
            width={16}
            height={16}
            className="fill-current"
          />
        ),
        label: "Posyandu",
        route: "#",
        children: [

          {
            icon: (
              <img
                src="/images/menus/daftar-hadir.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Data Posyandu", route: "/posyandu/data-posyandu"
          },

          {
            icon: (
              <img
                src="/images/menus/daftar-hadir.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Daftar Hadir", route: "/posyandu/daftar-hadir"
          },

          {
            icon: (
              <img
                src="/images/menus/tambah-akun.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Tambah Akun", route: "/posyandu/tambah-akun"
          },


          {
            icon: (
              <img
                src="/images/menus/data-anggota.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Data Anggota", route: "/posyandu/data-anggota"
          },
        ],
      },


      {
        icon: (
          <img
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
              <img
                src="/images/menus/user.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),

            label: "Profile", route: "/pengaturan/profile"
          },
          {
            icon: (
              <img
                src="/images/menus/kebijakan-aplikasi.svg"
                alt=""
                width={14}
                height={14}
                className="fill-current"
              />
            ),
            label: "Kebijakan Aplikasi", route: "/pengaturan/kebijakan-aplikasi"
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

      <aside
        className={`sticky left-0 top-0 z-9999 border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${sidebarOpen
          ? "translate-x-0 duration-300 ease-linear"
          : "-translate-x-full"
          }`}
      >

        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className=" items-center justify-normal gap-2 lg:w-full xl:w-auto xl:justify-normal">

            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="flex items-center ">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <li key={menuIndex} className="flex-1 p-2">
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
          {/* <!-- Sidebar Menu --> */}
        </div>


      </aside>

    </ClickOutside>
  );


};
export default Sidebar;