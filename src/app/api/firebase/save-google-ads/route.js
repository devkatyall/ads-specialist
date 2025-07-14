// app/api/firebase/save-campaign/route.js – v4 (full code)
/* ---------------------------------------------------------------------------
 * • Accepts either of several keys per campaignType (arrays in PRIMARY_KEY).
 * • Unwraps generatedAssets.data → generatedAssets if wrapper exists.
 * • Uses auto Firestore ID; debug logs preserved.
 * ------------------------------------------------------------------------- */

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

/* ─── Firebase init (once) ─────────────────────────────────────────────── */
if (!admin.apps.length) {
  try {
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(svc) });
    console.log("✅ Firebase admin initialised");
  } catch (err) {
    console.error("❌ Firebase admin init error: ", err);
  }
}
const db = admin.firestore();

/* ─── campaignType → key(s) that must exist in generatedAssets ─────────── */
const PRIMARY_KEY = {
  search: ["adGroups", "concepts"], // accept either normal or concept deck
  display: ["targetAudiences"],
  shopping: ["productGroups"],
  video: ["concepts"],
  app: ["headlines"],
  pmax: ["audienceSignals"],
};

/* ─── POST handler ──────────────────────────────────────────────────────── */
export async function POST(req) {
  /* 1. Auth */
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  /* 2. Parse body */
  let campaignData;
  try {
    campaignData = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.debug("Incoming campaignData", campaignData);

  /* 3. Unwrap generatedAssets */
  const { campaignName, campaignType } = campaignData || {};
  let { generatedAssets } = campaignData || {};
  generatedAssets = generatedAssets?.data ?? generatedAssets;

  /* 4. Basic checks */
  if (
    !campaignName ||
    !campaignType ||
    !generatedAssets ||
    typeof generatedAssets !== "object"
  )
    return NextResponse.json(
      { error: "campaignName, campaignType and generatedAssets are required." },
      { status: 400 }
    );

  if (Object.keys(generatedAssets).length === 0)
    return NextResponse.json(
      { error: "generatedAssets object is empty." },
      { status: 400 }
    );

  /* 5. Primary‑key validation (supports arrays) */
  const mustHaveArr = PRIMARY_KEY[campaignType] || [];
  const hasRequired =
    mustHaveArr.length === 0 || mustHaveArr.some((k) => generatedAssets[k]);
  if (!hasRequired) {
    console.warn(`Missing ${mustHaveArr.join(" / ")} for ${campaignType}`);
    return NextResponse.json(
      {
        error: `generatedAssets missing expected key (${mustHaveArr.join(
          ", "
        )}) for ${campaignType}`,
      },
      { status: 400 }
    );
  }

  /* 6. Save to Firestore */
  try {
    const docRef = db.collection("campaigns").doc();
    await docRef.set({
      ...campaignData,
      generatedAssets, // store unwrapped object
      platform: "Google Ads",
      userId: session.user.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Campaign saved", campaignId: docRef.id },
      { status: 200 }
    );
  } catch (err) {
    console.error("Firestore save error", err);
    return NextResponse.json(
      { error: "Failed to save campaign", details: err.message },
      { status: 500 }
    );
  }
}
