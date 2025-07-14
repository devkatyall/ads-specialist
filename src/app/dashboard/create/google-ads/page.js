"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  Globe,
  ShoppingCart,
  Play,
  Smartphone,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/dashboard/global/Loader";

// Extra questions that can be added to any campaign type
const EXTRA_QUESTIONS = [
  {
    id: "brand_voice",
    label: "Brand Voice (3 adjectives)",
    type: "input",
    placeholder: "e.g. Friendly, Trustworthy, Innovative",
    required: false,
  },
  {
    id: "unique_selling_point",
    label: "Unique Selling Point *",
    type: "textarea",
    placeholder: "e.g. 30% faster than competitors, lifetime warranty",
    required: true,
  },
  {
    id: "compliance_musts",
    label: "Compliance Notes",
    type: "textarea",
    placeholder: "e.g. Avoid medical claims, include risk disclaimer",
    required: false,
  },
];

// Helper function to combine base questions with extra questions
const withExtras = (baseQuestions) => {
  return [...baseQuestions, ...EXTRA_QUESTIONS];
};

// Campaign type configurations
const campaignTypeConfig = {
  search: {
    name: "Search",
    icon: Target,
    description: "Capture high-intent customers actively searching",
    generates: ["Ad Groups", "Negative Keywords", "Ad Extensions"],
    questions: [
      {
        id: "business",
        label: "Business Description & USP",
        type: "textarea",
        placeholder: "e.g., Fitness coaching service for busy professionals...",
        required: true,
      },
      {
        id: "target_audience",
        label: "Target Audience",
        type: "textarea",
        placeholder:
          "e.g., Busy professionals aged 25-45 who want to lose weight...",
        required: true,
      },
      {
        id: "competitors",
        label: "Main Competitors",
        type: "input",
        placeholder: "e.g., Noom, MyFitnessPal, Peloton",
        required: false,
      },
      {
        id: "location",
        label: "Target Locations",
        type: "input",
        placeholder: "e.g., United States, Canada, United Kingdom",
        required: true,
      },
      {
        id: "budget_range",
        label: "Expected CPC Range",
        type: "select",
        options: [
          "$1-3 (Low)",
          "$3-8 (Medium)",
          "$8-20 (High)",
          "$20+ (Premium)",
        ],
        required: true,
      },
      {
        id: "goals",
        label: "Conversion Goal",
        type: "select",
        options: [
          "Purchase",
          "Sign up",
          "Download",
          "Contact",
          "Visit store",
          "Get quote",
        ],
        required: true,
      },
    ],
  },
  display: {
    name: "Display",
    icon: Globe,
    description: "Build brand awareness across the web",
    generates: [
      "Target Audiences",
      "Ad Headlines",
      "Ad Descriptions",
      "Image Concepts",
    ],
    questions: [
      {
        id: "business",
        label: "Business Description",
        type: "textarea",
        placeholder: "e.g., Premium eco-friendly skincare products...",
        required: true,
      },
      {
        id: "target_audience",
        label: "Target Audience",
        type: "textarea",
        placeholder: "e.g., Environmentally conscious women aged 25-40...",
        required: true,
      },
      {
        id: "brand_personality",
        label: "Brand Personality",
        type: "select",
        options: [
          "Professional",
          "Fun & Playful",
          "Luxury",
          "Eco-friendly",
          "Bold",
        ],
        required: true,
      },
      {
        id: "visual_style",
        label: "Visual Style",
        type: "select",
        options: ["Modern", "Classic", "Bold", "Minimalist", "Natural"],
        required: true,
      },
      {
        id: "competitor_analysis",
        label: "Where Competitors Advertise",
        type: "textarea",
        placeholder: "e.g., Beauty blogs, Instagram, Pinterest...",
        required: false,
      },
      {
        id: "campaign_goal",
        label: "Primary Goal",
        type: "select",
        options: [
          "Brand awareness",
          "Website traffic",
          "Lead generation",
          "Sales",
        ],
        required: true,
      },
    ],
  },
  shopping: {
    name: "Shopping",
    icon: ShoppingCart,
    description: "Showcase products in Google search results",
    generates: ["Product Groups", "Product Titles", "Product Descriptions"],
    questions: [
      {
        id: "product_catalog",
        label: "Product Catalog",
        type: "textarea",
        placeholder:
          "e.g., Premium wireless headphones, earbuds, audio accessories...",
        required: true,
      },
      {
        id: "target_market",
        label: "Target Market",
        type: "textarea",
        placeholder:
          "e.g., Music lovers, gamers, professionals who value quality audio...",
        required: true,
      },
      {
        id: "product_benefits",
        label: "Key Benefits",
        type: "textarea",
        placeholder:
          "e.g., Superior sound quality, 30-hour battery, noise cancellation...",
        required: true,
      },
      {
        id: "seasonal_trends",
        label: "Seasonal Patterns",
        type: "input",
        placeholder: "e.g., High demand during holidays, Black Friday",
        required: false,
      },
      {
        id: "price_positioning",
        label: "Price Position",
        type: "select",
        options: ["Budget-friendly", "Mid-range", "Premium", "Luxury"],
        required: true,
      },
      {
        id: "shipping_advantages",
        label: "Shipping Benefits",
        type: "input",
        placeholder: "e.g., Free shipping over $75, same-day delivery",
        required: false,
      },
    ],
  },
  video: {
    name: "Video",
    icon: Play,
    description: "Engage audiences with video content on YouTube",
    generates: ["Video Scripts", "Targeting Audiences", "Thumbnails", "CTAs"],
    questions: [
      {
        id: "business",
        label: "Business Description",
        type: "textarea",
        placeholder: "e.g., Online learning platform teaching coding skills...",
        required: true,
      },
      {
        id: "video_goal",
        label: "Video Goal",
        type: "select",
        options: [
          "Brand awareness",
          "Drive traffic",
          "Generate leads",
          "Increase sales",
          "App installs",
        ],
        required: true,
      },
      {
        id: "target_audience",
        label: "Target Audience",
        type: "textarea",
        placeholder:
          "e.g., Career changers aged 25-40 who watch tech tutorials...",
        required: true,
      },
      {
        id: "video_length",
        label: "Video Length",
        type: "select",
        options: ["6 seconds", "15-20 seconds", "30 seconds", "60+ seconds"],
        required: true,
      },
      {
        id: "brand_tone",
        label: "Video Tone",
        type: "select",
        options: ["Educational", "Entertaining", "Emotional", "Professional"],
        required: true,
      },
      {
        id: "key_message",
        label: "Main Message",
        type: "textarea",
        placeholder:
          "e.g., Anyone can learn to code and change their career...",
        required: true,
      },
    ],
  },
  pmax: {
    name: "Performance Max",
    icon: Sparkles,
    description: "Omnichannel automated campaign to hit your goals",
    generates: [
      "Asset Groups",
      "Audience Signals",
      "Headline Variants",
      "Concepts",
    ],
    questions: withExtras([
      {
        id: "business",
        label: "Business Description *",
        type: "textarea",
        required: true,
      },
      {
        id: "target_audience",
        label: "Target Audience *",
        type: "textarea",
        required: true,
      },
      {
        id: "location",
        label: "Target Locations *",
        type: "input",
        required: true,
      },
      {
        id: "primary_goal",
        label: "Primary Goal *",
        type: "select",
        options: ["Sales", "Leads", "Traffic", "Brand awareness"],
        required: true,
      },
      {
        id: "conversion_action",
        label: "Conversion Action (name) *",
        type: "input",
        placeholder: "e.g. Purchase, Form Submit",
        required: true,
      },
    ]),
  },
  app: {
    name: "App",
    icon: Smartphone,
    description: "Drive app installs and engagement",
    generates: ["Target Audiences", "Ad Copy", "ASO", "Creative Concepts"],
    questions: [
      {
        id: "app_description",
        label: "App Description",
        type: "textarea",
        placeholder:
          "e.g., Meditation app with guided sessions, sleep stories...",
        required: true,
      },
      {
        id: "target_users",
        label: "Target Users",
        type: "textarea",
        placeholder:
          "e.g., Stressed professionals and students with anxiety, sleep issues...",
        required: true,
      },
      {
        id: "app_category",
        label: "App Category",
        type: "select",
        options: [
          "Gaming",
          "Social",
          "Productivity",
          "Shopping",
          "Finance",
          "Health",
          "Education",
          "Entertainment",
        ],
        required: true,
      },
      {
        id: "monetization",
        label: "Revenue Model",
        type: "select",
        options: [
          "Free with ads",
          "Freemium",
          "Paid download",
          "In-app purchases",
          "Subscription",
        ],
        required: true,
      },
      {
        id: "key_features",
        label: "Key Features",
        type: "textarea",
        placeholder:
          "e.g., 500+ meditations, sleep timer, progress tracking...",
        required: true,
      },
      {
        id: "user_pain_points",
        label: "Problems Solved",
        type: "textarea",
        placeholder: "e.g., Helps users fall asleep faster, reduces stress...",
        required: true,
      },
      {
        id: "competitor_apps",
        label: "Competitor Apps",
        type: "input",
        placeholder: "e.g., Headspace, Calm, Insight Timer",
        required: false,
      },
    ],
  },
};

