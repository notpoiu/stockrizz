"use client";

import { RizzAnalysis } from "@/server/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TextBubble } from "./message-gen-component";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AnalysisClientPage({data, id}: {data: RizzAnalysis | null, id: string}) {
    if (data === null) {
        return notFound();
    }
    
    return (
        <main className="mt-[25vh] mb-[15vh] text-center overflow-x-hidden">
            <h1 className="text-3xl">Analysis</h1>
            <p className="mb-2">Your estimated rizz elo: <span className="font-bold">{data.overall_rating}</span></p>
            <div className="w-screen flex flex-col justify-center items-center">
                <div className="flex flex-wrap items-start max-w-[50vw] mb-3">
                    <p className="flex-1 mb-0">
                        To get more insight press on the rating icons such as
                    </p>
                    <Image src={`/icons/best.svg`} alt={"best"} width={24} height={24} className="flex-shrink-0 ml-2 self-end" />
                </div>
                
                <div className="flex flex-col px-2 py-2 w-[40vw] *:mb-4">
                    {data && data.analysis.map((message, index) => {
                        return <TextBubble message={message} from={message.from} key={index} /> 
                    })}
                </div>
    
                <Link href="/"><Button className="mb-5">Try for yourself!</Button></Link>
            </div>


            <footer className="fixed bottom-0 left-0">
                <p className="text-xs text-muted-foreground mb-2 ml-2">ID: {id}</p>
            </footer>
        </main>
    )
}
