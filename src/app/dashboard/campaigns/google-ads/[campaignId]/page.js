"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Target,
  Globe,
  ShoppingCart,
  Play,
  Smartphone,
  TrendingUp,
  DollarSign,
  MapPin,
  Users,
  Copy,
  Download,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import CampaignResults from "@/components/dashboard/global/CampaignResults";

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

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.campaignId) {
      fetchCampaign(params.campaignId);
    }
  }, [params.campaignId]);

  const fetchCampaign = async (campaignId) => {
    try {
      setLoading(true);
      const response = await fetch("/api/firebase/get-campaigns");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const foundCampaign = data.campaigns?.find((c) => c.id === campaignId);

      if (!foundCampaign) {
        setError("Campaign not found");
        return;
      }

      setCampaign(foundCampaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setError("Failed to load campaign. Please try again.");
      toast.error("Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (budget, currency = "USD") => {
    if (!budget) return "N/A";
    return `${currency} ${budget}/day`;
  };

  const handleCampaignAction = async (action) => {
    switch (action) {
      case "edit":
        toast.info("Opening campaign editor...");
        // Navigate to edit page
        break;
      case "duplicate":
        toast.info("Duplicating campaign...");
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this campaign?")) {
          toast.info("Deleting campaign...");
          // After deletion, redirect to campaigns list
          // router.push("/campaigns")
        }
        break;
      case "export":
        toast.success("Campaign data exported!");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Campaign Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The campaign you're looking for doesn't exist."}
            </p>
            <Button onClick={() => router.push("/campaigns")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const CampaignIcon = campaignTypeIcons[campaign.campaignType] || Target;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/campaigns/google-ads")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {campaign.campaignName}
              </h1>
              <p className="text-gray-600 mt-1">
                Campaign Details & Generated Assets
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleCampaignAction("export")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCampaignAction("edit")}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCampaignAction("duplicate")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleCampaignAction("delete")}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Campaign Overview */}
        <Card className="border-2 border-blue-100 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <CampaignIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {campaign.campaignName}
                  </h3>
                  <p className="text-blue-700">
                    {campaignTypeNames[campaign.campaignType]} Campaign •
                    Created {formatDate(campaign.createdAt)}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200"
              >
                {campaignTypeNames[campaign.campaignType]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Daily Budget</p>
                  <p className="text-lg font-semibold">
                    {formatBudget(campaign.budget, campaign.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ad Groups</p>
                  <p className="text-lg font-semibold">
                    {campaign.generatedAssets?.adGroups?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Target Location</p>
                  <p className="text-lg font-semibold">
                    {campaign.answers?.location || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Objective</p>
                  <p className="text-lg font-semibold capitalize">
                    {campaign.objective?.replace(/_/g, " ") || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Details Tabs */}
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assets">Generated Assets</TabsTrigger>
            <TabsTrigger value="settings">Campaign Settings</TabsTrigger>
            <TabsTrigger value="answers">Strategic Inputs</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="mt-6">
            <CampaignResults
              campaignName={campaign.campaignName}
              campaignType={campaign.campaignType}
              generatedAssets={campaign.generatedAssets}
              onCreateAnother={() => router.push("/google-ads")}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Settings</CardTitle>
                  <CardDescription>Core campaign configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Campaign Name
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {campaign.campaignName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Campaign Type
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {campaignTypeNames[campaign.campaignType]}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Daily Budget
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatBudget(campaign.budget, campaign.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Currency
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {campaign.currency}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Objective
                    </label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">
                      {campaign.objective?.replace(/_/g, " ")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Metadata</CardTitle>
                  <CardDescription>System information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Campaign ID
                    </label>
                    <p className="text-sm text-gray-900 mt-1 font-mono">
                      {campaign.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {campaign.platform}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Created Date
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(campaign.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      User ID
                    </label>
                    <p className="text-sm text-gray-900 mt-1 font-mono">
                      {campaign.userId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="answers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strategic Inputs</CardTitle>
                <CardDescription>
                  The information used to generate this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(campaign.answers || {}).map(
                    ([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, " ")}
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-900">{value}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
