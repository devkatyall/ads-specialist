// app/api/campaign/generate/route.js – v14  (Gemini 1.5 Pro – high-qualification)
//
// • Strong SYSTEM blocks ask for numeric proof, persona tone, pain–benefit framing.
// • Skeletons list every required field; negatives floors raised.
// • Works with existing front-end & Firebase saver.
//

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

/* ── constants ─────────────────────────────────────────────────────────── */
const MODEL_ID = process.env.GEMINI_MODEL_ID || "gemini-1.5-pro";
const JSON_START = /\{[\s\S]*$/m;
const TYPES = {
  search: true,
  display: true,
  shopping: true,
  video: true,
  app: true,
  pmax: true,
};

/* ── helpers ────────────────────────────────────────────────────────────── */
const safeJson = (raw) => {
  try {
    return JSON.parse(raw);
  } catch (_) {}
  const m = raw.match(JSON_START);
  if (m)
    try {
      return JSON.parse(m[0]);
    } catch (_) {}
  throw new Error("Model response was not valid JSON");
};

/* ── skeleton builder ──────────────────────────────────────────────────── */
function skeleton(type, kwStrategy, concept) {
  if (concept) {
    return {
      concepts: [
        { strategyId: "", headlines: [], description: "", rationale: "" },
      ],
      meta: { promptVersion: 14, modelVersion: MODEL_ID },
    };
  }

  switch (type) {
    case "search":
      return {
        adGroups: [
          { theme: "", keywords: [], adHeadlines: [], adDescriptions: [] },
          { theme: "", keywords: [], adHeadlines: [], adDescriptions: [] },
        ],
        negativeKeywords: [],
        meta: {
          keywordStrategy: kwStrategy,
          promptVersion: 14,
          modelVersion: MODEL_ID,
        },
      };

    case "display":
      return {
        assetGroups: [
          {
            name: "",
            shortHeadlines: [],
            longHeadlines: [],
            descriptions: [],
            images: [],
            logos: [],
            callouts: [],
          },
        ],
        audienceSignals: [],
        negativeKeywords: [],
        meta: { promptVersion: 14, modelVersion: MODEL_ID },
      };

    case "shopping":
      return {
        productGroups: [],
        productTitles: [],
        productDescriptions: [],
        feedHints: { brand: "", gtin: "" },
        negativeKeywords: [],
        meta: { promptVersion: 14, modelVersion: MODEL_ID },
      };

    case "video":
      return {
        videoConcepts: [],
        scripts: [],
        thumbnails: [],
        callToActions: [],
        negativeKeywords: [],
        meta: { promptVersion: 14, modelVersion: MODEL_ID },
      };

    case "app":
      return {
        adSets: [{ headlines: [], descriptions: [], images: [] }],
        callToActions: [],
        asoHints: [],
        negativeKeywords: [],
        meta: { promptVersion: 14, modelVersion: MODEL_ID },
      };

    case "pmax":
      return {
        assetGroups: [
          {
            headlines: [],
            longHeadlines: [],
            descriptions: [],
            images: [],
            logos: [],
            videos: [],
          },
        ],
        audienceSignals: [],
        assetRecommendations: [],
        negativeKeywords: [],
        meta: { promptVersion: 14, modelVersion: MODEL_ID },
      };

    default:
      return { meta: { promptVersion: 14, modelVersion: MODEL_ID } };
  }
}

/* ── mini examples (trimmed to essentials) ─────────────────────────────── */
const EX = {
  search: {
    adGroups: [
      {
        theme: "SOC 2 Automation",
        keywords: ["[soc 2 automation]"],
        adHeadlines: ["SOC 2 in 14 Days"],
        adDescriptions: ["Automate audit • 99 % renew"],
      },
    ],
    negativeKeywords: ["free"],
    meta: {},
  },
  display: {
    assetGroups: [
      {
        name: "Implant Value",
        shortHeadlines: ["Smile Again"],
        longHeadlines: ["All-on-4 in 1 Day – Free CT"],
        descriptions: ["0 % financing"],
        images: ["before_after.jpg"],
        logos: ["logo_sq.png"],
        callouts: ["Free CT Scan"],
      },
    ],
    meta: {},
  },
  shopping: {
    productGroups: [],
    productTitles: ["All-on-4 Implant Kit"],
    productDescriptions: ["Full-arch kit • GTIN 123"],
    feedHints: { brand: "Acme" },
    negativeKeywords: ["cheap"],
    meta: {},
  },
  video: {
    videoConcepts: ["Smile Journey"],
    scripts: ["Hook–Problem–Solution–CTA"],
    thumbnails: ["smile_thumbnail.jpg"],
    callToActions: ["Book Now"],
    negativeKeywords: ["diy"],
    meta: {},
  },
  app: {
    adSets: [
      {
        headlines: ["Find Cheap Flights"],
        descriptions: ["Save 40 % • Book"],
        images: ["app_screen.png"],
      },
    ],
    callToActions: ["Install"],
    asoHints: ["cheap flights"],
    negativeKeywords: ["mod apk"],
    meta: {},
  },
  pmax: {
    assetGroups: [
      {
        headlines: ["Smile in a Day"],
        longHeadlines: ["All-on-4 Implants – Free CT"],
        descriptions: ["0 % financing"],
        images: ["before_after.jpg"],
        logos: ["logo_sq.png"],
        videos: ["waiting_room.mp4"],
      },
    ],
    audienceSignals: ["inmarket:dental implants"],
    negativeKeywords: ["cheap"],
    meta: {},
  },
};

/* ── RULES per campaign type ───────────────────────────────────────────── */
const RULES = {
  search: `
Search:
 • You are a Google PPC expert with experience of more than 10 years running all types of Search campaigns and managing all types of budget.
 • 3 adGroups (SKAG + STAG + Other Top Strategy in the market). Each ⇒ 8-12 HL (≤30), 4 DESC (≤90).
 • HL roots must differ; ≥ 4 distinct CTA verbs.
 • Keywords type should be Exact & Phrase only, include “pricing, quote” when needed.
 • Keywords needs to be advance and unique, something that people are searching, ensure keywords are structured in correct manner, if exact keyword is required, use “[exact keyword]” and if phrase keyword is required, use “"phrase keyword"”.
 • ≥ 100 negativeKeywords incl. DIY, jobs, CMS, ppt/pdf, resume, competitors, and other keywords that can bring in unqualified leads.
 • Any combination of 3 headlines must read fluidly in sequence, as if one sentence separated by dots.
 • Do not repeat the same root keyword in more than 1 of the 3 headlines shown together.
 • Ad copies generated for the search campaign should be highly aligning with the theme of ad group. You will avoid AI adjectives and words at any cost to keep it sound Human, natural and professional as per business description.
 • Include numeric proof (years, % retention, managed $) in ≥ 2 HL or DESC.
 • Look up your database, understand the target audience of targeted area or country, find how they usual find the company and finally, use this information to influence your Keyword Generation and Ad Copies.
`,
  display: `
Display:
 • 1-2 assetGroups: 15 short HL (≤30), 5 long HL (≤90), 4 DESC (≤90).
 • 3 square + 3 landscape imgs (alt text), 1 square + 1 landscape logo.
 • Add callouts (Free CT Scan, 0 % Financing).
 • AudienceSignals: custom intent terms & in-market segments.
 • ≥ 60 negativeKeywords (DIY, info, cheap, platforms).
`,
  shopping: `
Shopping:s
 • 5 productGroups (brand, price, category splits).
 • Titles ≤150 chars incl. Brand & GTIN when known.
 • Descriptions ≤1 500 chars with benefit + CTA.
 • ≥ 60 negativeKeywords (used, review, manual, pdf, spare parts).
`,
  video: `
Video:
 • 3 videoConcepts (Hook-Story-Offer), 60-sec scripts (≤180 words).
 • Provide 1080p thumbnail suggestions with alt text.
 • CTA overlay text (Book, Claim, Schedule).
 • ≥ 50 negativeKeywords (DIY extraction, vlog, reaction).
`,
  app: `
App:
 • adSets:   8 HL ≤30, 5 DESC ≤45, 4 image ideas (1280×720).
 • ASO keywords: 10 high-volume store terms.
 • ≥ 50 negativeKeywords (mod apk, hack, cracked, free coins).
`,
  pmax: `
Performance Max:
 • Single assetGroup: 10 HL, 5 long HL, 4 DESC.
 • 3 square + 3 landscape imgs, 1 square logo, 1 ≤30-sec video (stock ok).
 • AudienceSignals: custom intent search terms + customer list label.
 • AssetRecommendations: 4 callouts, 2 sitelinks.
 • ≥ 80 negativeKeywords (cheap, diy, how-to, wikipedia, pdf).
`,
};

/* ── 12-strategy list for concept mode ─────────────────────────────────── */
const STRATS = [
  "The Niche Expert",
  "The Differentiator",
  "The Standout Feature",
  "The Benefit Banker",
  "The Target Filter",
  "The Alliterative Artist",
  "The Scorekeeper",
  "The Conversationalist",
  "The Speed Demon",
  "The Pain Point Prodder",
  "The Subtle Competitor",
  "The Key Message Reinforcer",
];

/* ── prompt builder ─────────────────────────────────────────────────────── */
function buildPrompt({ campaignType, answers, keywordStrategy }) {
  const concept =
    answers.conceptStrategies === true && campaignType === "search";
  const schema = skeleton(campaignType, keywordStrategy, concept);
  const example = JSON.stringify(EX[campaignType] || {}, null, 2);

  const system = `<<SYSTEM>>
Role: Senior Google Ads strategist (20 y).

Common rules:
 • Copy human, credible, numeric proof, no empty buzzwords.
 • Use persona language & pain-benefit framing.
 • Return ONLY valid JSON per schema.

${RULES[campaignType]}

${
  concept
    ? `
ConceptStrategies mode active:
 • Output array “concepts” with 12 objects in order:
${STRATS.map((s, i) => `   ${i + 1}. ${s}`).join("\\n")}
 • Each concept ⇒ strategyId, headlines[3], description, rationale ≤120.
 • Headlines must not reuse root words between concepts.
`
    : ""
}

Self-check:
 1. Fix char limits & field counts.
 2. Ensure ≥4 CTA verbs and ≥2 numeric proof instances.
 3. Deduplicate root words within any HL array.
<<END_SYSTEM>>`;

  const userLines = Object.entries(answers)
    .filter(([k]) => k !== "conceptStrategies")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const user = `<<USER>>
CampaignType: ${campaignType}
KeywordStrategy: ${keywordStrategy}
conceptMode: ${concept}
${userLines}

## JSON SCHEMA ##
\`\`\`json
${JSON.stringify(schema, null, 2)}
\`\`\`
## MINI EXAMPLE ##
\`\`\`json
${example}
\`\`\`
## OUTPUT ONLY JSON ##
<<END_USER>>`;

  return `${system}\n\n${user}`;
}

/* ── API handler ────────────────────────────────────────────────────────── */
export async function POST(req) {
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.id)
  //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { campaignType, answers, keywordStrategy = "STAG" } = body;
  if (!TYPES[campaignType] || !answers)
    return NextResponse.json(
      { error: "Invalid campaignType or answers" },
      { status: 400 }
    );

  const prompt = buildPrompt({ campaignType, answers, keywordStrategy });
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_ID });

  try {
    const { response } = await model.generateContent(prompt, {
      generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 2048 },
    });
    const raw = response
      .text()
      .replace(/^```json\\n?|```$/g, "")
      .trim();
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
