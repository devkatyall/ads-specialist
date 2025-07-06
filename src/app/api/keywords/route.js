import GeminiService from "@/lib/GeminiApi";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { seeds } = await req.json();
    if (!Array.isArray(seeds) || seeds.length === 0) {
      return NextResponse.json(
        { error: "Seeds array is required" },
        { status: 400 }
      );
    }

    const keywords = await GeminiService.expandKeywords(seeds);
    return NextResponse.json({ keywords }, { status: 200 });
  } catch (err) {
    console.error("Keyword expansion failed:", err);
    return NextResponse.json(
      { error: "Failed to generate keywords", details: err.message },
      { status: 500 }
    );
  }
}
