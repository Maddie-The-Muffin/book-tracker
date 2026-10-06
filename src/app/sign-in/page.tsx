import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/ui/AuthForm";
import { getUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage() {
  // Already signed in? Skip the form.
  if (await getUser()) redirect("/");
  return <AuthForm mode="sign-in" />;
}
