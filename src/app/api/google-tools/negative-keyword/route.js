// app/api/campaign/negative-keywords/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_ID = process.env.GEMINI_MODEL_ID || "gemini-1.5-pro";

function buildNegativeKeywordsPrompt({
  campaignName,
  businessAbout,
  campaignObjective,
  keywords,
  keywordGroups,
  adCopy,
  landingPage,
}) {
  return `<<SYSTEM>>
Role: Senior Google Ads strategist (20 y).

Rules:
- Generate a comprehensive list of negative keywords to avoid wasted spend.
- Include irrelevant topics, competitor names, misspellings, DIY terms, job seekers, free offers, low intent words.
- Avoid duplicates with provided keywords.
- Return ONLY a JSON array of strings, min max 150 items.

<<END_SYSTEM>>

<<USER>>
Campaign Name: ${campaignName}
Business About: ${businessAbout}
Campaign Objective: ${campaignObjective}
Keywords: ${JSON.stringify(keywords)}
Keyword Groups: ${JSON.stringify(keywordGroups)}
adCopy: ${adCopy}
Landing Page Info: ${landingPage}

## OUTPUT ONLY JSON ARRAY ##
<<END_USER>>`;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    campaignName,
    businessAbout,
    campaignObjective,
    keywords,
    keywordGroups,
    adCopy,
    landingPage,
  } = body;
  if (
    !campaignName ||
    !businessAbout ||
    !campaignObjective ||
    !keywords ||
    !keywordGroups
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const prompt = buildNegativeKeywordsPrompt({
    campaignName,
    businessAbout,
    campaignObjective,
    keywords,
    keywordGroups,
    adCopy,
    landingPage,
  });
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_ID });

  try {
    const { response } = await model.generateContent(prompt, {
      generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 512 },
    });

    let raw = await response.text();
    raw = raw.replace(/^```json\n?|```$/g, "").trim();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "AI response is not valid JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json({ negativeKeywords: data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
