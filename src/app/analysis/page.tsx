import { RizzEloParagraph } from "@/components/estimate-analysis-client";
import { IMessageComponent } from "@/components/message-gen-component";
import { ShareButton } from "@/components/share-button-component";
import { Button } from "@/components/ui/button";
import { HomeIcon, SendToBackIcon, StepBack } from "lucide-react";
import Link from "next/link";
import { MessageDataProvider } from "@/components/message-data-provider";
import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Analysis - Stockrizz",
    description: "Analysed rizz from Stockrizz.",
}

export default function AnalysisPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <MessageDataProvider>
                <main className="flex flex-col justify-center items-center w-screen h-screen">
                    <h1 className="text-3xl">Analysis</h1>
                    <RizzEloParagraph />
                    <p className="mb-3 flex-row flex max-w-[50vw]">To get more insight press on the rating icons such as <Image src={`/icons/best.svg`} alt={"best"} width={24} height={24} className="ml-2" /></p>
                    
                    <div className="flex-row flex w-screen justify-center items-center">
                        <IMessageComponent />
                    </div>

                    <div>
                        <Link href="/"><Button>Go Back <HomeIcon className="ml-2" /></Button></Link>
                        <ShareButton variant="outline" className="ml-2" />
                    </div>
                </main>
            </MessageDataProvider>
        </Suspense>
        )
}