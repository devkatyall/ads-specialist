// app/dashboard/ad-copy/page.jsx
"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Award, Sparkles, Star, Tally5, Terminal } from "lucide-react"; // Example icon for Alert
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons for navigation
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function AdCopyGeneratorPage() {
  // Form State
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("");
  const [numCopies, setNumCopies] = useState(3);

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const totalSteps = 3; // Total number of form steps

  // --- Validation Functions for each step ---
  const validateStep1 = () => {
    if (!projectName.trim()) {
      setError("Project Name is required.");
      toast.error("Project Name is required.");
      return false;
    }
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      toast.error("Description must be at least 10 characters.");
      return false;
    }
    setError(null); // Clear previous errors
    return true;
  };

  const validateStep2 = () => {
    if (numCopies < 1 || numCopies > 10) {
      setError("Number of copies must be between 1 and 10.");
      toast.error("Number of copies must be between 1 and 10.");
      return false;
    }
    setError(null); // Clear previous errors
    return true;
  };

  // --- Navigation Functions ---
  const handleNextStep = () => {
    setError(null); // Clear error on step change attempt

    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setError(null); // Clear error on step change attempt
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // --- Final Submission Function ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null);
    setResults(null);
    setIsLoading(true);

    // Final validation before sending to API (e.g., if user skips steps)
    if (!validateStep1() || !validateStep2()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/google-tools/ad-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          description,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
          tone,
          numCopies: parseInt(numCopies, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to generate ad copies. Please try again."
        );
      }

      const data = await response.json();
      setResults(data);

      // Save to Firebase
      await fetch("/api/firebase/save-ad-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          description,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
          tone,
          numCopies,
          strategicOverview: data.strategicOverview, // ✅ pulled from Gemini response
          adCopies: data.adCopies, // ✅ required by backend
          creativeRationale: data.creativeRationale, // ✅ optional but handled
          timestamp: new Date().toISOString(),
        }),
      });

      toast.success("Ad copies generated and rated successfully!");

      console.log("Ad copies generated successfully:", data);
    } catch (err) {
      console.error("Frontend Ad Copy Generation Error:", err);
      setError(
        err.message,
        "Please try again. If the error persists, contact support."
      );
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render logic for each step ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2 bg-white rounded-lg shadow-md shadow-blue-200 p-4">
              <Label htmlFor="projectName">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., EcoClean Dishwasher Pods Launch"
                required
              />
              <p className="text-xs text-gray-500">
                A concise name for your ad campaign or product launch.
              </p>
            </div>

            <div className="space-y-2 bg-white rounded-lg shadow-md shadow-blue-200 p-4">
              <Label htmlFor="description">
                Product/Service Description{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product or service in detail. What does it do? What problems does it solve?"
                rows={5}
                required
                className={"max-h-40 min-h-30"}
              />
              <p className="text-xs text-gray-500">
                Provide comprehensive details about what you're advertising.
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2 bg-white rounded-lg shadow-md shadow-blue-200 p-4">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., eco-friendly, dishwasher pods, natural cleaning"
              />
              <p className="text-xs text-gray-500">
                Words or phrases relevant to your product, audience, or
                industry.
              </p>
            </div>

            <div className="space-y-2 bg-white rounded-lg shadow-md shadow-blue-200 p-4">
              <Label htmlFor="tone">Desired Tone</Label>
              <Input
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g., enthusiastic, professional, humorous"
              />
              <p className="text-xs text-gray-500">
                The overall style or emotion you want the ad copy to convey.
              </p>
            </div>

            <div className="space-y-2 bg-white rounded-lg shadow-md shadow-blue-200 p-4">
              <Label htmlFor="numCopies">Number of Copies to Generate</Label>
              <Input
                id="numCopies"
                type="number"
                value={numCopies}
                onChange={(e) =>
                  setNumCopies(parseInt(e.target.value, 10) || 0)
                } // Handle empty input gracefully
                min="1"
                max="10"
                className="w-24"
              />
              <p className="text-xs text-gray-500">
                How many variations of ad copy do you want? (1-10)
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 bg-white rounded-lg shadow-md shadow-blue-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Review Your Details
            </h2>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3">
              <div>
                <p className="text-md font-semibold text-gray-700">
                  Project Name:
                </p>
                <p className="ml-2 text-gray-900">{projectName || "N/A"}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-700">
                  Description:
                </p>
                <p className="ml-2 text-gray-900">{description || "N/A"}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-700">Keywords:</p>
                <p className="ml-2 text-gray-900">{keywords || "N/A"}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-700">
                  Desired Tone:
                </p>
                <p className="ml-2 text-gray-900">{tone || "N/A"}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-700">
                  Number of Copies:
                </p>
                <p className="ml-2 text-gray-900">{numCopies || "N/A"}</p>
              </div>
            </div>
            <p className="text-gray-700">
              Click "Generate" below to submit your request to the AI.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm uppercase font-semibold text-slate-400">
              Ad Copy Expert
            </h2>
            <p className="text-2xl capitalize font-medium ">
              Generate wining ad copies for your product or service
            </p>
            <div className="flex gap-2 flex-wrap text-xs mt-4">
              <p className=" bg-green-200 px-4 py-2 rounded-full flex items-center">
                <Tally5 className="h-4 w-4 mr-2 text-green-600" />
                Different Variations
              </p>
              <p className=" bg-blue-200 px-4 py-2 rounded-full flex items-center">
                <Award className="h-4 w-4 mr-2 text-blue-600" />
                Top Practices
              </p>
              <p className=" bg-yellow-200 px-4 py-2 rounded-full flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-600" />
                Rating & Reasoning
              </p>
            </div>
          </div>
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
      <div className="container ">
        {!results ? (
          <div className="space-y-6 ">
            {renderStepContent()}

            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between mt-6">
              <Button
                type="button" // Important: prevents form submission
                onClick={handlePrevStep}
                disabled={currentStep === 1 || isLoading}
                variant="outline"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  type="button" // Important: prevents form submission
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Ad Copies
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-auto ">
            <div className="p-8 bg-gradient-to-r from-teal-400 to-indigo-600 rounded-xl ">
              <h5 className="font-medium mb-3 text-base text-white drop-shadow">
                {projectName} Created
              </h5>
              <h4 className="font-bold  text-2xl text-white max-w-4xl">
                {projectName} is ready now.
              </h4>
              <p className="text-sm text-white ">
                You can now copy and export all the copies needed for your Ads
                from Ad copies page.
              </p>
              <div className="mt-6 flex gap-3">
                <Button
                  asChild
                  className={"hover:bg-white hover:text-black cursor-pointer"}
                >
                  <Link href="/dashboard/google-tools/ad-copy">
                    Go to Project{" "}
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    setCurrentStep(1);
                    setProjectName(""); // Clear form if desired
                    setDescription("");
                    setKeywords("");
                    setTone("");
                    setNumCopies(3);
                    setError(null);
                    setResults(null);
                  }}
                  variant={"ghost"}
                  className={"text-white cursor-pointer"}
                >
                  Create Another Project
                </Button>
              </div>
            </div>
          </div>
        )}

        <Toaster richColors />
      </div>
    </div>
  );
}
