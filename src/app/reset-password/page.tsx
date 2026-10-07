import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/ui/ResetPasswordForm";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage(props: PageProps<"/reset-password">) {
  // Better Auth redirects here with ?token=... (valid) or ?error=INVALID_TOKEN.
  const { token } = await props.searchParams;
  // searchParams values can be string | string[]; only accept a single string.
  return <ResetPasswordForm token={typeof token === "string" ? token : undefined} />;
}
