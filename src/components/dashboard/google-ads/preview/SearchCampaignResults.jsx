"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  Download,
  Target,
  Plus,
  Calendar,
  ArrowLeft,
  RefreshCcw,
  Loader2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function SearchCampaignResults({
  campaignName,
  generatedAssets,
  date,
  onCreateAnother,
}) {
  const [activeTab, setActiveTab] = useState("adgroup-0");
  const [refreshingIndex, setRefreshingIndex] = useState(null);
  const [assetData, setAssetData] = useState(generatedAssets);

  const copyToClipboard = async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const refreshAdGroupKeywords = async (index) => {
    try {
      setRefreshingIndex(index);
      const group = assetData.adGroups[index];
      const mockKeywords = [
        `[${group.theme.toLowerCase()} services]`,
        `"${group.theme.toLowerCase()} solutions"`,
        `${group.theme.toLowerCase()} expert`,
        `professional ${group.theme.toLowerCase()}`,
        `best ${group.theme.toLowerCase()}`,
      ];

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAssetData((prev) => {
        const groups = [...prev.adGroups];
        groups[index] = { ...groups[index], keywords: mockKeywords };
        return { ...prev, adGroups: groups };
      });

      toast.success("Keywords refreshed!");
    } catch (err) {
      toast.error("Failed to refresh keywords");
    } finally {
      setRefreshingIndex(null);
    }
  };

  const getMatchTypeColor = (keyword) => {
    const keywordStr = String(keyword || "");
    if (keywordStr.startsWith("[") && keywordStr.endsWith("]"))
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (keywordStr.startsWith('"') && keywordStr.endsWith('"'))
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getMatchTypeLabel = (raw = "") => {
    const kw = raw.trim();

    // Strip leading negation to detect match type
    const term = kw.startsWith("-") ? kw.slice(1).trim() : kw;

    if (term.startsWith("[") && term.endsWith("]")) return "Exact";
    if (term.startsWith('"') && term.endsWith('"')) return "Phrase";
    if (/\\+[\\w-]/.test(term)) return "BMM"; // Broad-match modifier
    return "Broad";
  };

  const renderAdGroupContent = (adGroup, adGroupIndex) => {
    const renderAdPreviews = () => {
      if (!adGroup.adHeadlines || !adGroup.adDescriptions) return null;

      const adPreviews = [];
      const maxPreviews = 3;

      for (
        let i = 0;
        i < Math.min(maxPreviews, adGroup.adHeadlines.length);
        i++
      ) {
        const headline1 = adGroup.adHeadlines[i];
        const headline2 =
          adGroup.adHeadlines[(i + 1) % adGroup.adHeadlines.length];
        const headline3 =
          adGroup.adHeadlines[(i + 2) % adGroup.adHeadlines.length];
        const description1 =
          adGroup.adDescriptions[i % adGroup.adDescriptions.length];
        const description2 =
          adGroup.adDescriptions[(i + 1) % adGroup.adDescriptions.length];

        adPreviews.push({
          id: i,
          headlines: [headline1, headline2, headline3].filter(Boolean),
          descriptions: [description1, description2].filter(Boolean),
          displayUrl: `www.${campaignName
            .toLowerCase()
            .replace(/\s+/g, "")}.com`,
        });
      }

      return (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Ad Previews</h3>
            <Badge variant="outline" className="text-xs">
              {adPreviews.length} variations
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {adPreviews.map((ad) => (
              <Card
                key={ad.id}
                className="border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className=" flex flex-wrap cursor-pointer ">
                      {ad.headlines.map((headline, idx) => (
                        <div
                          key={idx}
                          className={`${"text-blue-600 text-base font-medium text-blue-600   "}`}
                        >
                          {headline}
                        </div>
                      ))}
                    </div>
                    <div className="text-emerald-600 text-xs truncate">
                      {ad.displayUrl}
                    </div>
                    <div className="space-y-1">
                      {ad.descriptions.map((description, idx) => (
                        <div
                          key={idx}
                          className="text-gray-600 text-xs leading-relaxed line-clamp-2"
                        >
                          {description}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5"
                    >
                      Preview {ad.id + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(
                          `${ad.headlines.join("\n")}\n${ad.descriptions.join(
                            "\n"
                          )}`,
                          `ad-preview-${ad.id}`
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {/* <h2 className="text-base font-light text-xs text-muted-foreground">
              {adGroup.theme}
            </h2> */}
            <p className="text-xs text-gray-500">
              {adGroup.keywords?.length || 0} keywords •{" "}
              {adGroup.adHeadlines?.length || 0} headlines •{" "}
              {adGroup.adDescriptions?.length || 0} descriptions
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
              onClick={() => refreshAdGroupKeywords(adGroupIndex)}
              disabled={refreshingIndex === adGroupIndex}
            >
              {refreshingIndex === adGroupIndex ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCcw className="h-3 w-3 mr-1" />
              )}
              Refresh
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

        <Tabs defaultValue="keywords" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="keywords" className="text-xs">
              Keywords ({adGroup.keywords?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="headlines" className="text-xs">
              Headlines ({adGroup.adHeadlines?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="descriptions" className="text-xs">
              Descriptions ({adGroup.adDescriptions?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="keywords" className="mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Keywords for {adGroup.theme}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs bg-transparent"
                  onClick={() =>
                    copyToClipboard(
                      adGroup.keywords?.join("\n") || "",
                      `keywords-${adGroupIndex}`
                    )
                  }
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All
                </Button>
              </div>
              <div className="space-y-1">
                {adGroup.keywords?.map((keyword, kIndex) => (
                  <div
                    key={kIndex}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${getMatchTypeColor(
                          keyword
                        )} text-xs px-1.5 py-0.5`}
                      >
                        {getMatchTypeLabel(keyword)}
                      </Badge>
                      <span className="text-xs font-medium truncate">
                        {keyword}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0"
                      onClick={() =>
                        copyToClipboard(
                          keyword,
                          `keyword-${adGroupIndex}-${kIndex}`
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="headlines" className="mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Headlines for {adGroup.theme}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs bg-transparent"
                  onClick={() =>
                    copyToClipboard(
                      adGroup.adHeadlines?.join("\n") || "",
                      `headlines-${adGroupIndex}`
                    )
                  }
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All
                </Button>
              </div>
              <div className="space-y-1">
                {adGroup.adHeadlines?.map((headline, hIndex) => (
                  <div
                    key={hIndex}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors group"
                  >
                    <span className="text-xs font-medium flex-1 truncate">
                      {headline}
                    </span>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs text-gray-400">
                        {headline.length}/30
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0"
                        onClick={() =>
                          copyToClipboard(
                            headline,
                            `headline-${adGroupIndex}-${hIndex}`
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="descriptions" className="mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Descriptions for {adGroup.theme}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs bg-transparent"
                  onClick={() =>
                    copyToClipboard(
                      adGroup.adDescriptions?.join("\n") || "",
                      `descriptions-${adGroupIndex}`
                    )
                  }
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All
                </Button>
              </div>
              <div className="space-y-1">
                {adGroup.adDescriptions?.map((description, dIndex) => (
                  <div
                    key={dIndex}
                    className="flex items-start justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors group"
                  >
                    <span className="text-xs flex-1 leading-relaxed">
                      {description}
                    </span>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs text-gray-400">
                        {description.length}/90
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0"
                        onClick={() =>
                          copyToClipboard(
                            description,
                            `desc-${adGroupIndex}-${dIndex}`
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {renderAdPreviews()}
      </div>
    );
  };

  const renderNegativeKeywordsContent = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">
              Campaign Negative Keywords
            </h2>
            <p className="text-xs text-gray-500">
              {assetData.negativeKeywords?.length || 0} negative keywords to
              prevent irrelevant traffic
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
              onClick={() =>
                copyToClipboard(
                  assetData.negativeKeywords?.join("\n") || "",
                  "all-negative-keywords"
                )
              }
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy All
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-8 text-xs font-medium text-gray-500 py-2">
                #
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 py-2">
                Keyword
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 py-2">
                Match Type
              </TableHead>
              <TableHead className="w-16 text-xs font-medium text-gray-500 py-2">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetData.negativeKeywords?.map((keyword, index) => (
              <TableRow
                key={index}
                className="hover:bg-red-50/30 border-b border-gray-100"
              >
                <TableCell className="text-xs text-gray-400 py-2">
                  {index + 1}
                </TableCell>
                <TableCell className="text-xs font-medium py-2">
                  {keyword}
                </TableCell>
                <TableCell className="py-2">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 text-xs px-1.5 py-0.5"
                  >
                    Negative
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() =>
                        copyToClipboard(keyword, `negative-${index}`)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const generateTabs = () => {
    const tabs = [];

    // Add ad group tabs
    assetData.adGroups?.forEach((adGroup, index) => {
      tabs.push({
        id: `adgroup-${index}`,
        label: adGroup.theme,
        icon: Users,
        count: adGroup.keywords?.length || 0,
        subtitle: "keywords",
        color: "blue",
      });
    });

    // Add negative keywords tab
    if (assetData.negativeKeywords && assetData.negativeKeywords.length > 0) {
      tabs.push({
        id: "negatives",
        label: "Negative Keywords",
        icon: X,
        count: assetData.negativeKeywords.length,
        subtitle: "blocked",
        color: "red",
      });
    }

    return tabs;
  };

  const tabs = generateTabs();

  return (
    <div className="mx-auto ">
      {/* Campaign Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              {campaignName}
            </h1>
            <p className="text-xs text-gray-500">
              Search Campaign • Strategy: {assetData.keywordStrategy || "STAG"}{" "}
              • Generated {date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
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
      <div className="">
        <div className="flex items-center gap-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const colorClasses = {
              blue: isActive
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              red: isActive
                ? "border-red-500 text-red-600"
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
                <div className="text-left">
                  <div className="text-sm font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-400">{tab.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="">
        {/* Ad Group Tabs */}
        {assetData.adGroups?.map((adGroup, index) => (
          <div
            key={index}
            className={activeTab === `adgroup-${index}` ? "block" : "hidden"}
          >
            <div className="p-4">{renderAdGroupContent(adGroup, index)}</div>
          </div>
        ))}

        {/* Negative Keywords Tab */}
        <div className={activeTab === "negatives" ? "block" : "hidden"}>
          <div className="p-4">{renderNegativeKeywordsContent()}</div>
        </div>
      </div>

      {/* Bottom Action */}
      {/* <div className="text-center ">
        <Button onClick={onCreateAnother} className="h-9 px-6 text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Another Campaign
        </Button>
      </div> */}
    </div>
  );
}
