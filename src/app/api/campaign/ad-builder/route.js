import { NextResponse } from "next/server";

export async function POST(req) {
  try {
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

    // 1. Crawl landing page to get content
    const crawlRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/google-tools/crawl`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landingPage: landingPageUrl }), // key must be `landingPage`
      }
    );
    if (!crawlRes.ok) throw new Error("Failed to crawl landing page");
    const crawlData = await crawlRes.json();

    // 2. Keyword research API
    const keywordRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/google-tools/keyword-research`,
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

    // 3. Ad copy generation API
    const adCopyRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/google-tools/copy`,
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

    // 4. Negative keywords generation API
    const negativeKeywordsRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/google-tools/negative-keyword`,
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

    // 5. Compose final response
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
