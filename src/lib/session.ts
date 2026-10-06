import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Returns the current session's user, or null when signed out.
export async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// The authoritative auth check. Call this at the top of every page that reads
// user data and every Server Action: Server Actions are public endpoints, so
// the proxy redirect alone is not enough. Redirects to /sign-in when signed out.
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  return user;
}
