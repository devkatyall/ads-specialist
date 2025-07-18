// app/api/campaign/crawl/route.js
import { NextResponse } from "next/server";
import { crawlPage } from "@/lib/crawl";

export async function POST(req) {
  try {
    const { landingPage } = await req.json();
    if (!landingPage) {
      return NextResponse.json(
        { error: "Missing landingPage in request body" },
        { status: 400 }
      );
    }

    const data = await crawlPage(landingPage);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Crawl error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
