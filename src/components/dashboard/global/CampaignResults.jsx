"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  Smartphone,
  Plus,
  Calendar,
  ArrowLeft,
  Megaphone,
  Building,
  ImageIcon,
  Video,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function AppCampaignResults({
  campaignName,
  generatedAssets,
  onCreateAnother,
}) {
  const [activeTab, setActiveTab] = useState("headlines");
  const [assetData, setAssetData] = useState(generatedAssets);

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

  const renderAppStoreOptimization = () => {
    if (!assetData.appStoreOptimization) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">App Store Optimization</h2>
            <p className="text-xs text-gray-500">
              Keywords and metadata for app store visibility
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Keywords
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

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-4">
              {assetData.appStoreOptimization.keywords && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    App Store Keywords
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">
                        Keywords (comma-separated)
                      </span>
                      <span className="text-xs text-gray-400">
                        {assetData.appStoreOptimization.keywords.length}/100
                        chars
                      </span>
                    </div>
                    <p className="text-xs font-mono">
                      {assetData.appStoreOptimization.keywords}
                    </p>
                  </div>
                </div>
              )}

              {assetData.appStoreOptimization.title && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    App Title
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs">
                      {assetData.appStoreOptimization.title}
                    </p>
                  </div>
                </div>
              )}

              {assetData.appStoreOptimization.subtitle && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    App Subtitle
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs">
                      {assetData.appStoreOptimization.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVideoAssets = () => {
    if (!assetData.videos || assetData.videos.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Video Assets</h2>
            <p className="text-xs text-gray-500">
              {assetData.videos.length} video concepts for app promotion
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Video
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
                      ? video.title || `Video ${index + 1}`
                      : `Video ${index + 1}`}
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
                  {typeof video === "object" && (
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {video.orientation && (
                        <span>Format: {video.orientation}</span>
                      )}
                      {video.duration && (
                        <span>Duration: {video.duration}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 text-xs"
                  >
                    {typeof video === "object" && video.orientation === "9:16"
                      ? "Portrait Video"
                      : "Landscape Video"}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Video {index + 1}
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

    // Headlines
    if (assetData.headlines && assetData.headlines.length > 0) {
      tabs.push({
        id: "headlines",
        label: "Headlines",
        icon: Megaphone,
        count: assetData.headlines.length,
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
        subtitle: "videos",
        color: "red",
      });
    }

    // App Store Optimization
    if (
      assetData.appStoreOptimization &&
      Object.keys(assetData.appStoreOptimization).length > 0
    ) {
      tabs.push({
        id: "aso",
        label: "App Store SEO",
        icon: Search,
        count: 1,
        subtitle: "optimization",
        color: "purple",
      });
    }

    return tabs;
  };

  const tabs = generateTabs();

  return (
    <div className="mx-auto max-w-6xl">
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
              <Smartphone className="h-4 w-4" />
              {campaignName}
            </h1>
            <p className="text-xs text-gray-500">
              App Campaign • Generated {new Date().toLocaleDateString()}
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
              purple: isActive
                ? "border-purple-500 text-purple-600"
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
                        : "bg-purple-50 text-purple-700"
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
                "App Headlines",
                "headlines",
                30
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "descriptions" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAssetList(
                assetData.descriptions,
                "App Descriptions",
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
            <CardContent className="p-4">{renderVideoAssets()}</CardContent>
          </Card>
        </div>

        <div className={activeTab === "aso" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAppStoreOptimization()}
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
