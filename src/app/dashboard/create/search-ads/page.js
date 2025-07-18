"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Loader from "@/components/dashboard/global/Loader";
import GoogleAdsEditorTable from "@/components/dashboard/search-ads/ad-results";

export default function SearchCampaignBuilder() {
  const [campaignName, setCampaignName] = useState("");
  const [businessAbout, setBusinessAbout] = useState("");
  const [objective, setObjective] = useState(""); // default or let user pick
  const [landingPageUrl, setLandingPageUrl] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedAssets, setGeneratedAssets] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (
      !campaignName ||
      !businessAbout ||
      !objective ||
      !landingPageUrl ||
      !budget
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/campaign/ad-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName,
          businessAbout,
          objective,
          landingPageUrl,
          budget,
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      setGeneratedAssets(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate campaign assets. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto">
        {loading ? (
          <>
            <Loader />
            Generating...
          </>
        ) : (
          <Card className={"max-w-3xl mx-auto my-8"}>
            <CardHeader>
              <CardTitle>Build a Search Campaign</CardTitle>
              <CardDescription>
                Fill out the details below and we'll generate your Google Search
                Campaign assets.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="My Search Campaign"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAbout">About Your Business *</Label>
                  <Textarea
                    id="businessAbout"
                    value={businessAbout}
                    onChange={(e) => setBusinessAbout(e.target.value)}
                    placeholder="Tell us about your business..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">Detailed Campaign Objective *</Label>
                  <Textarea
                    id="objective"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g. We are going to try to get people to visit website through deal: Buy 1 get one free"
                    required
                      rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landingPageUrl">Landing Page URL *</Label>
                  <Input
                    id="landingPageUrl"
                    value={landingPageUrl}
                    onChange={(e) => setLandingPageUrl(e.target.value)}
                    placeholder="https://your-landing-page.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Daily Budget (USD) *</Label>
                  <Input
                    type="number"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="100"
                    min={1}
                    required
                  />
                </div>

                {error && <p className="text-red-600">{error}</p>}

                <Button type="submit" disabled={loading}>
                  Generate Campaign Assets
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Results */}
      </div>
      {generatedAssets && (
        <div className="mt-8 p-6 bg-green-100 rounded-md">
          <h2 className="text-xl font-bold mb-2">
            ✅ Campaign Assets Generated!
          </h2>
          <GoogleAdsEditorTable data={generatedAssets} />
          <pre>{JSON.stringify(generatedAssets, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
