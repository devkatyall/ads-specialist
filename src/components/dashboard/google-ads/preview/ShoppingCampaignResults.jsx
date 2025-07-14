"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  ShoppingCart,
  Plus,
  Calendar,
  ArrowLeft,
  Package,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ShoppingCampaignResults({
  campaignName,
  generatedAssets,
  onCreateAnother,
}) {
  const [activeTab, setActiveTab] = useState("products");
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

  const renderProductGroups = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Product Groups</h2>
            <p className="text-xs text-gray-500">
              {assetData.productGroups?.length || 0} product groups for
              organized bidding
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Group
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
          {assetData.productGroups?.map((group, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-indigo-600">
                    {typeof group === "object"
                      ? group.name || `Product Group ${index + 1}`
                      : group}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() =>
                      copyToClipboard(
                        typeof group === "object"
                          ? JSON.stringify(group)
                          : group,
                        `group-${index}`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {typeof group === "object" && (
                  <div className="space-y-2">
                    {group.filter && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Filter:</span>{" "}
                        {group.filter}
                      </div>
                    )}
                    {group.bidAdjustment && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Bid Adjustment:</span>{" "}
                        {group.bidAdjustment}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs"
                  >
                    Product Group
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Group {index + 1}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderDiagnostics = () => {
    if (
      !assetData.diagnostics ||
      Object.keys(assetData.diagnostics).length === 0
    ) {
      return (
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No diagnostics available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Feed Diagnostics</h2>
            <p className="text-xs text-gray-500">
              Product feed optimization recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(assetData.diagnostics).map(([key, value], index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <h4 className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {Array.isArray(value) ? value.join(", ") : value}
                </p>
                <div className="mt-3">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                  >
                    Needs Attention
                  </Badge>
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

    if (assetData.productGroups && assetData.productGroups.length > 0) {
      tabs.push({
        id: "products",
        label: "Product Groups",
        icon: Package,
        count: assetData.productGroups.length,
        subtitle: "groups",
        color: "indigo",
      });
    }

    if (assetData.productTitles && assetData.productTitles.length > 0) {
      tabs.push({
        id: "titles",
        label: "Product Titles",
        icon: FileText,
        count: assetData.productTitles.length,
        subtitle: "titles",
        color: "blue",
      });
    }

    if (
      assetData.productDescriptions &&
      assetData.productDescriptions.length > 0
    ) {
      tabs.push({
        id: "descriptions",
        label: "Descriptions",
        icon: FileText,
        count: assetData.productDescriptions.length,
        subtitle: "descriptions",
        color: "green",
      });
    }

    if (
      assetData.diagnostics &&
      Object.keys(assetData.diagnostics).length > 0
    ) {
      tabs.push({
        id: "diagnostics",
        label: "Diagnostics",
        icon: AlertCircle,
        count: Object.keys(assetData.diagnostics).length,
        subtitle: "issues",
        color: "amber",
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
              <ShoppingCart className="h-4 w-4" />
              {campaignName}
            </h1>
            <p className="text-xs text-gray-500">
              Shopping Campaign • Generated {new Date().toLocaleDateString()}
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
              indigo: isActive
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              blue: isActive
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              green: isActive
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              amber: isActive
                ? "border-amber-500 text-amber-600"
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
                      tab.color === "indigo"
                        ? "bg-indigo-50 text-indigo-700"
                        : tab.color === "blue"
                        ? "bg-blue-50 text-blue-700"
                        : tab.color === "green"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
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
        <div className={activeTab === "products" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderProductGroups()}</CardContent>
          </Card>
        </div>

        <div className={activeTab === "titles" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAssetList(
                assetData.productTitles,
                "Product Titles",
                "titles",
                70
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "descriptions" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              {renderAssetList(
                assetData.productDescriptions,
                "Product Descriptions",
                "descriptions",
                175
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "diagnostics" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderDiagnostics()}</CardContent>
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
