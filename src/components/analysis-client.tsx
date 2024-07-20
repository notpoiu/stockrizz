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
        <main className="mt-5 text-center">
            <h1 className="text-3xl">Analysis</h1>
            <p className="mb-2">Your estimated rizz elo: <span className="font-bold">{data.overall_rating}</span></p>
            <div className="w-screen flex flex-col justify-center items-center">
                <p className="mb-3 flex-row flex max-w-[50vw]"><span className="shrink">To get more insight press on the rating icons such as</span><Image src={`/icons/best.svg`} alt={"best"} width={24} height={24} className="ml-2 shrink" /></p>
                
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