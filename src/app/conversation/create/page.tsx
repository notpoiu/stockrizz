import { ConersationClientPage } from "@/components/conversation-creation-client"
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