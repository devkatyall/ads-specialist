import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_ID = process.env.GEMINI_MODEL_ID || "gemini-1.5-pro";

function buildPrompt({
  campaignName,
  businessAbout,
  campaignObjective,
  landingPageData,
  budget,
}) {
  return `<<SYSTEM>>
Role: Senior Google Ads strategist with 20 years experience.

Task:
Generate a focused list of exact and phrase match keywords for a Search campaign.
Do NOT include broad match keywords.
Group keywords into tightly themed groups.
Include numeric proof if relevant.
Avoid duplicates and generic terms.
Use terms likely searched by qualified buyers.

Rules:
- Avoid buzzwords or AI-sounding language.
- keyword should not have brand name until the Objective tells us to.
- Keywords should be focused on search query a user will type into search bar either exact or phrase.
- Avoid include name of business in keywords.

Inputs:
Campaign Name: ${campaignName}
Business Description: ${businessAbout}
Campaign Objective: ${campaignObjective}
Landing Page Title: ${landingPageData.title}
Landing Page Meta Description: ${landingPageData.metaDescription}
Landing Page Main Text: ${landingPageData.mainText}
Campaign Budget: $${budget}

Output JSON schema:
{
  "keywords": [
    { "keyword": "[exact keyword]", "type": "exact" },
    { "keyword": "\"phrase keyword\"", "type": "phrase" }
  ],
  "keywordGroups": [
    {
      "groupName": "string",
      "keywords": ["string"]
    }
  ]
}

<<END_SYSTEM>>

<<USER>>
Generate keywords and keyword groups as JSON only.
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
    landingPageData,
    budget,
  } = body;
  if (
    !campaignName ||
    !businessAbout ||
    !campaignObjective ||
    !landingPageData
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const prompt = buildPrompt({
    campaignName,
    businessAbout,
    campaignObjective,
    landingPageData,
    budget,
  });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_ID });

  try {
    const { response } = await model.generateContent(prompt, {
      generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 1500 },
    });

    const raw = (await response.text()).replace(/^```json\n?|```$/g, "").trim();
    const data = JSON.parse(raw);

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
