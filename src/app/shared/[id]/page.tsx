import SharedConersationClientPage from "@/components/shared-conversation-client";
import { GetConversation } from "@/server/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shared Conversation - Stockrizz",
    description: "Shared Conversation.",
}

export default async function SharedConversationPage({params}: {params: {id: string}}) {
    return (
        <SharedConersationClientPage id={params.id} data={await GetConversation(params.id)} />
    )
}