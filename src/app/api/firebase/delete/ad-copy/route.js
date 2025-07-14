// app/api/firebase/delete-ad-copy/route.js
/* ---------------------------------------------------------------------------
 * • Deletes a single ad copy document from the 'adCopies' collection by ID.
 * • Requires user authentication and ownership check.
 * ------------------------------------------------------------------------- */

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed

// Initialize Firebase admin if not already
if (!admin.apps.length) {
  try {
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(svc) });
    console.log("✅ Firebase admin initialized (delete-ad-copy route)");
  } catch (err) {
    console.error("❌ Firebase admin init error:", err);
  }
}

const db = admin.firestore();

export async function DELETE(req) {
  // Using DELETE method for single resource deletion
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: adCopyId } = await req.json(); // Expecting ID in the request body

  if (!adCopyId) {
    return NextResponse.json(
      { error: "Ad copy ID is required." },
      { status: 400 }
    );
  }

  try {
    const docRef = db.collection("adCopies").doc(adCopyId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { message: "Ad copy not found." },
        { status: 404 }
      );
    }

    const adCopyData = docSnap.data();

    // Crucial security check: Ensure the user owns this ad copy
    if (adCopyData.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: You do not own this ad copy." },
        { status: 403 }
      );
    }

    await docRef.delete();

    return NextResponse.json(
      { message: "Ad copy deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Firestore delete error for single ad copy:", err);
    return NextResponse.json(
      { error: "Failed to delete ad copy", details: err.message },
      { status: 500 }
    );
  }
}
