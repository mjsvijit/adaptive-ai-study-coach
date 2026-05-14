import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import styles from "./layout.module.css";
import GridShape from "@/src/component/common/GridShape";
import { ThemeProvider } from "@/src/context/ThemeContext";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //  const token = true

  //   if (token) {
  //     redirect("/"); // or "/(auth)/signin" depending on your routes
  //   }
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          <div
            className={`lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden ${styles["bgimage"]}`}
          >
            <div className="relative items-center justify-center  flex z-1">
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    // className="dark:hidden"
                    src="/logo.png"
                    alt="Logo"
                    width={300}
                    height={80}
                  />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  Delivering Trust. On Time. Every Time.
                </p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </ThemeProvider>
    </div>
  );
}
