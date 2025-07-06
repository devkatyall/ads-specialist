"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export function Providers({ children, session }) {
  return <SessionProvider ession={session}>{children}</SessionProvider>;
}