// Objective to campaign type mapping
const objectiveToCampaignType = {
  lead_generation: "search",
  sales: "pmax",
  traffic: "search",
  brand_awareness: "display",
  video_views: "video",
  app_promotion: "app",
  local_store_visits: "pmax",
  product_shopping: "shopping",
};

export default function GoogleAdsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [objective, setObjective] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [generatedAssets, setGeneratedAssets] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const totalSteps = 3;

  // Auto-select campaign type based on objective
  useEffect(() => {
    if (objective && objectiveToCampaignType[objective]) {
      setCampaignType(objectiveToCampaignType[objective]);
      setAnswers({});
    }
  }, [objective]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return (
          campaignName.trim() !== "" && budget.trim() !== "" && objective !== ""
        );
      case 2:
        if (!campaignType || !campaignTypeConfig[campaignType]) return false;
        const config = campaignTypeConfig[campaignType];
        return config.questions.every((question) => {
          if (!question.required) return true;
          const answer = answers[question.id];
          return answer && answer.trim() !== "";
        });
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaveSuccess(false);
    try {
      const response = await fetch("/api/campaign/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignType,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedAssets(data);
      setCurrentStep(4);

      try {
        const campaignToSave = {
          campaignName,
          budget,
          currency,
          objective,
          campaignType,
          answers,
          generatedAssets: data,
        };

        const response = await fetch("/api/firebase/save-google-ads/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(campaignToSave),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const savedData = await response.json();
        console.log("Campaign saved successfully:", savedData.campaignId);
        setSaveSuccess(true);
      } catch (error) {
        console.error("Failed to save campaign:", error);
        setSaveError("Failed to save campaign. Please try again.");
      } finally {
        setSaveLoading(false);
      }
    } catch (error) {
      console.error("Failed to generate campaign assets:", error);
      setError("Failed to generate campaign assets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setError("");
    try {
      const campaignToSave = {
        campaignName,
        budget,
        currency,
        objective,
        campaignType,
        answers,
        generatedAssets,
      };

      const response = await fetch("/api/firebase/save-google-ads/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignToSave),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Campaign saved successfully:", data.campaignId);
      setSaveSuccess(true);
      setSaveError("");
    } catch (error) {
      console.error("Failed to save campaign:", error);
      setError("Failed to save campaign. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setCurrentStep(1);
    setCampaignName("");
    setBudget("");
    setObjective("");
    setCampaignType("");
    setAnswers({});
    setGeneratedAssets(null);
    setError("");
    setSaveError("");
    setSaveSuccess(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className=" mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Campaign Details</CardTitle>
                  <CardDescription>Basic campaign information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label
                      htmlFor="campaignName"
                      className="text-sm font-medium"
                    >
                      Campaign Name
                    </Label>
                    <Input
                      id="campaignName"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Google Ads Name"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Daily Budget
                      </Label>
                      <div className="flex gap-2">
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="100"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Right Column - Objective */}
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Campaign Objective</CardTitle>
                  <CardDescription>
                    What do you want to achieve?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "lead_generation", label: "Lead Generation" },
                      { value: "sales", label: "Sales" },
                      { value: "traffic", label: "Website Traffic" },
                      { value: "brand_awareness", label: "Brand Awareness" },
                      { value: "video_views", label: "Video Views" },
                      { value: "app_promotion", label: "App Promotion" },
                      { value: "local_store_visits", label: "Store Visits" },
                      { value: "product_shopping", label: "Product Shopping" },
                    ].map((obj) => (
                      <Button
                        key={obj.value}
                        variant={
                          objective === obj.value ? "default" : "outline"
                        }
                        onClick={() => setObjective(obj.value)}
                        className="justify-start h-9"
                        size="sm"
                      >
                        {obj.label}
                      </Button>
                    ))}
                  </div>
                  {campaignType && campaignTypeConfig[campaignType] && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        {React.createElement(
                          campaignTypeConfig[campaignType].icon,
                          {
                            className: "h-4 w-4 text-green-600",
                          }
                        )}
                        <span className="font-medium text-green-900 text-sm">
                          {campaignTypeConfig[campaignType].name} Campaign
                        </span>
                      </div>
                      <p className="text-xs text-green-700">
                        {campaignTypeConfig[campaignType].description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {campaignTypeConfig[campaignType].generates
                          .slice(0, 3)
                          .map((item, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              {item}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 2:
        if (!campaignType || !campaignTypeConfig[campaignType]) {
          return (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Please select an objective first.</p>
            </div>
          );
        }
        const config = campaignTypeConfig[campaignType];
        return (
          <div className=" mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {React.createElement(config.icon, {
                  className: "h-5 w-5 text-green-600",
                })}
                <h2 className="text-xl font-semibold">
                  {config.name} Campaign Questions
                </h2>
              </div>
              <p className="text-gray-600 text-sm">{config.description}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {config.questions.map((question, index) => (
                <Card key={question.id} className="h-fill">
                  <CardContent className="my-auto">
                    <Label
                      htmlFor={question.id}
                      className="text-sm font-medium flex items-center gap-2 mb-2"
                    >
                      {question.label}
                      {question.required && (
                        <span className="text-red-500 text-xs">*</span>
                      )}
                    </Label>
                    {question.type === "textarea" && (
                      <Textarea
                        id={question.id}
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        placeholder={question.placeholder}
                        rows={3}
                        className="resize-none text-sm"
                      />
                    )}
                    {question.type === "input" && (
                      <Input
                        id={question.id}
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        placeholder={question.placeholder}
                        className="text-sm"
                      />
                    )}
                    {question.type === "select" && (
                      <Select
                        value={answers[question.id] || ""}
                        onValueChange={(value) =>
                          handleAnswerChange(question.id, value)
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option) => (
                            <SelectItem
                              key={option}
                              value={option.toLowerCase().replace(/\s+/g, "_")}
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Add this after the questions grid */}
          </div>
        );
      case 3:
        return (
          <div className=" mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Review Campaign Details
                </CardTitle>
                <CardDescription>
                  Confirm your information before generating assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Campaign</span>
                    <p className="font-medium">{campaignName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Budget</span>
                    <p className="font-medium">
                      {currency} {budget}/day
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Objective</span>
                    <p className="font-medium">
                      {objective
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Type</span>
                    <p className="font-medium">
                      {campaignTypeConfig[campaignType]?.name}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-sm">Strategic Inputs</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {Object.entries(answers).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded text-sm">
                        <p className="font-medium text-gray-700 capitalize mb-1">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 4:
        return !loading ? (
          <div className="mx-auto ">
            <div className="p-8 bg-gradient-to-r from-teal-400 to-indigo-600 rounded-xl ">
              <h5 className="font-medium mb-3 text-base text-white drop-shadow">
                {campaignTypeConfig[campaignType]?.name} Strategy Created
              </h5>
              <h4 className="font-bold  text-2xl text-white max-w-4xl">
                {campaignName} is ready now.
              </h4>
              <p className="text-sm text-white ">
                You can now copy and export all the assets needed for your
                Google Ads from campaigns page.
              </p>
              <div className="mt-6 flex gap-3">
                <Button
                  asChild
                  className={"hover:bg-white hover:text-black cursor-pointer"}
                >
                  <Link href="/dashboard/campaigns/google-ads">
                    Go to Campaigns{" "}
                  </Link>
                </Button>
                <Button
                  onClick={handleCreateAnother}
                  variant={"ghost"}
                  className={"text-white cursor-pointer"}
                >
                  Create Another Campaign
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {currentStep === 1 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-full p-2 ring-1 ring-gray-300">
                <img
                  src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_ads-1024.png"
                  alt="Google Ads"
                  className="w-10 h-10"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold mb-1">
                  Google Ads Campaign
                </h1>
                <p className="text-gray-600 text-sm">
                  Create strategic campaigns with AI-generated assets
                </p>
              </div>
            </div>
          )}
          {currentStep <= 3 && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </div>
              <Progress
                value={(currentStep / totalSteps) * 100}
                className="w-32 h-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">{renderStepContent()}</div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700  mx-auto">
          {error}
        </div>
      )}

      {saveError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700  mx-auto flex gap-2 items-center justify-between">
          {saveError}{" "}
          <Button onClick={handleSave} variant={"outline"}>
            <RefreshCcw /> Try Again
          </Button>
        </div>
      )}

      {/* Navigation */}
      {currentStep <= 3 && (
        <div className="flex justify-between  mx-auto">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !isStepValid(currentStep)}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Campaign
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
