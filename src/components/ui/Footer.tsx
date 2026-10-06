export function Footer() {
    return  (
    <footer className="border-t border-border items-center py-1 bg-surface">
        <div className="mx-auto py-1">
            <p className="text-center text-ink-muted">Created by{" "}
                <a href="https://www.maddietavares.dev/"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-ink font-bold underline inline-flex min-h-11 items-center"
                >Madilyn Tavares {" "}<span className="sr-only"> (opens in a new tab)</span>
                </a>
            </p>
        </div>
    </footer>
    )
}