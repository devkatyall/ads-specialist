"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  Lightbulb,
  Plus,
  ArrowLeft,
  RefreshCcw,
  Sparkles,
  Target,
  Users,
  Brain,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

// The 12 strategy types from the API
const STRATEGY_TYPES = [
  {
    id: "the_niche_expert",
    name: "The Niche Expert",
    icon: Target,
    color: "blue",
    description: "Position as the go-to specialist",
  },
  {
    id: "the_differentiator",
    name: "The Differentiator",
    icon: Zap,
    color: "purple",
    description: "Highlight what makes you unique",
  },
  {
    id: "the_standout_feature",
    name: "The Standout Feature",
    icon: Sparkles,
    color: "yellow",
    description: "Focus on your best feature",
  },
  {
    id: "the_benefit_banker",
    name: "The Benefit Banker",
    icon: Plus,
    color: "green",
    description: "Lead with customer benefits",
  },
  {
    id: "the_target_filter",
    name: "The Target Filter",
    icon: Users,
    color: "cyan",
    description: "Speak directly to your audience",
  },
  {
    id: "the_alliterative_artist",
    name: "The Alliterative Artist",
    icon: Brain,
    color: "pink",
    description: "Use memorable word patterns",
  },
  {
    id: "the_scorekeeper",
    name: "The Scorekeeper",
    icon: Target,
    color: "orange",
    description: "Use numbers and metrics",
  },
  {
    id: "the_conversationalist",
    name: "The Conversationalist",
    icon: Users,
    color: "indigo",
    description: "Create dialogue with audience",
  },
  {
    id: "the_speed_demon",
    name: "The Speed Demon",
    icon: Zap,
    color: "red",
    description: "Emphasize speed and urgency",
  },
  {
    id: "the_pain_point_prodder",
    name: "The Pain Point Prodder",
    icon: Target,
    color: "gray",
    description: "Address customer problems",
  },
  {
    id: "the_subtle_competitor",
    name: "The Subtle Competitor",
    icon: Sparkles,
    color: "teal",
    description: "Indirect competitive positioning",
  },
  {
    id: "the_key_message_reinforcer",
    name: "The Key Message Reinforcer",
    icon: Brain,
    color: "violet",
    description: "Reinforce core brand message",
  },
];

const getStrategyInfo = (index) => {
  return STRATEGY_TYPES[index] || STRATEGY_TYPES[0];
};

const getColorClasses = (color) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    green: "bg-green-50 text-green-700 border-green-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return colorMap[color] || colorMap.blue;
};

