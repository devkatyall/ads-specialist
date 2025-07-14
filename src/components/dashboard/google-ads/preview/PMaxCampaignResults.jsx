"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  TrendingUp,
  Plus,
  Calendar,
  ArrowLeft,
  Target,
  Users,
  Megaphone,
  ImageIcon,
  Video,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { ca } from "date-fns/locale";

export default function PMaxCampaignResults({
  campaignName,
  generatedAssets,
  onCreateAnother,
}) {
  const [activeTab, setActiveTab] = useState("headlines");
  const [assetData, setAssetData] = useState(generatedAssets);

  console.log(campaignName);
  console.log(generatedAssets);

  const copyToClipboard = async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const renderAssetList = (items, title, type, maxLength = null) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs bg-transparent"
            onClick={() => copyToClipboard(items.join("\n"), `${type}-all`)}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy All
          </Button>
        </div>
        <div className="space-y-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors group"
            >
              <span className="text-xs flex-1 leading-relaxed">{item}</span>
              <div className="flex items-center gap-2 ml-2">
                {maxLength && (
                  <span className="text-xs text-gray-400">
                    {item.length}/{maxLength}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0"
                  onClick={() => copyToClipboard(item, `${type}-${index}`)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAudienceSignals = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Audience Signals</h2>
            <p className="text-xs text-gray-500">
              {assetData.audienceSignals?.length || 0} audience signals to guide
              Google's AI
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Signal
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assetData.audienceSignals?.map((signal, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-cyan-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-cyan-600">
                    {typeof signal === "object"
                      ? signal.name || signal.type
                      : signal}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() =>
                      copyToClipboard(
                        typeof signal === "object"
                          ? JSON.stringify(signal)
                          : signal,
                        `signal-${index}`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {typeof signal === "object" && (
                  <div className="space-y-2">
                    {signal.seedList && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Seed List:</span>{" "}
                        {signal.seedList}
                      </div>
                    )}
                    {signal.description && (
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {signal.description}
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs"
                  >
                    Audience Signal
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Signal {index + 1}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderAssetRecommendations = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Asset Recommendations</h2>
            <p className="text-xs text-gray-500">
              {assetData.assetRecommendations?.length || 0} recommendations for
              optimal performance
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Asset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assetData.assetRecommendations?.map((recommendation, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-green-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-green-600">
                    {typeof recommendation === "object"
                      ? recommendation.type || recommendation.name
                      : recommendation}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() =>
                      copyToClipboard(
                        typeof recommendation === "object"
                          ? JSON.stringify(recommendation)
                          : recommendation,
                        `rec-${index}`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {typeof recommendation === "object" && (
                  <div className="space-y-2">
                    {recommendation.priority && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Priority:</span>{" "}
                        {recommendation.priority}
                      </div>
                    )}
                    {recommendation.reason && (
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {recommendation.reason}
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 text-xs"
                  >
                    Recommendation
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Item {index + 1}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderVideoScripts = () => {
    if (!assetData.videos || assetData.videos.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Video Script Ideas</h2>
            <p className="text-xs text-gray-500">
              {assetData.videos.length} video concepts for YouTube ads
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Script
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assetData.videos.map((video, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-red-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-red-600">
                    {typeof video === "object"
                      ? video.title || `Video Script ${index + 1}`
                      : `Video Script ${index + 1}`}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() =>
                      copyToClipboard(
                        typeof video === "object"
                          ? JSON.stringify(video)
                          : video,
                        `video-${index}`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {typeof video === "object"
                      ? video.script || video.description
                      : video}
                  </p>
                  {typeof video === "object" && video.duration && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Duration:</span>{" "}
                      {video.duration}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 text-xs"
                  >
                    Video Script
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Script {index + 1}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const generateTabs = () => {
    const tabs = [];

    // Headlines (short + long)
    const totalHeadlines =
      (assetData.headlines?.length || 0) +
      (assetData.longHeadlines?.length || 0);
    if (totalHeadlines > 0) {
      tabs.push({
        id: "headlines",
        label: "Headlines",
        icon: Megaphone,
        count: totalHeadlines,
        subtitle: "headlines",
        color: "blue",
      });
    }

    // Descriptions
    if (assetData.descriptions && assetData.descriptions.length > 0) {
      tabs.push({
        id: "descriptions",
        label: "Descriptions",
        icon: Building,
        count: assetData.descriptions.length,
        subtitle: "descriptions",
        color: "green",
      });
    }

    // Images
    if (assetData.images && assetData.images.length > 0) {
      tabs.push({
        id: "images",
        label: "Images",
        icon: ImageIcon,
        count: assetData.images.length,
        subtitle: "images",
        color: "orange",
      });
    }

    // Videos
    if (assetData.videos && assetData.videos.length > 0) {
      tabs.push({
        id: "videos",
        label: "Videos",
        icon: Video,
        count: assetData.videos.length,
        subtitle: "scripts",
        color: "red",
      });
    }

    // Audience Signals
    if (assetData.audienceSignals && assetData.audienceSignals.length > 0) {
      tabs.push({
        id: "audiences",
        label: "Audience Signals",
        icon: Users,
        count: assetData.audienceSignals.length,
        subtitle: "signals",
        color: "cyan",
      });
    }

    // Asset Recommendations
    if (
      assetData.assetRecommendations &&
      assetData.assetRecommendations.length > 0
    ) {
      tabs.push({
        id: "recommendations",
        label: "Recommendations",
        icon: Target,
        count: assetData.assetRecommendations.length,
        subtitle: "recommendations",
        color: "green",
      });
    }

    return tabs;
  };

  const tabs = generateTabs();

  return (
    <div className="mx-auto ">
      {/* Campaign Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onCreateAnother}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {campaignName}
            </h1>
            <p className="text-xs text-gray-500">
              Performance Max Campaign • Generated{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs bg-transparent"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Jan 2024
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs bg-transparent"
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-4">
        <div className="flex items-center gap-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            const colorClasses = {
              blue: isActive
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              green: isActive
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              orange: isActive
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              red: isActive
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              cyan: isActive
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
            };

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors ${
                  colorClasses[tab.color]
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-400">
                    {tab.count} {tab.subtitle}
                  </div>
                </div>
                {tab.count > 0 && (
                  <Badge
                    variant="secondary"
                    className={`${
                      tab.color === "blue"
                        ? "bg-blue-50 text-blue-700"
                        : tab.color === "green"
                        ? "bg-green-50 text-green-700"
                        : tab.color === "orange"
                        ? "bg-orange-50 text-orange-700"
                        : tab.color === "red"
                        ? "bg-red-50 text-red-700"
                        : "bg-cyan-50 text-cyan-700"
                    } text-xs px-1.5 py-0.5`}
                  >
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <div className={activeTab === "headlines" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAssetList(
                assetData.headlines,
                "Short Headlines",
                "headlines",
                30
              )}
              {assetData.longHeadlines &&
                assetData.longHeadlines.length > 0 && (
                  <div className="mt-6">
                    {renderAssetList(
                      assetData.longHeadlines,
                      "Long Headlines",
                      "long-headlines",
                      90
                    )}
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "descriptions" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAssetList(
                assetData.descriptions,
                "Ad Descriptions",
                "descriptions",
                90
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "images" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAssetList(assetData.images, "Image Assets", "images")}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "videos" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderVideoScripts()}</CardContent>
          </Card>
        </div>

        <div className={activeTab === "audiences" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderAudienceSignals()}</CardContent>
          </Card>
        </div>

        <div className={activeTab === "recommendations" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAssetRecommendations()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="text-center mt-6">
        <Button onClick={onCreateAnother} className="h-9 px-6 text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Another Campaign
        </Button>
      </div>
    </div>
  );
}
