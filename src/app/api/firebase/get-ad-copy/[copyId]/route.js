import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Initialize Firebase admin if not already
if (!admin.apps.length) {
  try {
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(svc) });
    console.log("✅ Firebase admin initialized (get-ad-copy/[copyId] route)");
  } catch (err) {
    console.error("❌ Firebase admin init error:", err);
  }
}

const db = admin.firestore();

export async function GET(req, { params }) {
  // Destructure params from the second argument
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the ad copy ID directly from the dynamic route segment
  const { copyId } = await params;

  if (!copyId) {
    return NextResponse.json(
      { error: "Ad copy ID is required in the URL path." },
      { status: 400 }
    );
  }

  try {
    const docRef = db.collection("adCopies").doc(copyId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { message: "Ad copy not found." },
        { status: 404 }
      );
    }

    const adCopyData = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    // Optional: Add a check to ensure the user owns this ad copy
    if (adCopyData.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to this ad copy." },
        { status: 403 }
      );
    }

    return NextResponse.json({ adCopy: adCopyData }, { status: 200 });
  } catch (err) {
    console.error(
      "❌ Firestore read error for single ad copy (dynamic route):",
      err
    );
    return NextResponse.json(
      { error: "Failed to retrieve ad copy", details: err.message },
      { status: 500 }
    );
  }
}
