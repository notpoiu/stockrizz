import { RizzEloParagraph } from "@/components/estimate-analysis-client";
import { IMessageComponent } from "@/components/message-gen-component";
import { ShareButton } from "@/components/share-button-component";
import { Button } from "@/components/ui/button";
import { HomeIcon, SendToBackIcon, StepBack } from "lucide-react";
import Link from "next/link";
import { MessageDataProvider } from "@/components/message-data-provider";

export default function AnalysisPage() {
    return (
        <MessageDataProvider>
            <main className="flex flex-col justify-center items-center w-screen h-screen">
                <h1 className="text-3xl">Analysis</h1>
                <RizzEloParagraph />
                
                <div className="flex-row flex w-screen justify-center items-center">
                    <IMessageComponent />
                </div>
                <div>
                    <Link href="/"><Button>Go Back <HomeIcon className="ml-2" /></Button></Link>
                    <ShareButton variant="outline" className="ml-2" />
                </div>
            </main>
        </MessageDataProvider>
    )
}