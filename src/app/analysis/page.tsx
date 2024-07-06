import { RizzEloParagraph } from "@/components/estimate-analysis-client";
import { IMessageComponent } from "@/components/message-gen-component";
import { Button } from "@/components/ui/button";
import { HomeIcon, SendToBackIcon, StepBack } from "lucide-react";
import Link from "next/link";

export default function AnalysisPage() {
    return (<main className="flex flex-col justify-center items-center w-screen h-screen">
        <h1 className="text-3xl">Analysis</h1>
        <RizzEloParagraph />
        
        <div className="flex-row flex w-screen justify-center items-center">
            <IMessageComponent />
        </div>
        <div>
            <Link href="/"><Button>Go Back <HomeIcon className="ml-2" /></Button></Link>
            
        </div>
    </main>)
}