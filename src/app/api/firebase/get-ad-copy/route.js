// app/api/firebase/get-ad-copies/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Initialize Firebase admin if not already
if (!admin.apps.length) {
  try {
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(svc) });
    console.log("✅ Firebase admin initialized (GET route)");
  } catch (err) {
    console.error("❌ Firebase admin init error:", err);
  }
}

const db = admin.firestore();

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await db
      .collection("adCopies")
      .where("userId", "==", session.user.id)
      .orderBy("createdAt", "desc")
      .get();

    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ adCopies: results }, { status: 200 });
  } catch (err) {
    console.error("❌ Firestore read error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve ad copies", details: err.message },
      { status: 500 }
    );
  }
}
