import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { SidebarProvider } from "../context/SidebarContext";
import "../lib/fontawsome";

export const metadata: Metadata = {
  title: "Adaptive AI Study Coach",
  description: "Your personalized AI study partner, goal tracker, and organizer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="font-sans dark:bg-gray-900"
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
