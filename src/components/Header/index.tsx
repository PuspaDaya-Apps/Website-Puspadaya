import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full border-b-[1px] border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark md:px-14">
      <div className="flex flex-grow items-center justify-between px-4 py-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          {/* <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
          </Link> */}
        </div>

        <div className="hidden xl:block">
          <div>
            <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
              Dashboard
            </h1>
            <p className="font-medium">Puspadaya</p>
          </div>
        </div>

        <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:w-full lg:justify-between xl:w-auto xl:justify-normal">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <h1>Puspadaya</h1>
          </ul>

          {/* <!-- User Area --> */}
          <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:justify-between xl:w-auto xl:justify-normal">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              <DropdownNotification />
              <DropdownUser />
            </ul>
          </div>

          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
