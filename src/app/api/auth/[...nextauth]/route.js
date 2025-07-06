// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { db } from "@/lib/firebaseAdmin";
import bcrypt from "bcrypt";

export const authOptions = {
  // Persist users & sessions in Firestore
  adapter: FirestoreAdapter(db),

  // Authentication providers
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) return null;

        // Look up user in Firestore
        const usersRef = db.collection("users");
        const snapshot = await usersRef
          .where("email", "==", email)
          .limit(1)
          .get();
        if (snapshot.empty) return null;

        const userDoc = snapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };

        // Validate password
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;

        // Return user object for session
        return { id: user.id, email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/auth/login",
  },

  // JWT sessions
  session: { strategy: "jwt", maxAge: 30 * 24 * 3600 },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
