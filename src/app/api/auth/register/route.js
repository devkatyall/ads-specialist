// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );
  }

  // Check if already exists
  const usersRef = db.collection("users");
  const exists = await usersRef.where("email", "==", email).get();
  if (!exists.empty) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    email,
    hashedPassword,
    createdAt: new Date().toISOString(),
  };

  const docRef = await usersRef.add(newUser);
  return NextResponse.json({ id: docRef.id, email });
}
