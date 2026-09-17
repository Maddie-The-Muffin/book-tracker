"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// How long the dialog sits fully visible before it starts sliding away.
const HOLD_MS = 1000;
// How long the slide-up-and-fade exit transition takes, must match the duration-* class below.
const EXIT_MS = 400;

// Auto-dismisses (holding briefly, then sliding up out of view) and strips the
// `updated` param so a page refresh doesn't re-show it.
export function UpdateSuccessDialog() {
  const [visible, setVisible] = useState(true);
  // Drives the exit animation: false = resting in place, true = sliding up/out.
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const leaveTimeout = setTimeout(() => setLeaving(true), HOLD_MS);
    const removeTimeout = setTimeout(() => {
      setVisible(false);
      router.replace("/shelf");
    }, HOLD_MS + EXIT_MS);
    return () => {
      clearTimeout(leaveTimeout);
      clearTimeout(removeTimeout);
    };
  }, [router]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className={`rounded-lg bg-ink px-4 py-2 text-sm text-surface shadow-lg transition-all duration-[400ms] ease-in ${
          leaving ? "-translate-y-20 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        Book updated
      </div>
    </div>
  );
}
