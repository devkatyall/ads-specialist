// lib/firebaseAdmin.js
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Support either full JSON service account or individual env vars.
// Option 1: FIREBASE_SERVICE_ACCOUNT = JSON-string of serviceAccount
// Option 2: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (escaped newlines) or PRIVATE_KEY_BASE64

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    throw new Error("Invalid JSON in FIREBASE_SERVICE_ACCOUNT: " + err.message);
  }
} else {
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_BASE64,
  } = process.env;
  if (
    !FIREBASE_PROJECT_ID ||
    !FIREBASE_CLIENT_EMAIL ||
    (!FIREBASE_PRIVATE_KEY && !FIREBASE_PRIVATE_KEY_BASE64)
  ) {
    throw new Error("Missing Firebase credentials.");
  }
  let privateKey = FIREBASE_PRIVATE_KEY_BASE64
    ? Buffer.from(FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8")
    : FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
  serviceAccount = {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey,
  };
}

// Initialize or get existing app
const firebaseApp = getApps().length
  ? getApp()
  : initializeApp({ credential: cert(serviceAccount) });

// Export Firestore instance
export const db = getFirestore(firebaseApp);
