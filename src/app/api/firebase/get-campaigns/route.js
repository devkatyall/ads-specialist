// app/api/campaigns/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getServerSession } from "next-auth"; // Adjust import path if needed
import { authOptions } from "../../auth/[...nextauth]/route";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

const db = admin.firestore();

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      // Ensure user ID is available
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const campaignsRef = db.collection("campaigns");
    const snapshot = await campaignsRef.where("userId", "==", userId).get();

    if (snapshot.empty) {
      return NextResponse.json({ campaigns: [] }, { status: 200 });
    }

    const campaigns = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      campaigns.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null, // Convert Firestore Timestamp to JS Date
      });
    });

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaigns from Firebase:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch campaigns. Please try again.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