export default function ConceptStrategiesResults({
  campaignName,
  generatedAssets,
  onCreateAnother,
  date,
}) {
  const [activeView, setActiveView] = useState("grid");
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [refreshingIndex, setRefreshingIndex] = useState(null);

  const copyToClipboard = async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const copyAllConcepts = () => {
    const allConceptsText = generatedAssets.concepts
      .map((concept, index) => {
        const strategy = getStrategyInfo(index);
        return `=== ${strategy.name} ===\n${
          concept.headlines?.join("\n") || ""
        }\n\nDescription: ${concept.description || ""}\n\nRationale: ${
          concept.rationale || ""
        }\n\n`;
      })
      .join("\n");

    copyToClipboard(allConceptsText, "all-concepts");
  };

  const exportConcepts = () => {
    const dataStr = JSON.stringify(generatedAssets.concepts, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${campaignName.replace(
      /\s+/g,
      "_"
    )}_concepts.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Concepts exported!");
  };

  const renderConceptCard = (concept, index) => {
    const strategy = getStrategyInfo(index);
    const IconComponent = strategy.icon;

    return (
      <Card
        key={index}
        className={`border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
          selectedConcept === index
            ? `border-${strategy.color}-300 shadow-md`
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() =>
          setSelectedConcept(selectedConcept === index ? null : index)
        }
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${getColorClasses(
                  strategy.color
                )}`}
              >
                <IconComponent className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">
                  {strategy.name}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  {strategy.description}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              #{index + 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Headlines */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1.5">
                Headlines
              </h4>
              <div className="space-y-1">
                {concept.headlines?.slice(0, 3).map((headline, hIndex) => (
                  <div
                    key={hIndex}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs group"
                  >
                    <span className="font-medium truncate flex-1">
                      {headline}
                    </span>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="text-gray-400">
                        {headline?.length || 0}/30
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-4 w-4 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(
                            headline,
                            `concept-${index}-headline-${hIndex}`
                          );
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {concept.description && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1.5">
                  Description
                </h4>
                <div className="p-2 bg-gray-50 rounded text-xs group">
                  <p className="text-gray-600 leading-relaxed">
                    {concept.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-400">
                      {concept.description?.length || 0}/90
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-4 w-4 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          concept.description,
                          `concept-${index}-description`
                        );
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Rationale */}
            {concept.rationale && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1.5">
                  Strategy Rationale
                </h4>
                <div className="p-2 bg-blue-50 rounded text-xs">
                  <p className="text-blue-700 leading-relaxed italic">
                    {concept.rationale}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-1 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs flex-1 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  const conceptText = `${strategy.name}\n\nHeadlines:\n${
                    concept.headlines?.join("\n") || ""
                  }\n\nDescription: ${
                    concept.description || ""
                  }\n\nRationale: ${concept.rationale || ""}`;
                  copyToClipboard(conceptText, `concept-${index}`);
                }}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  // Could implement individual concept refinement here
                  toast.info("Refinement coming soon!");
                }}
              >
                <RefreshCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderListView = () => {
    return (
      <div className="space-y-3">
        {generatedAssets.concepts?.map((concept, index) => {
          const strategy = getStrategyInfo(index);
          const IconComponent = strategy.icon;

          return (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${getColorClasses(
                      strategy.color
                    )} flex-shrink-0`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{strategy.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {strategy.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-2">
                          Headlines
                        </h4>
                        <div className="space-y-1">
                          {concept.headlines?.map((headline, hIndex) => (
                            <div
                              key={hIndex}
                              className="text-xs p-1.5 bg-gray-50 rounded"
                            >
                              {headline}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-2">
                          Description
                        </h4>
                        <div className="text-xs p-1.5 bg-gray-50 rounded">
                          {concept.description}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-2">
                          Rationale
                        </h4>
                        <div className="text-xs p-1.5 bg-blue-50 rounded text-blue-700 italic">
                          {concept.rationale}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs bg-transparent"
                        onClick={() => {
                          const conceptText = `${
                            strategy.name
                          }\n\nHeadlines:\n${
                            concept.headlines?.join("\n") || ""
                          }\n\nDescription: ${
                            concept.description || ""
                          }\n\nRationale: ${concept.rationale || ""}`;
                          copyToClipboard(conceptText, `list-concept-${index}`);
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-medium flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              {campaignName} - Creative Concepts
            </h1>
            <p className="text-sm text-gray-600">
              12 strategic approaches • Generated {date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg p-1">
            <Button
              variant={activeView === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setActiveView("grid")}
            >
              Grid
            </Button>
            <Button
              variant={activeView === "list" ? "default" : "ghost"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setActiveView("list")}
            >
              List
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs bg-transparent"
            onClick={copyAllConcepts}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs bg-transparent"
            onClick={exportConcepts}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border border-gray-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-semibold text-blue-600">
              {generatedAssets.concepts?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Concepts</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-semibold text-green-600">
              {generatedAssets.concepts?.reduce(
                (acc, concept) => acc + (concept.headlines?.length || 0),
                0
              ) || 0}
            </div>
            <div className="text-xs text-gray-500">Headlines</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-semibold text-purple-600">12</div>
            <div className="text-xs text-gray-500">Strategies</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-semibold text-orange-600">100%</div>
            <div className="text-xs text-gray-500">Coverage</div>
          </CardContent>
        </Card>
      </div> */}

      {/* Content */}
      {activeView === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedAssets.concepts?.map((concept, index) =>
            renderConceptCard(concept, index)
          )}
        </div>
      ) : (
        renderListView()
      )}

      {/* Bottom Action */}
      <div className="text-center mt-8">
        <Button onClick={onCreateAnother} className="h-9 px-6 text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Another Campaign
        </Button>
      </div>
    </div>
  );
}
