import type { Metadata } from "next";
import { DeleteAccountForm } from "@/components/ui/DeleteAccountForm";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  // Signed-out visitors are redirected to /sign-in.
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold">Account</h1>
        <p className="text-sm text-ink-muted">Signed in as {user.email}</p>
      </div>
      <DeleteAccountForm />
    </div>
  );
}
