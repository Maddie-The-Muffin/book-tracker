"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Auto-dismisses and strips the `updated` param so a page refresh doesn't re-show it.
export function UpdateSuccessDialog() {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      router.replace("/shelf");
    }, 2500);
    return () => clearTimeout(timeout);
  }, [router]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg">
        Book updated
      </div>
    </div>
  );
}
