// DashboardHeader.jsx (inside @/components/dashboard/global/DashboardHeader.jsx or similar)
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Plus,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  FolderKanban,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

const generateBreadcrumbs = (pathname) => {
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const breadcrumbs = [];
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    let title = segment.replace(/-/g, " "); // Replace hyphens for display
    title = title.charAt(0).toUpperCase() + title.slice(1); // Capitalize first letter

    // Special handling for dynamic segments like [type] or [id]
    // You might want to fetch actual campaign names here if needed,
    // or just display a placeholder for IDs.
    if (segment.startsWith("[") && segment.endsWith("]")) {
      title = "Details"; // Or some other generic term
    }

    breadcrumbs.push({
      title: title,
      href: currentPath,
    });
  });

  // You might want to add a base 'Home' or 'Dashboard' breadcrumb
  if (breadcrumbs[0]?.title !== "Dashboard") {
    breadcrumbs.unshift({ title: "Dashboard", href: "/dashboard" });
  }

  return breadcrumbs;
};

export function DashboardHeader({ title, description, actions }) {
  const pathname = usePathname();
  const dynamicBreadcrumbs = generateBreadcrumbs(pathname);
  const breadcrumbs = dynamicBreadcrumbs;

  // State for what the user is IMMEDIATELY typing in the input
  const [inputValue, setInputValue] = useState("");
  // State for the DEBOUNCED search query (used for filtering)
  const [searchQuery, setSearchQuery] = useState("");

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);

  const searchInputRef = useRef(null); // Used for debounce timeout
  const { setTheme, theme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  // Effect to fetch campaigns when session is available
  useEffect(() => {
    if (session?.user?.id) {
      const fetchCampaigns = async () => {
        setIsLoadingCampaigns(true);
        try {
          const response = await fetch("/api/firebase/get-campaigns");
          if (!response.ok) {
            throw new Error("Failed to fetch campaigns");
          }
          const data = await response.json();
          setAllCampaigns(data.campaigns || []);
          console.log("Fetched campaigns:", data.campaigns);
        } catch (error) {
          console.error("Error fetching campaigns:", error);
        } finally {
          setIsLoadingCampaigns(false);
        }
      };
      fetchCampaigns();
    }
  }, [session]);

  // Debounced function to update the actual searchQuery state
  const updateDebouncedSearchQuery = useCallback((value) => {
    if (searchInputRef.current) {
      clearTimeout(searchInputRef.current.debounceTimeout);
    }
    searchInputRef.current.debounceTimeout = setTimeout(() => {
      setSearchQuery(value);
    }, 300); // 300ms debounce
  }, []);

  // Effect to filter campaigns based on the DEBOUNCED searchQuery
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCampaigns([]);
      setIsSearchPopoverOpen(false);
      return;
    }

    if (!isLoadingCampaigns && allCampaigns.length > 0) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = allCampaigns
        .filter((campaign) => {
          const campaignName = campaign.campaignName?.toLowerCase() || "";
          const campaignType = campaign.campaignType?.toLowerCase() || "";
          return (
            campaignName.includes(lowerCaseQuery) ||
            campaignType.includes(lowerCaseQuery)
          );
        })
        .slice(0, 5);

      setFilteredCampaigns(results);
      // Only open popover if there are results AND the input is not empty (to avoid empty popover on initial load)
      setIsSearchPopoverOpen(results.length > 0);
      console.log("Filtered campaigns:", results);
    } else if (searchQuery.trim() !== "") {
      // If query exists but campaigns not loaded or empty, close popover
      setIsSearchPopoverOpen(false);
    }
  }, [searchQuery, allCampaigns, isLoadingCampaigns]);

  // Handle actual input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Update immediate input value
    updateDebouncedSearchQuery(value); // Schedule debounced update for search query
  };

  // Handle navigation to campaign details
  const handleCampaignSelect = (campaign) => {
    router.push(
      `/dashboard/campaigns/${
        campaign.platform === "Google Ads" ? "google-ads" : "facebook-ads"
      }/${campaign.id}`
    );
    setInputValue(""); // Clear immediate input value
    setSearchQuery(""); // Clear debounced search query
    setIsSearchPopoverOpen(false);
  };

  if (!session) {
    return null;
  }

  const notifications = [
    {
      id: 1,
      title: "New task assigned",
      description: "Website Redesign - Homepage mockup",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Project deadline approaching",
      description: "Mobile App Development due in 3 days",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Client message received",
      description: "Sarah Johnson sent a message",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 w-full top-0  shadow-sm">
      <div className="flex h-16 items-center gap-4 w-full px-6 ">
        <SidebarTrigger className="-ml-1 md:hidden" />

        <div className="flex-1 max-w-lg relative">
          <Popover
            open={isSearchPopoverOpen}
            onOpenChange={setIsSearchPopoverOpen}
          >
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef} // Attach ref to the Input
                  placeholder={
                    isLoadingCampaigns
                      ? "Loading campaigns..."
                      : "Search campaigns..."
                  }
                  value={inputValue} // Bind to immediate inputValue
                  onChange={handleInputChange} // Use new handler
                  className="pl-10 pr-4 rounded-full bg-muted  border-none focus-visible:ring-2 focus-visible:ring-primary"
                  disabled={isLoadingCampaigns}
                  // Optionally, add onFocus to open popover if input has value and results exist
                  onFocus={() => {
                    if (
                      inputValue.trim() !== "" &&
                      filteredCampaigns.length > 0
                    ) {
                      setIsSearchPopoverOpen(true);
                    }
                  }}
                />
                {isLoadingCampaigns && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0 mt-2"
              onOpenAutoFocus={(event) => event.preventDefault()} // Add this line
            >
              {isLoadingCampaigns && inputValue.trim() === "" ? (
                <div
                  className="flex items-center justify-center p-4 text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading
                  campaigns...
                </div>
              ) : filteredCampaigns.length > 0 ? (
                <div className="flex flex-col">
                  {filteredCampaigns.map((campaign) => (
                    <Button
                      key={campaign.id}
                      variant="ghost"
                      className="justify-start gap-2 py-2 px-4 rounded-none hover:bg-muted"
                      onClick={() => handleCampaignSelect(campaign)}
                    >
                      <FolderKanban className="h-4 w-4 text-muted-foreground" />
                      <span
                        className="truncate"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {campaign.campaignName}
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-auto"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {campaign.campaignType}
                      </Badge>
                    </Button>
                  ))}
                </div>
              ) : (
                <p
                  className="p-4 text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {inputValue.trim() === ""
                    ? "Start typing to search campaigns."
                    : "No campaigns found matching your query."}
                </p>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    Notifications
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Mark all read
                  </Button>
                </div>
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.unread ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {notification.title}
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {notification.description}
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border-2">
                  <AvatarImage
                    src={
                      session?.user?.image || "https://github.com/shadcn.png"
                    }
                    alt="User"
                  />
                  <AvatarFallback>
                    {session?.user?.name ? session.user.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel
                className="font-normal"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center px-6 pt-2 pb-4">
        <Breadcrumb className=" hidden md:flex ">
          <BreadcrumbList>
            {breadcrumbs.length > 0 ? (
              breadcrumbs.map((crumb, index) => (
                <div key={crumb.title} className="flex items-center">
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.title}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {(title || description || actions) && (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
              <p
                className="text-sm text-muted-foreground"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
    </div>
  );
}
