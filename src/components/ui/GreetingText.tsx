import { getUser } from "@/lib/session"

export async function GreetingText() {
    const user = await getUser();
    const userText = user?.name ?? "User";
    
    return (
        <p className="inline-flex min-h-11 md:ml-auto items-center text-sm text-ink-muted">Hi, {userText}!</p>
    )
}