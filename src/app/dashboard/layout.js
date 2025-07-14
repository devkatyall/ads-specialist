// src/app/dashboard/layout.jsx (or your path to this file)

import { AppSidebar } from "@/components/dashboard/global/AppSideBar";
import { DashboardHeader } from "@/components/dashboard/global/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Providers } from "../providers";
import { Inter, Poppins } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import "./../dashboard/dashboard.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"], // Common weights for body/UI text
  variable: "--font-inter", // Still define variable for CSS fallback/customization
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"], // Common weights for headings
  variable: "--font-poppins", // Still define variable for CSS customization
});

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <Providers session={session}>
      {/* Apply both font variables to a high-level element like SidebarProvider */}
      {/* This makes --font-inter and --font-poppins available to all child components */}
      <SidebarProvider className={`${inter.variable} ${poppins.variable}`}>
        {/*
          The main layout container.
          Apply grid here:
          - grid-cols-[auto_1fr] means:
            - The first column will take exactly the width of its content (AppSidebar).
            - The second column (the main content area) will take the rest of the available space (1fr).
          - min-h-screen ensures the grid takes full viewport height.
        */}
        <div className="grid min-h-screen max-h-full w-screen md:grid-cols-[auto_1fr] grid-cols-1">
          {/* Sidebar */}
          {/* AppSidebar might still need pl-4 if it's pushing its content. */}
          {/* The key is that the grid column will size itself to the sidebar's total width. */}
          <AppSidebar className="z-[10] md:static md:translate-x-0 md:h-auto md:w-auto" />
          {/*
            Main Content Wrapper:
            This div now represents the second column in our grid.
            It contains both the DashboardHeader and the main content area.
          */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* DashboardHeader no longer needs pl-[15vw] */}
            <DashboardHeader />
            <SidebarInset className="flex-1 h-full">
              <main className={` bg-gray-100 ${inter.className} z-0`}>
                <div className=" mx-auto ">{children}</div>
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
