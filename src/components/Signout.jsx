"use client";

import { signOut } from "next-auth/react";
import React from "react";

export default function Signout() {
  return (
    <button onClick={() => signOut()}>
      <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center">
        <p className="text-xl font-semibold text-gray-800 mb-4">Sign Out</p>
      </div>
    </button>
  );
}
