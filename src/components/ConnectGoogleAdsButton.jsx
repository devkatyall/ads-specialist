"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ConnectGoogleAdsButton() {
  const { data: session, status } = useSession();

  // You can use the session status to conditionally render content
  // For example, if already authenticated, maybe show a "View Campaigns" button
  // instead of "Connect Google Ads Account".
  if (status === "loading") {
    return (
      <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed">
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="text-center">
        <p className="text-green-600 font-semibold mb-2">
          Google Ads Account Connected!
        </p>
        <p className="text-sm text-gray-500">
          You are logged in as {session.user?.email}
        </p>
        {/* You can add a button here to explicitly refresh data or manage connection */}
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")} // Trigger Google OAuth flow
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
    >
      Connect Google Ads Account
    </button>
  );
}
