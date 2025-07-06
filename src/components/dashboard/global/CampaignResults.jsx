"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Copy,
  Download,
  Target,
  Globe,
  ShoppingCart,
  Play,
  Smartphone,
  TrendingUp,
  Eye,
  Users,
  MessageSquare,
  ImageIcon,
  Zap,
  Hash,
  Ban,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

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

export default function CampaignResults({
  campaignName,
  campaignType,
  generatedAssets,
  onCreateAnother,
}) {
  const [expandedAdGroups, setExpandedAdGroups] = useState(new Set([0]));
  const [copiedItems, setCopiedItems] = useState(new Set());

  const copyToClipboard = async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems((prev) => new Set(prev).add(itemId));
      toast.success("Copied to clipboard!");
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const toggleAdGroup = (index) => {
    setExpandedAdGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getMatchTypeColor = (keyword) => {
    const keywordStr = String(keyword || "");
    if (keywordStr.startsWith("[") && keywordStr.endsWith("]"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (keywordStr.startsWith('"') && keywordStr.endsWith('"'))
      return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getMatchTypeLabel = (keyword) => {
    const keywordStr = String(keyword || "");
    if (keywordStr.startsWith("[") && keywordStr.endsWith("]")) return "Exact";
    if (keywordStr.startsWith('"') && keywordStr.endsWith('"')) return "Phrase";
    return "Broad";
  };

  // Export functions
  const exportAllKeywords = () => {
    if (!generatedAssets.adGroups) return;

    const csvContent = [
      ["Ad Group", "Keyword", "Match Type"].join(","),
      ...generatedAssets.adGroups.flatMap(
        (adGroup) =>
          adGroup.keywords?.map((keyword) => [
            adGroup.theme,
            keyword,
            getMatchTypeLabel(keyword),
          ]) || []
      ),
    ].join("\n");

    downloadCSV(csvContent, "all-keywords.csv");
  };

  const exportAdGroupKeywords = (adGroup, index) => {
    const csvContent = [
      ["Keyword", "Match Type"].join(","),
      ...(adGroup.keywords?.map((keyword) => [
        keyword,
        getMatchTypeLabel(keyword),
      ]) || []),
    ].join("\n");

    downloadCSV(
      csvContent,
      `${adGroup.theme.replace(/\s+/g, "-").toLowerCase()}-keywords.csv`
    );
  };

  const exportNegativeKeywords = () => {
    if (!generatedAssets.negativeKeywords) return;

    const csvContent = [
      ["Negative Keyword"].join(","),
      ...generatedAssets.negativeKeywords.map((keyword) => [keyword]),
    ].join("\n");

    downloadCSV(csvContent, "negative-keywords.csv");
  };

  const exportAdGroupAssets = (adGroup, index) => {
    const csvContent = [
      ["Type", "Content"].join(","),
      ...(adGroup.adHeadlines?.map((headline) => ["Headline", headline]) || []),
      ...(adGroup.adDescriptions?.map((description) => [
        "Description",
        description,
      ]) || []),
      ...(adGroup.keywords?.map((keyword) => ["Keyword", keyword]) || []),
    ].join("\n");

    downloadCSV(
      csvContent,
      `${adGroup.theme.replace(/\s+/g, "-").toLowerCase()}-assets.csv`
    );
  };

  const exportAssetData = (key, values) => {
    let csvContent = "";

    if (key === "audienceSignals") {
      csvContent = [
        ["Audience Name", "Seeds"].join(","),
        ...values.map((audience) => [
          audience.name,
          Array.isArray(audience.seeds) ? audience.seeds.join("; ") : "",
        ]),
      ].join("\n");
    } else if (key === "assetRecommendations") {
      csvContent = [
        ["Asset Type", "Concept", "Reason", "Spec"].join(","),
        ...values.map((asset) => [
          asset.assetType || "",
          asset.concept || "",
          asset.reason || "",
          asset.spec || "",
        ]),
      ].join("\n");
    } else if (Array.isArray(values)) {
      csvContent = [
        [key.charAt(0).toUpperCase() + key.slice(1)].join(","),
        ...values.map((item) => [
          typeof item === "string" ? item : JSON.stringify(item),
        ]),
      ].join("\n");
    } else {
      csvContent = `${key},${
        typeof values === "string" ? values : JSON.stringify(values)
      }`;
    }

    downloadCSV(
      csvContent,
      `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}.csv`
    );
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded successfully!`);
  };

  const renderAdPreview = (adGroup, adIndex) => {
    const { adHeadlines = [], adDescriptions = [] } = adGroup;

    // Create different combinations of headlines and descriptions
    const adVariations = [];

    // Generate up to 3 ad variations using different combinations
    for (let i = 0; i < Math.min(3, adHeadlines.length); i++) {
      const headline1 = adHeadlines[i] || "";
      const headline2 = adHeadlines[(i + 1) % adHeadlines.length] || "";
      const headline3 = adHeadlines[(i + 2) % adHeadlines.length] || "";
      const description1 = adDescriptions[i % adDescriptions.length] || "";
      const description2 =
        adDescriptions[(i + 1) % adDescriptions.length] || "";

      adVariations.push({
        headline1,
        headline2,
        headline3,
        description1,
        description2,
      });
    }

    // Mock sitelinks and extensions for realistic preview
    const mockSitelinks = [
      { title: "Services", desc1: "Our Services", desc2: "Learn More" },
      { title: "About Us", desc1: "Company Info", desc2: "Our Story" },
      { title: "Contact", desc1: "Get In Touch", desc2: "Free Quote" },
      { title: "Reviews", desc1: "Client Reviews", desc2: "Testimonials" },
    ];

    const mockCallouts = [
      "Free Consultation",
      "24/7 Support",
      "Proven Results",
      "Expert Team",
    ];
    const mockStructuredSnippets = ["Services: SEO, PPC, Social Media"];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="h-4 w-4" />
            <span>Google Ads Preview - {adVariations.length} variations</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(
                adVariations
                  .map(
                    (ad, i) =>
                      `Variation ${i + 1}:\nHeadlines: ${ad.headline1} | ${
                        ad.headline2
                      } | ${ad.headline3}\nDescriptions: ${ad.description1}. ${
                        ad.description2
                      }`
                  )
                  .join("\n\n"),
                `all-ad-variations-${adIndex}`
              )
            }
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy All Variations
          </Button>
        </div>

        {adVariations.map((ad, index) => (
          <div
            key={index}
            className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow max-w-2xl"
          >
            {/* Ad Header with URL and Phone */}
            <div className="text-sm text-gray-700 mb-3 font-normal">
              Ad ~ www.yourwebsite.com/marketing-services (403) 555-0123
            </div>

            {/* Headlines - Red/Orange Color */}
            <div className="mb-3">
              <h3 className="text-red-600 text-xl font-normal leading-tight">
                {ad.headline1}
                {ad.headline2 && (
                  <>
                    <span className="mx-2">|</span>
                    {ad.headline2}
                  </>
                )}
                {ad.headline3 && (
                  <>
                    <span className="mx-2">|</span>
                    {ad.headline3}
                  </>
                )}
              </h3>
            </div>

            {/* Descriptions with Callouts and Structured Snippets */}
            <div className="text-gray-900 text-base leading-relaxed mb-4">
              {ad.description1}
              {ad.description2 && `. ${ad.description2}`}
              {mockCallouts.length > 0 && `. ${mockCallouts.join(". ")}`}
              {mockStructuredSnippets.length > 0 &&
                `. ${mockStructuredSnippets.join(". ")}.`}
            </div>

            {/* Sitelinks - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {mockSitelinks.map((sitelink, slIndex) => (
                <div key={slIndex}>
                  <div className="text-red-600 text-base font-normal hover:underline cursor-pointer">
                    {sitelink.title}
                  </div>
                  <div className="text-gray-900 text-sm">{sitelink.desc1}</div>
                  <div className="text-gray-900 text-sm">{sitelink.desc2}</div>
                </div>
              ))}
            </div>

            {/* Copy button for this ad variation */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `Headlines: ${ad.headline1} | ${ad.headline2} | ${
                      ad.headline3
                    }\nDescriptions: ${ad.description1}. ${
                      ad.description2
                    }\nCallouts: ${mockCallouts.join(
                      ", "
                    )}\nSitelinks: ${mockSitelinks
                      .map((sl) => sl.title)
                      .join(", ")}`,
                    `ad-preview-${adIndex}-${index}`
                  )
                }
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Complete Ad
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSearchResults = () => {
    if (!generatedAssets.adGroups) return null;

    return (
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">All Keywords</TabsTrigger>
          <TabsTrigger value="negative">Negative Keywords</TabsTrigger>
          <TabsTrigger value="adgroups">Ad Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ad Groups</p>
                    <p className="text-2xl font-bold">
                      {generatedAssets.adGroups.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Hash className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Keywords</p>
                    <p className="text-2xl font-bold">
                      {generatedAssets.adGroups.reduce(
                        (total, group) => total + (group.keywords?.length || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Ban className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Negative Keywords</p>
                    <p className="text-2xl font-bold">
                      {generatedAssets.negativeKeywords?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {generatedAssets.adGroups.map((adGroup, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{adGroup.theme}</CardTitle>
                      <CardDescription>
                        {adGroup.keywords?.length || 0} keywords •{" "}
                        {adGroup.adHeadlines?.length || 0} headlines •{" "}
                        {adGroup.adDescriptions?.length || 0} descriptions
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportAdGroupAssets(adGroup, index)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">All Keywords</CardTitle>
                  <CardDescription>
                    {generatedAssets.adGroups.reduce(
                      (total, group) => total + (group.keywords?.length || 0),
                      0
                    )}{" "}
                    keywords across all ad groups
                  </CardDescription>
                </div>
                <Button onClick={exportAllKeywords}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All Keywords
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {generatedAssets.adGroups.map((adGroup, groupIndex) => (
                  <div key={groupIndex}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">
                        {adGroup.theme}
                      </h4>
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          {adGroup.keywords?.length || 0} keywords
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            exportAdGroupKeywords(adGroup, groupIndex)
                          }
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {adGroup.keywords?.map((keyword, kIndex) => (
                        <Badge
                          key={kIndex}
                          variant="outline"
                          className={`${getMatchTypeColor(
                            keyword
                          )} cursor-pointer hover:shadow-sm transition-shadow`}
                          onClick={() =>
                            copyToClipboard(
                              keyword,
                              `keyword-${groupIndex}-${kIndex}`
                            )
                          }
                        >
                          <span className="text-xs mr-1 font-medium">
                            {getMatchTypeLabel(keyword)}
                          </span>
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    {groupIndex < generatedAssets.adGroups.length - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="negative" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Negative Keywords</CardTitle>
                  <CardDescription>
                    {generatedAssets.negativeKeywords?.length || 0} keywords to
                    exclude from your campaigns
                  </CardDescription>
                </div>
                <Button onClick={exportNegativeKeywords}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Negative Keywords
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {generatedAssets.negativeKeywords?.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 cursor-pointer hover:bg-red-100"
                    onClick={() => copyToClipboard(keyword, `neg-${index}`)}
                  >
                    -{keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adgroups" className="mt-6">
          <div className="space-y-6">
            {generatedAssets.adGroups.map((adGroup, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAdGroup(index)}
                        className="p-1 h-auto"
                      >
                        {expandedAdGroups.has(index) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <h4 className="font-semibold text-base">
                          {adGroup.theme}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {adGroup.keywords?.length || 0} keywords •{" "}
                          {adGroup.adHeadlines?.length || 0} headlines •{" "}
                          {adGroup.adDescriptions?.length || 0} descriptions
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportAdGroupAssets(adGroup, index)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(adGroup, null, 2),
                            `adgroup-${index}`
                          )
                        }
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copiedItems.has(`adgroup-${index}`)
                          ? "Copied!"
                          : "Copy"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedAdGroups.has(index) && (
                  <CardContent className="pt-0">
                    <Tabs defaultValue="keywords" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="keywords">Keywords</TabsTrigger>
                        <TabsTrigger value="headlines">Headlines</TabsTrigger>
                        <TabsTrigger value="descriptions">
                          Descriptions
                        </TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>

                      <TabsContent value="keywords" className="mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Hash className="h-4 w-4" />
                              <span>
                                {adGroup.keywords?.length || 0} keywords
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                exportAdGroupKeywords(adGroup, index)
                              }
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {adGroup.keywords?.map((keyword, kIndex) => (
                              <div key={kIndex} className="group relative">
                                <Badge
                                  variant="outline"
                                  className={`${getMatchTypeColor(
                                    keyword
                                  )} cursor-pointer hover:shadow-sm transition-shadow`}
                                  onClick={() =>
                                    copyToClipboard(
                                      keyword,
                                      `keyword-${index}-${kIndex}`
                                    )
                                  }
                                >
                                  <span className="text-xs mr-1 font-medium">
                                    {getMatchTypeLabel(keyword)}
                                  </span>
                                  {keyword}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="headlines" className="mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MessageSquare className="h-4 w-4" />
                              <span>
                                {adGroup.adHeadlines?.length || 0} headlines
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  adGroup.adHeadlines?.join("\n") || "",
                                  `headlines-${index}`
                                )
                              }
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy All
                            </Button>
                          </div>
                          <div className="grid gap-2">
                            {adGroup.adHeadlines?.map((headline, hIndex) => (
                              <div
                                key={hIndex}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                              >
                                <span className="text-sm font-medium">
                                  {headline}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    {headline.length}/30
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                    onClick={() =>
                                      copyToClipboard(
                                        headline,
                                        `headline-${index}-${hIndex}`
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

                      <TabsContent value="descriptions" className="mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MessageSquare className="h-4 w-4" />
                              <span>
                                {adGroup.adDescriptions?.length || 0}{" "}
                                descriptions
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  adGroup.adDescriptions?.join("\n") || "",
                                  `descriptions-${index}`
                                )
                              }
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy All
                            </Button>
                          </div>
                          <div className="grid gap-2">
                            {adGroup.adDescriptions?.map(
                              (description, dIndex) => (
                                <div
                                  key={dIndex}
                                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                >
                                  <span className="text-sm">{description}</span>
                                  <div className="flex items-center gap-2 ml-3">
                                    <span className="text-xs text-gray-500">
                                      {description.length}/90
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                      onClick={() =>
                                        copyToClipboard(
                                          description,
                                          `desc-${index}-${dIndex}`
                                        )
                                      }
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="preview" className="mt-4">
                        {renderAdPreview(adGroup, index)}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  const renderGenericResults = () => {
    const assetEntries = Object.entries(generatedAssets).filter(
      ([key]) => key !== "adGroups"
    );

    return (
      <div className="space-y-6">
        {assetEntries.map(([key, values]) => {
          const getAssetIcon = (key) => {
            if (key.includes("audience") || key.includes("targeting"))
              return Users;
            if (key.includes("headline") || key.includes("copy"))
              return MessageSquare;
            if (key.includes("keyword")) return Hash;
            if (
              key.includes("image") ||
              key.includes("thumbnail") ||
              key.includes("asset")
            )
              return ImageIcon;
            if (key.includes("video") || key.includes("script")) return Play;
            return Zap;
          };

          const formatTitle = (key) => {
            return key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .trim();
          };

          const renderAssetContent = (key, values) => {
            // Handle Audience Signals (Performance Max)
            if (key === "audienceSignals" && Array.isArray(values)) {
              return (
                <div className="space-y-3">
                  {values.map((audience, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {audience.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            copyToClipboard(
                              `${audience.name}: ${
                                audience.seeds?.join(", ") || ""
                              }`,
                              `audience-${index}`
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {audience.seeds?.map((seed, seedIndex) => (
                          <Badge
                            key={seedIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {seed}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // Handle Asset Recommendations (Performance Max)
            if (key === "assetRecommendations" && Array.isArray(values)) {
              return (
                <div className="space-y-3">
                  {values.map((asset, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {asset.assetType}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {asset.spec}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {asset.concept}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {asset.reason}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={() =>
                            copyToClipboard(
                              `${asset.concept} - ${asset.reason}`,
                              `asset-${index}`
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // Handle Target Audiences (App campaigns)
            if (key === "targetAudiences" && Array.isArray(values)) {
              return (
                <div className="space-y-3">
                  {values.map((audience, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {audience.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {audience.reason}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={() =>
                            copyToClipboard(
                              `${audience.name}: ${audience.reason}`,
                              `target-audience-${index}`
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // Handle Ad Copy (App campaigns)
            if (key === "adCopy" && Array.isArray(values)) {
              return (
                <div className="space-y-3">
                  {values.map((ad, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {ad.headline}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {ad.description}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {ad.cta}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={() =>
                            copyToClipboard(
                              `${ad.headline}\n${ad.description}\nCTA: ${ad.cta}`,
                              `ad-copy-${index}`
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // Handle App Store Optimization (App campaigns)
            if (
              key === "appStoreOptimization" &&
              values &&
              typeof values === "object" &&
              !Array.isArray(values)
            ) {
              return (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          App Title
                        </label>
                        <p className="text-sm font-medium text-gray-900">
                          {values.title}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Subtitle
                        </label>
                        <p className="text-sm text-gray-700">
                          {values.subtitle}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Keywords
                        </label>
                        <p className="text-sm text-gray-700">
                          {values.keywords}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={() =>
                        copyToClipboard(
                          `Title: ${values.title}\nSubtitle: ${values.subtitle}\nKeywords: ${values.keywords}`,
                          `aso`
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            }

            // Handle Creative Concepts (App campaigns)
            if (key === "creativeConcepts" && Array.isArray(values)) {
              return (
                <div className="space-y-3">
                  {values.map((concept, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {concept.format}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {concept.concept}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {concept.reason}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={() =>
                            copyToClipboard(
                              `${concept.format}: ${concept.concept}\nReason: ${concept.reason}`,
                              `creative-${index}`
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // Handle regular arrays (existing functionality)
            if (Array.isArray(values)) {
              return (
                <div className="space-y-2">
                  {values.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <span className="text-sm flex-1">
                        {typeof item === "string" ? item : JSON.stringify(item)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ml-2"
                        onClick={() =>
                          copyToClipboard(
                            typeof item === "string"
                              ? item
                              : JSON.stringify(item),
                            `${key}-${index}`
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              );
            }

            // Handle single objects or strings (existing functionality)
            return (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">
                  {typeof values === "string" ? values : JSON.stringify(values)}
                </span>
              </div>
            );
          };

          const IconComponent = getAssetIcon(key);

          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-base">
                      {formatTitle(key)}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {Array.isArray(values) ? values.length : 1}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportAssetData(key, values)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const content = Array.isArray(values)
                          ? values
                              .map((item) =>
                                typeof item === "string"
                                  ? item
                                  : JSON.stringify(item)
                              )
                              .join("\n")
                          : typeof values === "string"
                          ? values
                          : JSON.stringify(values);
                        copyToClipboard(content, key);
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderAssetContent(key, values)}</CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const CampaignIcon = campaignTypeIcons[campaignType] || Target;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          Campaign Assets Generated!
        </h2>
        <p className="text-gray-600">
          Your AI-powered {campaignTypeNames[campaignType]} campaign materials
          are ready
        </p>
      </div>

      {/* Campaign Info */}
      <Card className="mb-8 border-2 border-green-100 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <CampaignIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  {campaignName}
                </h3>
                <p className="text-green-700">
                  {campaignTypeNames[campaignType]} Campaign
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-8">
        {campaignType === "search"
          ? renderSearchResults()
          : renderGenericResults()}
      </div>

      {/* Actions */}
      <div className="text-center">
        <Button
          onClick={onCreateAnother}
          variant="outline"
          className="h-12 px-8 bg-transparent"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Another Campaign
        </Button>
      </div>
    </div>
  );
}
