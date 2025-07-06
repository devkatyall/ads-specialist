"use client";

import {
  Calendar,
  FolderKanban,
  Home,
  Settings,
  Users,
  Building2,
  BarChart3,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import CreateCampaignDropdown from "../ui/create-campaign";

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Ad Strategies",
    items: [
      {
        title: "Google Ads",
        url: "/dashboard/campaigns/google-ads",
        icon: FolderKanban,
      },
      {
        title: "Facebook Ads",
        url: "/dashboard/campaigns/facebook-ads",
        icon: Calendar,
      },
      // {
      //   title: "Time Tracking",
      //   url: "/dashboard/time-tracking",
      //   icon: Clock,
      // },
    ],
  },

  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader className={"my-4"}>
        <CreateCampaignDropdown className="w-full" />
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
