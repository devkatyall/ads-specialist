// app/api/firebase/save-ad-copy/route.js
/* ---------------------------------------------------------------------------
 * • Saves generated ad copy data to a new 'adCopies' Firestore collection.
 * • Assumes 'adCopies' will be part of the request body.
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

/* ─── POST handler ──────────────────────────────────────────────────────── */
export async function POST(req) {
  /* 1. Auth */
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  /* 2. Parse body */
  let adCopyData;
  try {
    adCopyData = await req.json();
  } catch (error) {
    console.error("Invalid JSON received for ad copy save:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.debug("Incoming adCopyData", adCopyData);

  /* 3. Extract relevant data for ad copies */
  // Based on the ad-copy API response structure:
  // { strategicOverview, adCopies, creativeRationale }
  const {
    projectName,
    description,
    strategicOverview,
    adCopies,
    creativeRationale,
  } = adCopyData;

  /* 4. Basic checks */
  if (
    !projectName ||
    !description ||
    !adCopies ||
    !Array.isArray(adCopies) ||
    adCopies.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "projectName, description, and non-empty adCopies array are required.",
      },
      { status: 400 }
    );
  }

  // You might want to add more specific validation for each ad copy object
  // For example, checking if each ad copy has headline, description, cta.
  const isValidAdCopies = adCopies.every(
    (copy) => copy.headline && copy.description && copy.cta
  );

  if (!isValidAdCopies) {
    return NextResponse.json(
      {
        error:
          "Each ad copy in the array must have a headline, description, and cta.",
      },
      { status: 400 }
    );
  }

  /* 5. Save to Firestore */
  try {
    const docRef = db.collection("adCopies").doc(); // <-- NEW COLLECTION NAME: "adCopies"
    await docRef.set({
      // Save all relevant data from the request body
      projectName,
      description,
      strategicOverview: strategicOverview || null, // Optional fields can be null
      adCopies, // The array of generated ad copies with ratings
      creativeRationale: creativeRationale || null, // Optional fields can be null
      userId: session.user.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // Add any other metadata you deem necessary
      // For example, the tone and keywords if they were part of the incoming adCopyData
      // tone: adCopyData.tone || null,
      // keywords: adCopyData.keywords || [],
    });

    return NextResponse.json(
      { message: "Ad copy campaign saved", adCopyId: docRef.id },
      { status: 200 }
    );
  } catch (err) {
    console.error("Firestore save error for ad copy:", err);
    return NextResponse.json(
      { error: "Failed to save ad copy campaign", details: err.message },
      { status: 500 }
    );
  }
}
