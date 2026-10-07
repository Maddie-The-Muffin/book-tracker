import Link from "next/link";

export function Footer() {
    return  (
    <footer className="border-t border-border items-center py-1 bg-surface">
        <div className="flex flex-wrap mx-auto py-1 justify-center gap-4">
            <p className="inline text-center text-ink-muted">Created by{" "}
                <a href="https://www.maddietavares.dev/"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-ink font-bold underline inline-flex min-h-11 items-center"
                >Madilyn Tavares {" "}<span className="sr-only">(opens in a new tab)</span>
                </a>
            </p>
            <p className="inline text-center">
                <Link href="/privacy" className="inline-flex min-h-11 items-center text-sm text-ink-muted underline">
                    Privacy Policy
                </Link>
            </p>
        </div>
    </footer>
    )
}
