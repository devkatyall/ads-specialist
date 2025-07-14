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
import CampaignResultsRouter from "@/components/dashboard/google-ads/preview/CampaignResultsRouter";

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
      <CampaignResultsRouter
        campaignName={campaign.campaignName}
        campaignType={campaign.campaignType}
        generatedAssets={campaign.generatedAssets}
        date={formatDate(campaign.createdAt)}
        onCreateAnother={() =>
          history.length > 1
            ? history.go(-1)
            : router.push("/dashboard/campaigns/google-ads")
        }
      />
    </div>
  );
}
