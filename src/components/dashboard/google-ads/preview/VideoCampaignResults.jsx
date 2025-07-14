"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  Play,
  Plus,
  Calendar,
  ArrowLeft,
  Video,
  Zap,
  Target,
} from "lucide-react";
import { toast } from "sonner";

export default function VideoCampaignResults({
  campaignName,
  generatedAssets,
  onCreateAnother,
}) {
  const [activeTab, setActiveTab] = useState("scripts");
  const [assetData, setAssetData] = useState(generatedAssets);

  const copyToClipboard = async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const renderVideoScripts = () => {
    const allScripts = [
      ...(assetData.videoScripts || []),
      ...(assetData.bumperScripts || []),
      ...(assetData.skippableScripts || []),
    ];

    if (allScripts.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Video Scripts</h2>
            <p className="text-xs text-gray-500">
              {allScripts.length} video concepts for YouTube advertising
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

        <div className="space-y-4">
          {/* Bumper Scripts */}
          {assetData.bumperScripts && assetData.bumperScripts.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Bumper Ads (6 seconds)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assetData.bumperScripts.map((script, index) => (
                  <Card
                    key={index}
                    className="border border-gray-200 hover:border-yellow-300 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-yellow-600">
                          Bumper Script {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(script),
                              `bumper-${index}`
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {typeof script === "object" ? (
                          <>
                            {script.hook && (
                              <div>
                                <span className="text-xs font-medium text-gray-700">
                                  Hook (0-2s):
                                </span>
                                <p className="text-xs text-gray-600 mt-1">
                                  {script.hook}
                                </p>
                              </div>
                            )}
                            {script.message && (
                              <div>
                                <span className="text-xs font-medium text-gray-700">
                                  Message (2-5s):
                                </span>
                                <p className="text-xs text-gray-600 mt-1">
                                  {script.message}
                                </p>
                              </div>
                            )}
                            {script.cta && (
                              <div>
                                <span className="text-xs font-medium text-gray-700">
                                  CTA (5-6s):
                                </span>
                                <p className="text-xs text-gray-600 mt-1">
                                  {script.cta}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-gray-600">{script}</p>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Bumper Ad
                        </Badge>
                        <span className="text-xs text-gray-400">6 seconds</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Skippable Scripts */}
          {assetData.skippableScripts &&
            assetData.skippableScripts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Skippable Ads (15-90 seconds)
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {assetData.skippableScripts.map((script, index) => (
                    <Card
                      key={index}
                      className="border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-blue-600">
                            Skippable Script {index + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(script),
                                `skippable-${index}`
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {typeof script === "object" ? (
                            <>
                              {script.hook && (
                                <div>
                                  <span className="text-xs font-medium text-gray-700">
                                    Hook (0-5s):
                                  </span>
                                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    {script.hook}
                                  </p>
                                </div>
                              )}
                              {script.body && (
                                <div>
                                  <span className="text-xs font-medium text-gray-700">
                                    Body:
                                  </span>
                                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    {script.body}
                                  </p>
                                </div>
                              )}
                              {script.cta && (
                                <div>
                                  <span className="text-xs font-medium text-gray-700">
                                    Call to Action:
                                  </span>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {script.cta}
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {script}
                            </p>
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Skippable Ad
                          </Badge>
                          <span className="text-xs text-gray-400">
                            15-90 seconds
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          {/* General Video Scripts */}
          {assetData.videoScripts && assetData.videoScripts.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Video Scripts
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {assetData.videoScripts.map((script, index) => (
                  <Card
                    key={index}
                    className="border border-gray-200 hover:border-purple-300 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-purple-600">
                          Video Script {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(script),
                              `video-${index}`
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {typeof script === "object"
                            ? script.script || script.description
                            : script}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Video Script
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVideoThumbnails = () => {
    if (!assetData.videoThumbnails || assetData.videoThumbnails.length === 0)
      return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Video Thumbnails</h2>
            <p className="text-xs text-gray-500">
              {assetData.videoThumbnails.length} thumbnail concepts
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Thumbnail
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
          {assetData.videoThumbnails.map((thumbnail, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-orange-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-orange-600">
                    {typeof thumbnail === "object"
                      ? thumbnail.title || `Thumbnail ${index + 1}`
                      : `Thumbnail ${index + 1}`}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() =>
                      copyToClipboard(
                        typeof thumbnail === "object"
                          ? JSON.stringify(thumbnail)
                          : thumbnail,
                        `thumbnail-${index}`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {typeof thumbnail === "object"
                      ? thumbnail.concept || thumbnail.description
                      : thumbnail}
                  </p>
                  {typeof thumbnail === "object" && thumbnail.reason && (
                    <p className="text-xs text-gray-500 italic">
                      {thumbnail.reason}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                  >
                    Thumbnail
                  </Badge>
                  <span className="text-xs text-gray-400">1.91:1</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCallToActions = () => {
    if (!assetData.callToActions || assetData.callToActions.length === 0)
      return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Call to Actions</h2>
            <p className="text-xs text-gray-500">
              {assetData.callToActions.length} CTA options
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add CTA
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs bg-transparent"
              onClick={() =>
                copyToClipboard(assetData.callToActions.join("\n"), "all-ctas")
              }
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {assetData.callToActions.map((cta, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:border-green-300 transition-colors"
            >
              <CardContent className="p-3">
                <div className="text-center">
                  <p className="text-sm font-medium text-green-600 mb-2">
                    {cta}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(cta, `cta-${index}`)}
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

  const generateTabs = () => {
    const tabs = [];

    // Video Scripts (all types combined)
    const totalScripts =
      (assetData.videoScripts?.length || 0) +
      (assetData.bumperScripts?.length || 0) +
      (assetData.skippableScripts?.length || 0);

    if (totalScripts > 0) {
      tabs.push({
        id: "scripts",
        label: "Video Scripts",
        icon: Video,
        count: totalScripts,
        subtitle: "scripts",
        color: "blue",
      });
    }

    // Thumbnails
    if (assetData.videoThumbnails && assetData.videoThumbnails.length > 0) {
      tabs.push({
        id: "thumbnails",
        label: "Thumbnails",
        icon: Target,
        count: assetData.videoThumbnails.length,
        subtitle: "thumbnails",
        color: "orange",
      });
    }

    // Call to Actions
    if (assetData.callToActions && assetData.callToActions.length > 0) {
      tabs.push({
        id: "ctas",
        label: "Call to Actions",
        icon: Target,
        count: assetData.callToActions.length,
        subtitle: "CTAs",
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
              <Play className="h-4 w-4" />
              {campaignName}
            </h1>
            <p className="text-xs text-gray-500">
              Video Campaign • Generated {new Date().toLocaleDateString()}
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
              orange: isActive
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-600 hover:text-gray-900",
              green: isActive
                ? "border-green-500 text-green-600"
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
                        : tab.color === "orange"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-green-50 text-green-700"
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
        <div className={activeTab === "scripts" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderVideoScripts()}</CardContent>
          </Card>
        </div>

        <div className={activeTab === "thumbnails" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderVideoThumbnails()}</CardContent>
          </Card>
        </div>

        <div className={activeTab === "ctas" ? "block" : "hidden"}>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">{renderCallToActions()}</CardContent>
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
