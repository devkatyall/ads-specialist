"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  MoreHorizontal,
  Target,
  Globe,
  ShoppingCart,
  Play,
  Smartphone,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const campaignTypeIcons = {
  search: Target,
  display: Globe,
  shopping: ShoppingCart,
  video: Play,
  app: Smartphone,
  pmax: TrendingUp,
};

const campaignTypeNames = {
  search: "Search",
  display: "Display",
  shopping: "Shopping",
  video: "Video",
  app: "App",
  pmax: "Performance Max",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/firebase/get-campaigns");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaigns. Please try again.");
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const getFilterCounts = () => {
    const counts = {
      all: campaigns.length,
      search: campaigns.filter((c) => c.campaignType === "search").length,
      display: campaigns.filter((c) => c.campaignType === "display").length,
      shopping: campaigns.filter((c) => c.campaignType === "shopping").length,
      video: campaigns.filter((c) => c.campaignType === "video").length,
      pmax: campaigns.filter((c) => c.campaignType === "pmax").length,
    };
    return counts;
  };

  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const matchesSearch =
        campaign.campaignName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        campaign.campaignType
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        campaign.objective?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab =
        selectedTab === "all" || campaign.campaignType === selectedTab;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === "createdAt") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatBudget = (budget, currency = "USD") => {
    if (!budget) return "N/A";
    return `${currency} ${budget}/day`;
  };

  const handleCampaignAction = async (action, campaignId) => {
    switch (action) {
      case "view":
        // Navigate to campaign details
        window.location.href = `/dashboard/campaigns/google-ads/${campaignId}`;
        break;
      case "edit":
        // Navigate to edit campaign
        toast.info("Opening campaign editor...");
        break;
      case "duplicate":
        toast.info("Duplicating campaign...");
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this campaign?")) {
          toast.info("Deleting campaign...");
        }
        break;
      default:
        break;
    }
  };

  const exportCampaigns = () => {
    const csvContent = [
      ["Name", "Type", "Status", "Budget", "Created", "Objective"].join(","),
      ...filteredCampaigns.map((campaign) =>
        [
          campaign.campaignName || "",
          campaignTypeNames[campaign.campaignType] ||
            campaign.campaignType ||
            "",
          campaign.status || "",
          formatBudget(campaign.budget, campaign.currency),
          formatDate(campaign.createdAt),
          campaign.objective || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Campaigns exported successfully!");
  };

  const filterCounts = getFilterCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Google Ads Campaigns
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your AI-generated advertising campaigns
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportCampaigns}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Link href="/dashboard/create/google-ads">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All Campaigns
              <Badge variant="secondary" className="ml-1">
                {filterCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Target className="h-3 w-3" />
              Search
              <Badge variant="secondary" className="ml-1">
                {filterCounts.search}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              Display
              <Badge variant="secondary" className="ml-1">
                {filterCounts.display}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex items-center gap-2">
              <ShoppingCart className="h-3 w-3" />
              Shopping
              <Badge variant="secondary" className="ml-1">
                {filterCounts.shopping}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pmax" className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              Performance Max
              <Badge variant="secondary" className="ml-1">
                {filterCounts.pmax}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search campaigns by name or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("campaignName")}>
                  Name{" "}
                  {sortField === "campaignName" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                  Date{" "}
                  {sortField === "createdAt" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("status")}>
                  Status{" "}
                  {sortField === "status" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("budget")}>
                  Budget{" "}
                  {sortField === "budget" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value={selectedTab} className="mt-6">
            <Card className={"p-0"}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4">#</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Ad Groups</TableHead>
                    <TableHead className="px-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <Target className="h-12 w-12 text-gray-400" />
                          <div>
                            <p className="text-gray-500 font-medium">
                              No campaigns found
                            </p>
                            <p className="text-gray-400 text-sm">
                              {searchTerm
                                ? "Try adjusting your search terms"
                                : "Create your first campaign to get started"}
                            </p>
                          </div>
                          {!searchTerm && (
                            <Link href="/dashboard/campaigns/google-ads/create">
                              <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Campaign
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((campaign, index) => {
                      const CampaignIcon =
                        campaignTypeIcons[campaign.campaignType] || Target;
                      return (
                        <TableRow
                          key={campaign.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium text-gray-500 px-4 ">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <CampaignIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <button
                                  onClick={() =>
                                    handleCampaignAction("view", campaign.id)
                                  }
                                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
                                >
                                  {campaign.campaignName || "Untitled Campaign"}
                                </button>
                                <p className="text-sm text-gray-500">
                                  ID: {campaign.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {campaignTypeNames[campaign.campaignType] ||
                                campaign.campaignType ||
                                "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">
                                {formatBudget(
                                  campaign.budget,
                                  campaign.currency
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {campaign.answers?.location || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {formatDate(campaign.createdAt)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {campaign.generatedAssets?.adGroups?.length || 0}{" "}
                              groups
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCampaignAction("view", campaign.id)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCampaignAction("edit", campaign.id)
                                  }
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Campaign
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCampaignAction(
                                      "duplicate",
                                      campaign.id
                                    )
                                  }
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCampaignAction("delete", campaign.id)
                                  }
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
