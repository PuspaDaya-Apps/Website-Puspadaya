import ClickOutside from "@/components/ClickOutside";
import { IconSettings } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2"
        href="#"
      >
        
        <span className="h-10 w-10 rounded-full">
          <Image
            width={190}
            height={190}
            src="/images/user/user-03.png"
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
            className="overflow-hidden rounded-full"
          />
        </span>

        <span className="flex items-center gap-1 font-medium text-dark dark:text-dark-6">
          <span className="hidden lg:block">Jhon Smith</span>

          <svg
            className={`fill-current duration-200 ease-in ${dropdownOpen && "rotate-180"}`}
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

      </Link>

      {/* <!-- Dropdown Star --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <span className="relative block h-10 w-10 rounded-full">
              <Image
                width={112}
                height={112}
                src="/images/user/user-03.png"
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
                className="overflow-hidden rounded-full"
              />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark"></span>
            </span>

            <span className="block">
              <span className="block font-medium text-dark dark:text-white">
                Jhon Smith
              </span>
              <span className="block font-medium text-dark-5 dark:text-dark-6">
                jonson@nextadmin.com
              </span>
            </span>
          </div>
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            <li>
              <Link
                href="/pengaturan/akun-saya"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.99998 0.9375C7.03246 0.9375 5.43748 2.53249 5.43748 4.5C5.43748 6.46751 7.03246 8.0625 8.99998 8.0625C10.9675 8.0625 12.5625 6.46751 12.5625 4.5C12.5625 2.53249 10.9675 0.9375 8.99998 0.9375ZM6.56248 4.5C6.56248 3.15381 7.65378 2.0625 8.99998 2.0625C10.3462 2.0625 11.4375 3.15381 11.4375 4.5C11.4375 5.84619 10.3462 6.9375 8.99998 6.9375C7.65378 6.9375 6.56248 5.84619 6.56248 4.5Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.99998 9.1875C7.26482 9.1875 5.66617 9.58191 4.48157 10.2483C3.31459 10.9047 2.43748 11.8995 2.43748 13.125L2.43743 13.2015C2.43658 14.0729 2.43552 15.1665 3.39479 15.9477C3.86689 16.3321 4.52734 16.6055 5.41964 16.7861C6.31442 16.9672 7.48065 17.0625 8.99998 17.0625C10.5193 17.0625 11.6855 16.9672 12.5803 16.7861C13.4726 16.6055 14.1331 16.3321 14.6052 15.9477C15.5644 15.1665 15.5634 14.0729 15.5625 13.2015L15.5625 13.125C15.5625 11.8995 14.6854 10.9047 13.5184 10.2483C12.3338 9.58191 10.7351 9.1875 8.99998 9.1875ZM3.56248 13.125C3.56248 12.4865 4.02851 11.7939 5.03311 11.2288C6.02008 10.6736 7.42143 10.3125 8.99998 10.3125C10.5785 10.3125 11.9799 10.6736 12.9668 11.2288C13.9714 11.7939 14.4375 12.4865 14.4375 13.125C14.4375 14.1059 14.4072 14.658 13.8948 15.0753C13.6169 15.3016 13.1523 15.5225 12.3571 15.6835C11.5644 15.8439 10.4806 15.9375 8.99998 15.9375C7.51931 15.9375 6.43553 15.8439 5.64282 15.6835C4.84762 15.5225 4.38307 15.3016 4.10517 15.0753C3.59271 14.658 3.56248 14.1059 3.56248 13.125Z"
                    fill=""
                  />
                </svg>
                Akun Saya
              </Link>
            </li>

          </ul>
          <div className="p-2.5">
            <button className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base">
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1815_13085)">
                  <path
                    d="M11.209 0.9375C10.1833 0.937485 9.35657 0.937473 8.70635 1.02489C8.03127 1.11566 7.46286 1.30983 7.01142 1.76126C6.61773 2.15496 6.4188 2.63877 6.31437 3.20727C6.2129 3.75969 6.19349 4.43572 6.18897 5.24687C6.18724 5.55753 6.43768 5.81076 6.74833 5.81249C7.05899 5.81422 7.31223 5.56379 7.31396 5.25313C7.31852 4.43301 7.33982 3.8517 7.42086 3.41051C7.49895 2.9854 7.62433 2.73935 7.80692 2.55676C8.01449 2.34919 8.30592 2.21385 8.85625 2.13986C9.42276 2.0637 10.1736 2.0625 11.2502 2.0625H12.0002C13.0767 2.0625 13.8276 2.0637 14.3941 2.13986C14.9444 2.21385 15.2358 2.34919 15.4434 2.55676C15.651 2.76433 15.7863 3.05576 15.8603 3.60609C15.9365 4.1726 15.9377 4.92344 15.9377 6V12C15.9377 13.0766 15.9365 13.8274 15.8603 14.3939C15.7863 14.9442 15.651 15.2357 15.4434 15.4432C15.2358 15.6508 14.9444 15.7862 14.3941 15.8601C13.8276 15.9363 13.0767 15.9375 12.0002 15.9375H11.2502C10.1736 15.9375 9.42276 15.9363 8.85625 15.8601C8.30592 15.7862 8.01449 15.6508 7.80692 15.4432C7.62433 15.2607 7.49895 15.0146 7.42086 14.5895C7.33982 14.1483 7.31852 13.567 7.31396 12.7469C7.31223 12.4362 7.05899 12.1858 6.74833 12.1875C6.43768 12.1892 6.18724 12.4425 6.18897 12.7531C6.19349 13.5643 6.2129 14.2403 6.31437 14.7927C6.4188 15.3612 6.61773 15.845 7.01142 16.2387C7.46286 16.6902 8.03127 16.8843 8.70635 16.9751C9.35657 17.0625 10.1833 17.0625 11.209 17.0625H12.0413C13.067 17.0625 13.8937 17.0625 14.544 16.9751C15.2191 16.8843 15.7875 16.6902 16.2389 16.2387C16.6903 15.7873 16.8845 15.2189 16.9753 14.5438C17.0627 13.8936 17.0627 13.0668 17.0627 12.0412V5.95885C17.0627 4.93316 17.0627 4.10641 16.9753 3.45619C16.8845 2.78111 16.6903 2.2127 16.2389 1.76126C15.7875 1.30983 15.2191 1.11566 14.544 1.02489C13.8938 0.937473 13.067 0.937485 12.0413 0.9375H11.209Z"
                    fill=""
                  />
                  <path
                    d="M11.25 8.4375C11.5607 8.4375 11.8125 8.68934 11.8125 9C11.8125 9.31066 11.5607 9.5625 11.25 9.5625H3.02058L4.49107 10.8229C4.72694 11.0251 4.75426 11.3802 4.55208 11.6161C4.34991 11.8519 3.9948 11.8793 3.75893 11.6771L1.13393 9.42708C1.00925 9.32022 0.9375 9.16421 0.9375 9C0.9375 8.83579 1.00925 8.67978 1.13393 8.57292L3.75893 6.32292C3.9948 6.12074 4.34991 6.14806 4.55208 6.38393C4.75426 6.6198 4.72694 6.97491 4.49107 7.17708L3.02058 8.4375H11.25Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1815_13085">
                    <rect width="18" height="18" rx="5" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
