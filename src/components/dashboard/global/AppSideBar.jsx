// AppSidebar.jsx (inside @/components/dashboard/global/AppSidebar.jsx or similar)
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
  PlusIcon,
  Search,
  DollarSign,
  WholeWord,
  Binoculars,
  Minus,
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
} from "@/components/ui/sidebar"; // Assuming these are correctly styled shadcn-like components
import CreateCampaignDropdown from "../ui/create-campaign";

// You can add an icon for your app's logo here if you have one
// const AppLogo = ({ className }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     {/* Replace with your actual logo SVG */}
//     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
//     <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      // {
      //   title: "Analytics",
      //   url: "/dashboard/analytics",
      //   icon: BarChart3,
      // },
    ],
  },
  {
    title: "Google Ads",
    items: [
      {
        title: "Full Campaigns",
        url: "/dashboard/campaigns/google-ads",
        icon: FolderKanban,
      },
      {
        title: "Ad Copy",
        url: "/dashboard/google-tools/ad-copy",
        icon: WholeWord,
      },
      {
        title: "Keywords Research",
        url: "/dashboard/google-tools/keywords-research",
        icon: Binoculars,
      },
      {
        title: "Negative Keywords",
        url: "/dashboard/google-tools/negative-keywords",
        icon: Minus,
      },
      {
        title: "Budget Funnel",
        url: "/dashboard/",
        icon: DollarSign,
      },
      {
        title: "Problem Solving",
        url: "/dashboard/",
        icon: Search,
      },
      // {
      //   title: "Create",
      //   url: "/dashboard/create/google-ads",
      //   icon: PlusIcon,
      // },
      // {
      //   title: "Campaigns",
      //   url: "/dashboard/campaigns/google-ads",
      //   icon: Users,
      // },
      // {
      //   title: "Data Analysis",
      //   url: "/dashboard/analysis/google-ads",
      //   icon: BarChart3,
      // },
    ],
  },
  // {
  //   title: "Meta Ads",
  //   items: [
  //     {
  //       title: "Create",
  //       url: "/dashboard/create/meta-ads",
  //       icon: PlusIcon,
  //     },
  //     {
  //       title: "Campaigns",
  //       url: "/dashboard/campaigns/meta-ads", // Corrected this URL from google-ads
  //       icon: Users,
  //     },
  //     {
  //       title: "Data Analysis",
  //       url: "/dashboard/analysis/meta-ads", // Corrected this URL from google-ads
  //       icon: BarChart3,
  //     },
  //   ],
  // },
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
    // Adjusted styling for a cleaner look. bg-background, no explicit border on sidebar itself.
    // The pt-[65px] comes from DashboardLayout to clear the fixed header.
    <Sidebar {...props} className="bg-background ">
      <SidebarHeader className={"py-4 px-2"}>
        {/* Placeholder for a minimal logo or app name consistent with Gemini */}
        <Link
          href="/"
          className="flex items-center gap-2 px-2 py-4 justify-center"
        >
          {/* <AppLogo className="h-6 w-6 text-primary" /> */}{" "}
          {/* Uncomment and replace with your logo */}
          <h2
            className="text-4xl font-bold text-primary text-center"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Ad<span className="text-blue-500">Genius</span>
          </h2>{" "}
          {/* Example App Name */}
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto pt-4 pb-8">
        {navigation.map((section) => (
          <SidebarGroup key={section.title} className="mb-4">
            {/* Subtle group labels */}
            <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground ">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      // Cleaned up styles for active and hover states
                      className="group flex items-center gap-3 rounded-lg px-4 py-2 text-sm  transition-colors hover:bg-muted/60 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>{" "}
                        {item.title === "Budget Funnel" && (
                          <span className="bg-blue-500 text-[8px] p-[2px] rounded text-white">
                            Coming Soon
                          </span>
                        )}
                        {item.title === "Problem Solving" && (
                          <span className="bg-blue-500 text-[8px] p-[2px] rounded text-white">
                            Coming Soon
                          </span>
                        )}
                        {/* Use Inter for navigation items */}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/* SidebarRail for collapsible functionality (assuming it's handled by your ui/sidebar components) */}
      <SidebarRail />
    </Sidebar>
  );
}
