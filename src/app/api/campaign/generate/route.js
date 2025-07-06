/* -------------------------------------------------------------------------- */
/*  app/api/campaign/generate/route.js                                        */
/* -------------------------------------------------------------------------- */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
/* -------------------------------------------------------------------------- */
/* 1.  CAMPAIGN-TYPE CONFIG – FULL OBJECT                                    */
/* -------------------------------------------------------------------------- */

const campaignTypeConfig = {
  /* ------------------------------ SEARCH --------------------------------- */
  search: {
    name: "Search",
    icon: "Target",
    description: "Capture high-intent customers actively searching",
    generates: ["Ad Groups", "Negative Keywords", "Ad Extensions"],
    questions: [
      {
        id: "business",
        label: "Business Description",
        type: "textarea",
        required: true,
      },
      {
        id: "target_audience",
        label: "Target Audience",
        type: "textarea",
        required: true,
      },
      {
        id: "competitors",
        label: "Main Competitors",
        type: "input",
        required: false,
      },
      {
        id: "location",
        label: "Target Locations",
        type: "input",
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

  /* ------------------------------ DISPLAY -------------------------------- */
  display: {
    name: "Display",
    icon: "Globe",
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
        required: true,
      },
      {
        id: "target_audience",
        label: "Target Audience",
        type: "textarea",
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

  /* ------------------------------ SHOPPING ------------------------------- */
  shopping: {
    name: "Shopping",
    icon: "ShoppingCart",
    description: "Showcase products in Google search results",
    generates: ["Product Groups", "Product Titles", "Product Descriptions"],
    questions: [
      {
        id: "product_catalog",
        label: "Product Catalog",
        type: "textarea",
        required: true,
      },
      {
        id: "target_market",
        label: "Target Market",
        type: "textarea",
        required: true,
      },
      {
        id: "product_benefits",
        label: "Key Benefits",
        type: "textarea",
        required: true,
      },
      {
        id: "seasonal_trends",
        label: "Seasonal Patterns",
        type: "input",
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
        required: false,
      },
    ],
  },

  /* ------------------------------ VIDEO ---------------------------------- */
  video: {
    name: "Video",
    icon: "Play",
    description: "Engage audiences with video content on YouTube",
    generates: ["Video Scripts", "Targeting Audiences", "Thumbnails", "CTAs"],
    questions: [
      {
        id: "business",
        label: "Business Description",
        type: "textarea",
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
        required: true,
      },
    ],
  },

  /* ------------------------------ PERFORMANCE MAX ------------------------ */
  pmax: {
    name: "Performance Max",
    icon: "TrendingUp",
    description: "Maximize performance across all Google channels",
    generates: [
      "Audience Signals",
      "Headlines",
      "Descriptions",
      "Asset Recommendations",
    ],
    questions: [
      {
        id: "business_overview",
        label: "Business Overview",
        type: "textarea",
        required: true,
      },
      {
        id: "customer_journey",
        label: "Customer Journey",
        type: "textarea",
        required: true,
      },
      {
        id: "high_value_customers",
        label: "Best Customers",
        type: "textarea",
        required: true,
      },
      {
        id: "conversion_actions",
        label: "Key Conversions",
        type: "select",
        options: [
          "Purchases",
          "Leads/Sign-ups",
          "Phone calls",
          "Store visits",
          "App installs",
        ],
        required: true,
      },
      {
        id: "seasonal_patterns",
        label: "Seasonality",
        type: "input",
        required: false,
      },
      {
        id: "geographic_focus",
        label: "Best Locations",
        type: "input",
        required: true,
      },
    ],
  },

  /* ------------------------------ APP ------------------------------------ */
  app: {
    name: "App",
    icon: "Smartphone",
    description: "Drive app installs and engagement",
    generates: ["Target Audiences", "Ad Copy", "ASO", "Creative Concepts"],
    questions: [
      {
        id: "app_description",
        label: "App Description",
        type: "textarea",
        required: true,
      },
      {
        id: "target_users",
        label: "Target Users",
        type: "textarea",
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
        required: true,
      },
      {
        id: "user_pain_points",
        label: "Problems Solved",
        type: "textarea",
        required: true,
      },
      {
        id: "competitor_apps",
        label: "Competitor Apps",
        type: "input",
        required: false,
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* 2.  PROMPT GENERATOR – COVERS EVERY ASSET TYPE                             */
/* -------------------------------------------------------------------------- */

const generateGeminiPrompt = (campaignType, answers) => {
  const cfg = campaignTypeConfig[campaignType];
  if (!cfg) throw new Error("Invalid campaign type.");

  let prompt = `
You are a senior direct-response copywriter & Google Ads specialist.

Write copy that:
• Leads with a clear benefit + strong CTA. 
• Uses active voice, varied sentences, human language. 
• Includes concrete numbers/power words where credible. 
• **Never repeats the same root word** across assets (ignore stop-words). 
• Uses **max one exclamation mark** total. 
• Avoids buzzwords (“cutting-edge”, “AI-powered”, etc.). 

*Before output*, self-check:
  – Headlines ≤30 chars; descriptions ≤90 chars.  
  – No duplicate root nouns/verbs across headlines/descriptions.  
  – Headlines make sense alone *and* in any order.  
  – JSON matches the exact schema at the end.  
Rewrite until every test passes.

Return **raw JSON only** – no markdown, no commentary.

Campaign Type: ${cfg.name}
`;

  /* ---------- embed user answers ---------- */
  cfg.questions.forEach((q) => {
    const a = answers[q.id];
    if (a) prompt += `${q.label}: ${a}\n`;
  });

  prompt += `\n**Asset Generation Requirements**\n`;

  /* --------------------- SEARCH ----------------------------------------- */
  if (campaignType === "search") {
    prompt += `
- **Ad Groups:** Create **3-5** tightly-themed groups.  
  • "theme": concise focal idea.  
  • "keywords": 5-7 **plain strings ONLY**.  
      – **≥3 exact-match**, **≥2 phrase-match**, **max 1 broad-match**.  
      – No single-word terms; every keyword shows buying intent.  
      – Encode match-type inside the string:  
        • exact  → "[digital marketing agency]"  
        • phrase → "digital marketing agency"  
        • broad  → digital marketing agency  
  • "adHeadlines": exactly 8 unique lines (≤30 chars).  
      – ≥4 with a numeral, ≥4 start with a strong verb, one "!" total.  
  • "adDescriptions": exactly 4 lines (≤90 chars) – ≥1 numeric proof.  

- **Negative Keywords:** **≥30 strings** using the same match-type rule.  
  • Cover jobs/careers, DIY/tutorials, “free”, compare, reviews, cheap, training, software, academic, “what is”, etc.  
  • Supply all three match types for the worst offenders.
`;
  } else {
    /* ====================== NON-SEARCH BRANCH ============================= */

    /* ---- shared copy assets ---- */
    if (cfg.generates.some((g) => /Headlines?/i.test(g)))
      prompt += `- **Headlines:** exactly 8 lines (≤30 chars) – same numeral/verb rules.\n`;
    if (cfg.generates.some((g) => /Descriptions?/i.test(g)))
      prompt += `- **Descriptions:** exactly 4 lines (≤90 chars) – at least one numeric proof.\n`;

    /* ---- DISPLAY ------------------------------------------------------- */
    if (campaignType === "display") {
      prompt += `
- **Target Audiences:** Provide 3–4 objects:  
    { "name": "Outdoor Enthusiasts", "definition": "Affinity – people who hike & camp" }  
- **Image Concepts:** 3–5 objects:  
    { "orientation": "300×250", "concept": "Boot on dusty trail close-up", "reason": "Highlights durability" }
`;
    }

    /* ---- SHOPPING ------------------------------------------------------ */
    if (campaignType === "shopping") {
      prompt += `
- **Product Groups:** 3–5 objects each with "groupName" & "filters" (e.g., brand, price, category).  
- **Product Titles:** 3–5 optimized titles (≤70 chars) with key spec + USP.  
- **Product Descriptions:** 3–5 persuasive descriptions (≤175 chars) focusing on benefit & spec.
`;
    }

    /* ---- VIDEO --------------------------------------------------------- */
    if (campaignType === "video") {
      prompt += `
- **Video Scripts:** 3 concise concepts (Problem–Solve, Testimonial, How-To). Outline visuals + on-screen text + CTA.  
- **Targeting Audiences:** 3–4 audience objects {"name": "...", "seeds": ["keyword", "url"]}.  
- **Thumbnails:** 2–3 thumbnail concepts {"aspect": "16:9", "concept": "Hero boot shot on ranch"}  
- **CTAs:** 3–5 short CTA strings (≤20 chars) such as "Shop Now" or "See Styles".
`;
    }

    /* ---- PERFORMANCE MAX ---------------------------------------------- */
    if (campaignType === "pmax") {
      prompt += `
- **Audience Signals:** 3–5 objects:  
    { "name": "High-Value Shoppers", "seeds": ["purchase", "competitorBrand"] }  
- **Asset Recommendations:** 4–6 objects including at least one of each asset type (square image, landscape image, short headline, long headline, description):  
    { "assetType": "Image", "spec": "1:1 1200×1200", "concept": "Close-up stitching", "reason": "Shows craftsmanship" }
`;
    }

    /* ---- APP ----------------------------------------------------------- */
    if (campaignType === "app") {
      prompt += `
- **Target Audiences:** 3–4 objects like {"name":"Busy Professionals","reason":"Need on-the-go organisation"}.  
- **ASO:** One object:  
    { "title": "BootFinder – Western Footwear", "subtitle": "Find the perfect fit fast", "keywords": "boots, western, cowboy" }  
- **Creative Concepts:** 3–4 ad-creative ideas for banners or videos:  
    { "format":"Static Banner","concept":"Scrolling boot carousel","reason":"Shows range quickly" }
`;
    }
  }

  /* --------------------- JSON SKELETON ---------------------------------- */
  const out = {};
  if (campaignType === "search") {
    out.adGroups = [
      { theme: "Example", keywords: [], adHeadlines: [], adDescriptions: [] },
    ];
    out.negativeKeywords = [];
    if (cfg.generates.includes("Ad Extensions")) out.adExtensions = [];
  } else {
    cfg.generates.forEach((item) => {
      const alias = {
        VideoScripts: "videoAdScripts",
        Thumbnails: "videoThumbnails",
        CTAs: "callToActions",
        ASO: "appStoreOptimization",
        AdCopy: "adCopy",
        ImageConcepts: "imageConcepts",
        AdHeadlines: "adHeadlines",
        AdDescriptions: "adDescriptions",
        NegativeKeywords: "negativeKeywords",
        AdExtensions: "adExtensions",
        AudienceSignals: "audienceSignals",
        AssetRecommendations: "assetRecommendations",
        ProductGroups: "productGroups",
        ProductTitles: "productTitles",
        ProductDescriptions: "productDescriptions",
        TargetAudiences: "targetAudiences",
        TargetingAudiences: "targetingAudiences",
        CreativeConcepts: "creativeConcepts",
        Headlines: "headlines",
        Descriptions: "descriptions",
      };
      const key =
        alias[item.replace(/\s+/g, "")] ||
        item.replace(/\s+/g, "").replace(/^./, (m) => m.toLowerCase());
      out[key] = [];
    });
  }

  prompt += `\nReturn JSON exactly matching:\n${JSON.stringify(out, null, 2)}`;
  return prompt;
};

/* -------------------------------------------------------------------------- */
/* 3.  HELPER – CLEAN ANY OBJECT-STYLE KEYWORD ITEMS                          */
/* -------------------------------------------------------------------------- */

const cleanMatchArray = (arr = []) =>
  arr.flatMap((el) => {
    if (typeof el === "string") return [el.trim()];
    if (el && typeof el === "object") {
      const val = Object.values(el)[0];
      return typeof val === "string" ? [val.trim()] : [];
    }
    return [];
  });

/* -------------------------------------------------------------------------- */
/* 4.  MAIN API HANDLER                                                       */
/* -------------------------------------------------------------------------- */

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { campaignType, answers } = await req.json();
    if (!campaignType || !answers)
      return NextResponse.json(
        { error: "Campaign type and answers are required." },
        { status: 400 }
      );
    if (!campaignTypeConfig[campaignType])
      return NextResponse.json(
        { error: "Invalid campaign type provided." },
        { status: 400 }
      );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL_ID,
    });
    const prompt = generateGeminiPrompt(campaignType, answers);

    const { response } = await model.generateContent(prompt);
    let text = response
      .text()
      .replace(/^```json\n?|```$/g, "")
      .trim();

    /* parse or extract JSON */
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const first = text.indexOf("{"),
        last = text.lastIndexOf("}");
      if (first === -1 || last === -1 || last <= first)
        throw new Error("Gemini did not return valid JSON.");
      data = JSON.parse(text.slice(first, last + 1));
    }

    /* clean keyword arrays (search only) */
    if (campaignType === "search" && Array.isArray(data.adGroups))
      data.adGroups.forEach((g) => (g.keywords = cleanMatchArray(g.keywords)));
    if (Array.isArray(data.negativeKeywords))
      data.negativeKeywords = cleanMatchArray(data.negativeKeywords);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error generating assets:", err);
    const blocked = err?.response?.candidates?.[0]?.finishReason === "SAFETY";
    return NextResponse.json(
      {
        error: blocked
          ? "Content generation blocked by safety filters. Please adjust your input."
          : "Failed to generate campaign assets. Please try again.",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
