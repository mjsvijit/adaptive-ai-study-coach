"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faBox,
  faListCheck,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

// Icon size configuration - adjust this value to change all icon sizes
const ICON_SIZE = 20;

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <FontAwesomeIcon icon={faBorderAll} width={ICON_SIZE} />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <FontAwesomeIcon icon={faListCheck} width={ICON_SIZE} />,
    name: "Study Goals",
    path: "/goals",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } =
    useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Clear cookies
      const now = new Date();
      const formatted = now.toUTCString();
      document.cookie = `auth_token=; path=/; expires=${formatted}`;

      // Clear local storage
      localStorage.clear();

      // Redirect to signin
      router.push("/signin");
    }
  };

  const isActive = useCallback(
    (path: string) => {
      if (!pathname || !path) return false;
      const normalizedPathname = pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;
      const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
      return normalizedPathname === normalizedPath;
    },
    [pathname],
  );

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1 sidebar-menu">
      {items.map((nav) => (
        <li key={nav.name} className="p-3">
          <Link
            href={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            }`}
          >
            <span
              className={`${
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              } text-white`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text text-white">{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-[72px] flex flex-col lg:mt-0 top-0 left-0 bg-brand-950 dark:bg-gray-900 text-gray-900 h-[calc(100dvh-72px)] lg:h-screen transition-all duration-300 ease-in-out z-50 shadow-sm 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div
        className={`hidden lg:flex bg-blue-950 shadow-lg ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link
          href="/"
          className="w-full flex justify-center align-center h-[72px] brightness-0 invert"
        >
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden object-contain"
                src="/ailogo.png"
                alt="Logo"
                width={160}
                height={40}
              />
              <Image
                className="hidden dark:block object-contain"
                src="/ailogo.png"
                alt="Logo"
                width={160}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/ailogo.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto duration-300 ease-linear no-scrollbar p-3">
        <nav className="flex-grow">{renderMenuItems(navItems)}</nav>

        {/* Logout Button */}
        <div className="mt-auto pb-4">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isExpanded || isHovered || isMobileOpen
                ? "justify-center gap-4"
                : "justify-center"
            } px-4 py-3 w-full text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-200 group`}
          >
            <span className="flex items-center justify-center min-w-[20px]">
              <FontAwesomeIcon icon={faSignOutAlt} width={ICON_SIZE} />
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text font-bold">Log Out</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
