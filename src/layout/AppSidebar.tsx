"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { LuLayoutGrid } from "react-icons/lu";
import { MdGridView } from "react-icons/md";

// Icon size configuration - adjust this value to change all icon sizes
const ICON_SIZE = 20;

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  category?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    category?: string;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <MdGridView size={ICON_SIZE} />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <MdGridView size={ICON_SIZE} />,
    name: "Consignments",
    path: "/consignments",
  },
  {
    icon: <LuLayoutGrid size={ICON_SIZE} />,
    name: "Master Collection",
    subItems: [
      {
        name: "Agents",
        path: "/master-data/agents",
        category: "master:manage",
      },
      {
        name: "Consignees",
        path: "/master-data/consignees",
        category: "master:manage",
      },
      {
        name: "Suppliers",
        path: "/master-data/suppliers",
        category: "master:manage",
      },
      {
        name: "Ports",
        path: "/master-data/ports",
        category: "master:manage",
      },
    ],
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } =
    useSidebar();
  const pathname = usePathname();

  const getAllowedSubItems = (subItems: any[]) => {
    return subItems.filter((subItem) => true);
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others",
  ) => (
    <ul className="flex flex-col gap-1 sidebar-menu">
      {navItems.map((nav, index) => {
        // Permission check for top-level item if it has no subItems
        if (nav.path && nav.category) {
          return null;
        }

        // NAV WITH SUB ITEMS
        if (nav.subItems) {
          const allowedSubItems = getAllowedSubItems(nav.subItems);

          // 🚫 DO NOT RENDER <li> AT ALL if no child OR parent permission
          if (allowedSubItems.length === 0) {
            return null;
          }
          if (nav.category) {
            return null;
          }

          return (
            <li key={nav.name}>
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "1000px"
                        : "0px",
                    opacity:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? 1
                        : 0,
                  }}
                >
                  <ul className="pt-2 space-y-1 pl-4 ml-4 sub_menu">
                    {allowedSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item w-full text-left ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          } sub_menu_item`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        }

        // SINGLE NAV ITEM
        if (nav.path) {
          return (
            <li key={nav.name}>
              <Link
                href={nav.path!}
                className={`menu-item group ${
                  isActive(nav.path!)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path!)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            </li>
          );
        }

        return null;
      })}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
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

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    console.log("[AppSidebar] Toggling Submenu:", { index, menuType });
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu?.index === index &&
        prevOpenSubmenu?.type === menuType
      ) {
        return null;
      }
      return { index, type: menuType };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-brand-950 dark:bg-gray-900 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 shadow-sm 
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
        className={`flex bg-blue-950 shadow-lg ${
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
                src="/images/logo/olygers1.png"
                alt="Logo"
                width={160}
                height={40}
              />
              <Image
                className="hidden dark:block object-contain"
                src="/images/logo/olygers1.png"
                alt="Logo"
                width={160}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/olygers1.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar p-3">
        <nav>
          {/* <div className="flex flex-col gap-4"> */}
          {/* <div> */}
          {/* <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                } h4`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  // <HorizontaLDots />
                  <></>
                )}
              </h2> */}
          {renderMenuItems(navItems, "main")}
          {/* </div> */}

          {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          {/* </div> */}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
