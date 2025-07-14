// app/api/firebase/bulk-delete-ad-copies/route.js
/* ---------------------------------------------------------------------------
 * • Deletes multiple ad copy documents from the 'adCopies' collection by a list of IDs.
 * • Requires user authentication and ownership check for each document.
 * • Uses a batch write for atomic deletion.
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
    console.log("✅ Firebase admin initialized (bulk-delete-ad-copies route)");
  } catch (err) {
    console.error("❌ Firebase admin init error:", err);
  }
}

const db = admin.firestore();

export async function POST(req) {
  // Using POST for bulk operations as DELETE might not support complex bodies easily
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids: adCopyIds } = await req.json(); // Expecting an array of IDs

  if (!Array.isArray(adCopyIds) || adCopyIds.length === 0) {
    return NextResponse.json(
      { error: "An array of ad copy IDs is required." },
      { status: 400 }
    );
  }

  try {
    const batch = db.batch();
    const userId = session.user.id;
    let deletedCount = 0;
    const failedDeletions = [];

    // Fetch all documents to be deleted to perform ownership checks
    const docsToVerify = await db
      .collection("adCopies")
      .where(admin.firestore.FieldPath.documentId(), "in", adCopyIds)
      .get();

    const accessibleIds = new Set();
    docsToVerify.forEach((doc) => {
      if (doc.exists && doc.data().userId === userId) {
        accessibleIds.add(doc.id);
        batch.delete(doc.ref);
        deletedCount++;
      } else {
        failedDeletions.push(doc.id); // Add IDs that either don't exist or don't belong to the user
      }
    });

    if (deletedCount === 0 && adCopyIds.length > 0) {
      // This case handles if all provided IDs either don't exist or don't belong to the user
      return NextResponse.json(
        {
          message:
            "No ad copies found or authorized for deletion among the provided IDs.",
          failedDeletions,
        },
        { status: 404 } // Or 403 if specifically unauthorized
      );
    }

    await batch.commit();

    return NextResponse.json(
      {
        message: `${deletedCount} ad copies deleted successfully.`,
        failedDeletions, // IDs that were attempted but couldn't be deleted (not found or not owned)
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Firestore bulk delete error:", err);
    return NextResponse.json(
      { error: "Failed to perform bulk delete", details: err.message },
      { status: 500 }
    );
  }
}
