import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { config } from "@/lib/config";

type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

function getDemoSession(): AuthSession {
  const now = new Date();
  return {
    session: {
      id: "demo-session",
      token: "demo-session-token",
      userId: "demo-user",
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      createdAt: now,
      updatedAt: now,
      ipAddress: null,
      userAgent: null,
    },
    user: {
      id: "demo-user",
      name: "Demo Reviewer",
      email: "demo@example.com",
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
  } as AuthSession;
}

export const getCurrentSession = cache(
  async (): Promise<AuthSession | null> => {
    if (config.adminDemoMode) {
      return getDemoSession();
    }

    return auth.api.getSession({ headers: await headers() });
  }
);

export const requireSession = cache(async () => {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
});
