// app/api/ab-test/generate-hypothesis/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  // }

  try {
    const {
      campaignContext, // Object containing businessDescription, targetAudience, etc.
      assetTypeToTest, // e.g., "Ad Headline", "Ad Description", "CTA Text"
      originalAssetContent, // Optional: The existing asset content if testing a specific change
    } = await req.json();

    if (!campaignContext || !assetTypeToTest) {
      return NextResponse.json(
        { error: "Missing required campaign context or asset type to test." },
        { status: 400 }
      );
    }

    const { businessDescription, targetAudience, campaignGoal, brandTone } =
      campaignContext;

    if (!businessDescription || !targetAudience || !campaignGoal) {
      return NextResponse.json(
        {
          error:
            "Business description, target audience, and campaign goal are required in campaignContext.",
        },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL_ID, // Use your existing model ID
    });

    let prompt = `
    You are an expert A/B testing specialist and direct-response copywriter.
    Your task is to generate two distinct, high-performing variations (Variant A and Variant B) for a specific advertising asset, and then formulate a clear A/B test hypothesis based on these variants.

    **Context for Asset Generation and Hypothesis:**
    Business Description: ${businessDescription}
    Target Audience: ${targetAudience}
    Campaign Goal: ${campaignGoal}
    ${brandTone ? `Brand Tone: ${brandTone}\n` : ""}

    **Asset to Test:** ${assetTypeToTest}
    ${
      originalAssetContent
        ? `Original Asset (Variant A will be based on this or be this exactly): "${originalAssetContent}"\n`
        : ""
    }

    **Guidelines for Asset Variants:**
    - Generate two distinct variants (A and B).
    - Each variant should be compelling and designed to achieve the campaign goal.
    - They should be different enough to warrant an A/B test.
    - If "Ad Headline": max 30 characters each.
    - If "Ad Description": max 90 characters each.
    - If "CTA Text": max 15 characters each.
    - For other asset types, use appropriate length for an ad/landing page.

    **Guidelines for Hypothesis:**
    - Follow the format: "If we change the [Asset Type] from '[Variant A Content]' to '[Variant B Content]', then we expect to [increase/decrease/improve] [Primary Metric] by [X]% because [clear, concise reasoning about why Variant B is better]."
    - The reasoning should directly connect the change in Variant B to the expected outcome based on marketing principles or target audience psychology.
    - Suggest a primary metric to track for this test (e.g., Click-Through Rate (CTR), Conversion Rate, Engagement Rate, Cost Per Lead).
    - Suggest a reasonable duration for the test (e.g., "1 week", "2 weeks", "1 month").

    **Output exactly as JSON, following this schema:**
    ${JSON.stringify(
      {
        testName: "Generated Test Name (e.g., Headline A/B Test for [Product])",
        hypothesis:
          "If we change the [Asset Type] from '[Variant A Content]' to '[Variant B Content]', then we expect to [increase/decrease/improve] [Primary Metric] by [X]% because [reasoning].",
        variants: [
          {
            id: "A",
            type: "Asset Type (e.g., Ad Headline)",
            content: "Generated content for Variant A",
            reasoning:
              "Why this variant is compelling or represents the control.",
          },
          {
            id: "B",
            type: "Asset Type (e.g., Ad Headline)",
            content: "Generated content for Variant B",
            reasoning:
              "Why this variant is expected to outperform A, tied to the hypothesis.",
          },
        ],
        primaryMetric:
          "Suggested primary metric for this test (e.g., CTR, Conversion Rate)",
        suggestedDuration:
          "Suggested test duration (e.g., '2 weeks', '1 month')",
      },
      null,
      2
    )}
    `;

    const { response } = await model.generateContent(prompt);
    let text = response
      .text()
      .replace(/^```json\n?|```$/g, "")
      .trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      // Robust parsing in case Gemini adds extra text
      const first = text.indexOf("{");
      const last = text.lastIndexOf("}");
      if (first === -1 || last === -1 || last <= first) {
        throw new Error(
          "Gemini did not return valid JSON or JSON was unparseable."
        );
      }
      data = JSON.parse(text.slice(first, last + 1));
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error generating A/B test:", err);
    const blocked = err?.response?.candidates?.[0]?.finishReason === "SAFETY";
    return NextResponse.json(
      {
        error: blocked
          ? "Content generation blocked by safety filters. Please adjust your input."
          : "Failed to generate A/B test. Please try again.",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
