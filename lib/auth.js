import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials?.email.toLowerCase() }).select(
          "+passwordHash"
        );

        if (!user) {
          throw new Error("No account found with this email.");
        }

        const isValid = await bcrypt.compare(
          credentials?.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          role:  user.role,
          image: user.avatar || null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
