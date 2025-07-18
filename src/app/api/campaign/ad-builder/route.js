import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Construct the base URL from the request headers
    const host = req.headers.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    const body = await req.json();
    const { campaignName, businessAbout, objective, landingPageUrl, budget } =
      body;

    if (
      !campaignName ||
      !businessAbout ||
      !objective ||
      !landingPageUrl ||
      !budget
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const campaignObjective = objective;

    // 2. Use the absolute URL for all internal fetch calls
    // Crawl landing page
    const crawlRes = await fetch(
      `${baseUrl}/api/google-tools/crawl`, // ✅ Correct
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landingPage: landingPageUrl }),
      }
    );
    if (!crawlRes.ok) throw new Error("Failed to crawl landing page");
    const crawlData = await crawlRes.json();

    // Keyword research API
    const keywordRes = await fetch(
      `${baseUrl}/api/google-tools/keyword-research`, // ✅ Correct
      {
        method: "POST",
        body: JSON.stringify({
          campaignName,
          businessAbout,
          campaignObjective,
          landingPageData:
            crawlData.data.mainText || crawlData.data.metaDescription || "",
          budget,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!keywordRes.ok) throw new Error("Failed in keyword research");
    const keywordData = await keywordRes.json();

    // Ad copy generation API
    const adCopyRes = await fetch(
      `${baseUrl}/api/google-tools/copy`, // ✅ Correct
      {
        method: "POST",
        body: JSON.stringify({
          campaignName,
          businessAbout,
          objective,
          landingPage:
            crawlData.data.mainText || crawlData.data.metaDescription || "",
          budget,
          keywords: keywordData.data.keywords,
          keywordGroups: keywordData.data.keywordGroups,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!adCopyRes.ok) throw new Error("Failed in ad copy generation");
    const adCopyData = await adCopyRes.json();

    // Negative keywords generation API
    const negativeKeywordsRes = await fetch(
      `${baseUrl}/api/google-tools/negative-keyword`, // ✅ Correct
      {
        method: "POST",
        body: JSON.stringify({
          campaignName,
          businessAbout,
          campaignObjective,
          landingPage:
            crawlData.data.mainText || crawlData.data.metaDescription || "",
          budget,
          keywords: keywordData.data.keywords,
          keywordGroups: keywordData.data.keywordGroups,
          adCopy: adCopyData.data.adGroups || [],
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!negativeKeywordsRes.ok)
      throw new Error("Failed in negative keyword generation");
    const negativeKeywordsData = await negativeKeywordsRes.json();

    // Compose final response
    const result = {
      crawl: crawlData.data,
      keywords: keywordData.data,
      adCopy: adCopyData.data,
      negativeKeywords:
        negativeKeywordsData.negativeKeywords ||
        negativeKeywordsData.data?.negativeKeywords ||
        [],
    };

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
