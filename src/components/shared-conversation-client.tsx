"use client";

import { GetConversation } from "@/server/server";
import { RizzAnalysis } from "@/server/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TextBubble } from "./message-gen-component";
import { Button } from "./ui/button";
import Link from "next/link";

export default function SharedConersationClientPage({data, id}: {data: RizzAnalysis | null, id: string}) {
    if (data === null) {
        return notFound();
    }
    
    return (
        <main className="flex flex-col justify-center items-center w-screen h-screen">
            <h1 className="text-3xl">Shared Conversation</h1>
            <p className="mb-3 flex-row flex max-w-[50vw]">To get more insight press on the rating icons such as <Image src={`/icons/best.svg`} alt={"best"} width={24} height={24} className="ml-2" /></p>
            
            <div className="flex flex-col px-2 py-2 w-[40vw] *:mb-4">
                {data && data.analysis.map((message, index) => {
                    return <TextBubble message={message} from={message.from} key={index} /> 
                })}
            </div>

            <Link href="/"><Button>Try for yourself!</Button></Link>

            <footer className="fixed bottom-0 left-0">
                <p className="text-xs text-muted-foreground mb-2 ml-2">ID: {id}</p>
            </footer>
        </main>
    )
}