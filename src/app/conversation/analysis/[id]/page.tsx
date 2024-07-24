import AnalysisClientPage from "@/components/analysis-client";
import { GetConversation } from "@/server/server";

export async function generateMetadata({params}: {params: {id: string}}) {
    const data = await GetConversation(params.id);

    if (data) {
        return {
            title: `Conversation Analysis - Stockrizz`,
            description: `Your estimated rizz elo is ${data.overall_rating}. To view the full conversation, open the link.`,
        }
    }

    return {
        title: `Conversation Analysis - Stockrizz`,
        description: `${params.id} not found.`,
    }
}

export default async function SharedConversationPage({params}: {params: {id: string}}) {
    const data = await GetConversation(params.id);

    return (
        <AnalysisClientPage id={params.id} data={data} />
    )
}