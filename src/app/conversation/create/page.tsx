import { ConersationClientPage } from "@/components/conversation-client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Conversation - Stockrizz",
    description: "Generate a Conversation.",
}

export default function ConversationPage() {
    return (
        <ConersationClientPage />
    )
}