import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/ui/ForgotPasswordForm";
import { getUser } from "@/lib/session";

export const metadata: Metadata = { title: "Reset password" };

export default async function ForgotPasswordPage() {
  // Already signed in? Skip the form.
  if (await getUser()) redirect("/");
  return <ForgotPasswordForm />;
}
