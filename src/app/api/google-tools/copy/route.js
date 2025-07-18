import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const MODEL_ID = process.env.GEMINI_MODEL_ID || "gemini-1.5-pro";

function buildAdCopyPrompt({
  campaignName,
  businessAbout,
  objective,
  landingPage,
  budget,
  keywords,
  keywordGroups,
}) {
  return `<<SYSTEM>>
Role: Senior Google Ads strategist with 20 years experience.

Rules:
 • Create Search campaign ads only.
 • Generate exactly 15 headlines (≤30 chars) and 4 descriptions (≤90 chars). Note: If any of the headlines or descriptions excedes the char limit, they should be discarded and redo.
 • Use numeric proof if possible (years, % results, budget).
 • Use varied CTA verbs (≥4 distinct).
 • Headlines and descriptions must sound natural, professional, human.
 • Use keywords and keyword groups to align ad text tightly.
 • Avoid buzzwords or AI-sounding language.
 • Headlines and descriptions must fit the campaign objective and business description.
 • Avoid AI adjectives and words at any cost to keep it sound Human, natural and professional as per business description.
 • Use ${landingPage} & ${businessAbout} for USP.
 


<<END_SYSTEM>>

<<USER>>
Campaign Name: ${campaignName}
Business About: ${businessAbout}
Campaign Objective: ${objective}
Landing Page: ${landingPage}
Budget: ${budget}

Keywords (exact and phrase): ${keywords.map((k) => k.keyword).join(", ")}

Keyword Groups:
${keywordGroups
  .map((g) => `${g.groupName}: ${g.keywords.join(", ")}`)
  .join("\n")}

## OUTPUT ONLY JSON ##
\`\`\`json
{
  "adGroups": [
    {
      "theme": "Primary",
      "keywords": [],
      "adHeadlines": [],
      "adDescriptions": []
    }
  ],
  "negativeKeywords": [],
  "meta": {
    "promptVersion": 1,
    "modelVersion": "${MODEL_ID}"
  }
}
\`\`\`
<<END_USER>>`;
}

function safeJson(raw) {
  try {
    return JSON.parse(raw);
  } catch (_) {}
  const m = raw.match(/\{[\s\S]*$/m);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch (_) {}
  }
  throw new Error("Model response was not valid JSON");
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
    objective,
    landingPage,
    budget,
    keywords,
    keywordGroups,
  } = body;

  if (
    !campaignName ||
    !businessAbout ||
    !objective ||
    !landingPage ||
    !budget ||
    !keywords ||
    !keywordGroups
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const prompt = buildAdCopyPrompt({
    campaignName,
    businessAbout,
    objective,
    landingPage,
    budget,
    keywords,
    keywordGroups,
  });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_ID });

  try {
    const { response } = await model.generateContent(prompt, {
      generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 2048 },
    });

    const raw = (await response.text()).replace(/^```json\n?|```$/g, "").trim();
    const data = safeJson(raw);

    return NextResponse.json(
      { data, meta: { finishReason: response.finishReason, model: MODEL_ID } },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
