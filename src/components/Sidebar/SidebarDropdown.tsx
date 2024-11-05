import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <div className="mt-2 flex flex-col">
      {item.map((dropdownItem: any, index: number) => (
        <Link
          key={index}
          href={dropdownItem.route}
          // ukuran font chuldern
          className={`flex items-center rounded-md px-3 py-2 text-sm font-medium  transition duration-300 ease-in-out ${
            pathname.startsWith(dropdownItem.route)
              ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
              : "text-dark-4 hover:bg-gray-200 hover:text-dark dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-white"
          }`}
        >
          {dropdownItem.icon && (
            <span className="mr-2 flex-shrink-0">{dropdownItem.icon}</span>
          )}
          <span className="flex-grow">{dropdownItem.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default SidebarDropdown;
