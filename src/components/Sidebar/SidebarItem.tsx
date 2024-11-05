import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

interface SidebarItemProps {
  item: {
    route: string;
    label: string;
    icon: React.ReactNode;
    message?: string;
    pro?: boolean;
    children?: { route: string; label: string; pro?: boolean }[];
  };
  pageName: string;
  setPageName: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: (arg: string) => void;
  resetActiveMenu: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  pageName,
  setPageName,
  isOpen,
  setIsOpen,
  resetActiveMenu,
}) => {
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActiveChild = item.children?.some((child) => {
    if (child.route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(child.route);
  });

  const isActiveMenu = pageName === item.label.toLowerCase() || isActiveChild;

  const handleClick = () => {
    resetActiveMenu();
    if (isOpen) {
      setIsOpen("");
    } else {
      setPageName(item.label.toLowerCase());
      setIsOpen(item.label.toLowerCase());
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen("");
        resetActiveMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen, resetActiveMenu]);

  return (
    <li className="relative flex flex-col">
      <Link
        href={item.route}
        onClick={handleClick}
        className={`group flex items-center gap-2 rounded-md px-3 py-2 font-medium transition duration-300 ease-in-out ${
          isActiveMenu
            ? "bg-primary/[.07] text-primary"
            : "text-black hover:bg-gray-200 hover:text-dark dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-white"
        }`}
        aria-current={
          pageName === item.label.toLowerCase() ? "page" : undefined
        }
      >
        {item.icon}
        {/* size fount */}
        <span className="text-[16px]">{item.label}</span>
        {item.message && (
          <span className="ml-2 rounded-full bg-red-500 px-1.5 py-px text-xs font-medium text-white">
            {item.message}
          </span>
        )}
        {item.pro && (
          <span className="ml-2 rounded-md bg-primary px-1.5 py-px text-xs font-medium text-white">
            Pro
          </span>
        )}
        {item.children && (
          <svg
            className={`ml-auto fill-current transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5525 7.72801C10.81 7.50733 11.1899 7.50733 11.4474 7.72801L17.864 13.228C18.1523 13.4751 18.1857 13.9091 17.9386 14.1974C17.6915 14.4857 17.2575 14.5191 16.9692 14.272L10.9999 9.15549L5.03068 14.272C4.7424 14.5191 4.30838 14.4857 4.06128 14.1974C3.81417 13.9091 3.84756 13.4751 4.13585 13.228L10.5525 7.72801Z"
              fill=""
            />
          </svg>
        )}
      </Link>

      {item.children && isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 z-10 mt-10 w-46 rounded-md bg-white shadow-lg`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
