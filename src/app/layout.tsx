import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css"; // optional
// import RouteWatcher from "@/components/route-watcher";
import { ThemeProvider } from "../context/ThemeContext";
import { SidebarProvider } from "../context/SidebarContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oligers Cargo",
  description: "Oligers Cargo - Cargo Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} dark:bg-gray-900`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {/* <RouteWatcher /> */}
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
