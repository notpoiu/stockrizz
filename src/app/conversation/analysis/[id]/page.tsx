import AnalysisClientPage from "@/components/analysis-client";
import { GetConversation } from "@/server/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shared Conversation - Stockrizz",
    description: "Shared Conversation.",
}

export default async function SharedConversationPage({params}: {params: {id: string}}) {
    const data = await GetConversation(params.id);

    return (
        <AnalysisClientPage id={params.id} data={data} />
    )
}