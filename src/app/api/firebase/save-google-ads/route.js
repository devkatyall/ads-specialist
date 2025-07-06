// app/api/firebase/save-campaign/route.js (or save-google-ads/route.js)
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

const db = admin.firestore();

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in save-campaign API:", session);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const campaignData = await req.json();

    // --- REFINED VALIDATION LOGIC BASED ON GENERATE API ---
    if (
      !campaignData ||
      !campaignData.campaignName ||
      !campaignData.generatedAssets ||
      typeof campaignData.generatedAssets !== "object" ||
      Object.keys(campaignData.generatedAssets).length === 0 || // Ensure generatedAssets is not an empty object
      !campaignData.campaignType
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required campaign data: campaignName, non-empty generatedAssets, or campaignType.",
        },
        { status: 400 }
      );
    }

    // Conditional validation based on campaign type's primary generated asset
    let missingAssetKey = null;
    switch (campaignData.campaignType) {
      case "search":
        if (!campaignData.generatedAssets.adGroups) {
          missingAssetKey = "'adGroups'";
        }
        break;
      case "performance_max":
        // PMax generates 'audienceSignals', 'headlines', 'descriptions', 'assetRecommendations'
        // We'll check for 'audienceSignals' as a primary indicator
        if (!campaignData.generatedAssets.audienceSignals) {
          missingAssetKey = "'audienceSignals'";
        }
        break;
      case "display":
        if (!campaignData.generatedAssets.targetAudiences) {
          missingAssetKey = "'targetAudiences'";
        }
        break;
      case "shopping":
        if (!campaignData.generatedAssets.productGroups) {
          missingAssetKey = "'productGroups'";
        }
        break;
      case "video":
        if (!campaignData.generatedAssets.videoAdScripts) {
          // From generate API's alias
          missingAssetKey = "'videoAdScripts'";
        }
        break;
      case "app":
        if (!campaignData.generatedAssets.adCopy) {
          // From generate API's alias for 'Ad Copy'
          missingAssetKey = "'adCopy'";
        }
        break;
      default:
        // If an unknown campaign type comes through, or no specific asset check is defined
        // You might want to handle this differently, e.g., allow it if generatedAssets is just not empty
        break;
    }

    if (missingAssetKey) {
      return NextResponse.json(
        {
          error: `Missing expected key ${missingAssetKey} in generatedAssets for ${campaignData.campaignType} campaign.`,
        },
        { status: 400 }
      );
    }
    // --- END REFINED VALIDATION LOGIC ---

    const campaignId = `campaign_${Date.now()}`;

    await db
      .collection("campaigns")
      .doc(campaignId)
      .set({
        ...campaignData,
        platform: "Google Ads",
        userId: session.user.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return NextResponse.json(
      { message: "Campaign saved successfully!", campaignId: campaignId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving campaign to Firebase:", error);
    return NextResponse.json(
      {
        error: "Failed to save campaign. Please try again.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
