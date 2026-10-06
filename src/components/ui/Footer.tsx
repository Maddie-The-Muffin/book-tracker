export function Footer() {
    return  (
    <footer aria-label="Footer" className="border-t border-border items-center py-1 bg-surface">
        <div className="mx-auto py-4">
            <p className="text-center text-ink-muted">Created by{" "}
                <a href="https://www.maddietavares.dev/"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-ink font-bold hover:underline"
                >Madilyn Tavares <span className="sr-only"> Link to Madilyn's website (opens in a new tab)</span>
                </a>
            </p>
        </div>
    </footer>
    )
}