import Link from "next/link";
import { usePathname } from "next/navigation";

interface DropdownItem {
  route: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarDropdownProps {
  item: DropdownItem[];
  isFlyout?: boolean;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ item, isFlyout = false }) => {
  const pathname = usePathname();

  return (
    <div
      className={`flex flex-col ${isFlyout
        ? "absolute top-0 left-full ml-2 w-48 rounded-md bg-white shadow-lg dark:bg-gray-dark z-20"
        : "mt-2"
        }`}
    >
      {item.map((dropdownItem, index) => {
        const isActive = pathname.startsWith(dropdownItem.route);
        return (
          <Link
            key={index}
            href={dropdownItem.route}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out w-full ${isActive
              ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
              : "text-dark-4 hover:bg-gray-200 hover:text-dark dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
          >
            {dropdownItem.icon && <span className="flex-shrink-0">{dropdownItem.icon}</span>}
            <span className="flex-grow">{dropdownItem.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarDropdown;
