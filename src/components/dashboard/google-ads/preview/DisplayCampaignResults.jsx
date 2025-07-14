"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  Globe,
  Plus,
  Calendar,
  ArrowLeft,
  Users,
  Megaphone,
  ImageIcon,
  Building,
} from "lucide-react";
import { toast } from "sonner";

export default function DisplayCampaignResults({
  campaignName,
  generatedAssets,
  onCreateAnother,
}) {
  const [activeTab, setActiveTab] = useState("audiences");
  const [assetData, setAssetData] = useState(generatedAssets);

  const copyToClipboard = async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const renderAssetList = (items, title, type) => {
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
              <span className="text-xs flex-1 leading-relaxed">
                {typeof item === "object"
                  ? item.name || item.definition || JSON.stringify(item)
                  : item}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0"
                onClick={() =>
                  copyToClipboard(
                    typeof item === "object" ? JSON.stringify(item) : item,
                    `${type}-${index}`
                  )
                }
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTargetAudiences = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Target Audiences</h2>
            <p className="text-xs text-gray-500">
              {assetData.targetAudiences?.length || 0} audience segments for
              precise targeting
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Audience
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
          {assetData.targetAudiences?.map((audience, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-purple-600">
                    {typeof audience === "object" ? audience.name : audience}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() =>
                      copyToClipboard(
                        typeof audience === "object"
                          ? JSON.stringify(audience)
                          : audience,
                        `audience-${index}`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {typeof audience === "object" && audience.definition && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {audience.definition}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                  >
                    Display Audience
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Segment {index + 1}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderImageConcepts = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Image Concepts</h2>
            <p className="text-xs text-gray-500">
              {assetData.imageConcepts?.length || 0} creative concepts for
              display ads
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Concept
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
          {assetData.imageConcepts?.map((concept, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-orange-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-orange-600">
                    {typeof concept === "object" ? concept.concept : concept}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() =>
                      copyToClipboard(
                        typeof concept === "object"
                          ? JSON.stringify(concept)
                          : concept,
                        `concept-${index}`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {typeof concept === "object" && (
                  <div className="space-y-2">
                    {concept.orientation && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Size:</span>{" "}
                        {concept.orientation}
                      </div>
                    )}
                    {concept.reason && (
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <span className="font-medium">Rationale:</span>{" "}
                        {concept.reason}
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                  >
                    Image Concept
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Concept {index + 1}
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

    if (assetData.targetAudiences && assetData.targetAudiences.length > 0) {
      tabs.push({
        id: "audiences",
        label: "Target Audiences",
        icon: Users,
        count: assetData.targetAudiences.length,
        subtitle: "audiences",
        color: "purple",
      });
    }

    if (assetData.shortHeadlines && assetData.shortHeadlines.length > 0) {
      tabs.push({
        id: "headlines",
        label: "Headlines",
        icon: Megaphone,
        count:
          assetData.shortHeadlines.length + (assetData.longHeadline ? 1 : 0),
        subtitle: "headlines",
        color: "blue",
      });
    }

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

    if (assetData.imageConcepts && assetData.imageConcepts.length > 0) {
      tabs.push({
        id: "images",
        label: "Image Concepts",
        icon: ImageIcon,
        count: assetData.imageConcepts.length,
        subtitle: "concepts",
        color: "orange",
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
              <Globe className="h-4 w-4" />
              {campaignName}
            </h1>
            <p className="text-xs text-gray-500">
              Display Campaign • Generated {new Date().toLocaleDateString()}
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
              purple: isActive
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              blue: isActive
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              green: isActive
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              orange: isActive
                ? "border-orange-500 text-orange-600"
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
                      tab.color === "purple"
                        ? "bg-purple-50 text-purple-700"
                        : tab.color === "blue"
                        ? "bg-blue-50 text-blue-700"
                        : tab.color === "green"
                        ? "bg-green-50 text-green-700"
                        : "bg-orange-50 text-orange-700"
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
        <div className={activeTab === "audiences" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderTargetAudiences()}</CardContent>
          </Card>
        </div>

        <div className={activeTab === "headlines" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAssetList(
                assetData.shortHeadlines,
                "Short Headlines",
                "headlines"
              )}
              {assetData.longHeadline && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Long Headline
                  </h3>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <span className="text-xs">{assetData.longHeadline}</span>
                  </div>
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
                "descriptions"
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "images" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderImageConcepts()}</CardContent>
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
