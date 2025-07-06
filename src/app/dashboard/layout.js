import { AppSidebar } from "@/components/dashboard/global/AppSideBar";
import { DashboardHeader } from "@/components/dashboard/global/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Providers } from "../providers";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <Providers session={session}>
      <SidebarProvider>
        <div className="flex min-h-screen max-h-full w-screen flex-col">
          <DashboardHeader />
          <div className="flex flex-1 overflow-hidden z-0">
            <AppSidebar className="z-[1] pt-[65px]" />
            <SidebarInset className="flex-1 h-full">
              <main className="min-h-screen bg-gray-50">
                <div className="p-6  mx-auto">{children}</div>
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
