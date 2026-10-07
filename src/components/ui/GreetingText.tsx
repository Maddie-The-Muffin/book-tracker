import { getUser } from "@/lib/session"

export async function GreetingText() {
    const user = await getUser();
    const userText = user?.name ?? "User";
    
    return (
        <p className="ml-auto inline-flex items-center text-sm text-ink-muted">Hi, {userText}!</p>
    )
}