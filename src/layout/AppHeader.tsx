"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RiMenuUnfold3Line, RiMenuUnfold4Line } from "react-icons/ri";
import { useSidebar } from "../context/SidebarContext";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar, isExpanded } =
    useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 flex items-center w-full z-99 dark:bg-gray-900 bg-brand-900 h-[72px] shadow-sm">
      <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors z-99 dark:text-gray-400"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isExpanded || isMobileOpen ? (
              <RiMenuUnfold4Line size={24} />
            ) : (
              <RiMenuUnfold3Line size={24} />
            )}
          </button>

          <Link href="/" className="lg:hidden flex items-center">
            <Image
              width={140}
              height={32}
              className="dark:hidden object-contain"
              src="/ailogo.png"
              alt="Logo"
            />
            <Image
              width={140}
              height={32}
              className="hidden dark:block object-contain"
              src="/ailogo.png"
              alt="Logo"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4"></div>
      </div>
    </header>
  );
};

export default AppHeader;
