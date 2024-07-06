"use client";

import { RizzAnalysis, RizzAnalysisMessage } from "@/server/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import React from "react";
import { BarChart2Icon } from "lucide-react";
import { useMessageData } from "./message-data-provider";

const TextBubbleColors = {
    "to_usr": "#e5e5ea",
    "from_usr": "#39a1f9"
}


function TextWithLineBreaks({text}: {text: string}) {
    const textWithBreaks = text.split('\n').map((text, index) => (
      <React.Fragment key={index}>
        {text}
        <br />
      </React.Fragment>
    ));
  
    return <div className="max-w-[270px]">{textWithBreaks}</div>;
}

export function TextBubble({message, from, key}: {message: RizzAnalysisMessage, from: "to_usr" | "from_usr", key?: number}) {
    return (
        <div className={`flex ${from == "to_usr" ? "justify-start" : "justify-end"}`} key={key}>
            <div className={`px-3 py-2 relative ${from == "to_usr" ? "rounded-[20px] rounded-bl-[10px] text-black" : "rounded-[20px] rounded-br-[10px] text-white"}`} style={{"background": TextBubbleColors[from]}}>
                <TextWithLineBreaks text={message.message} />
                <Image src={`/txt_bubble_corner_${from == "to_usr" ? "grey" : "blue"}.png`} alt="" width={36} height={12} className={`absolute ${from == "to_usr" ? "bottom-[-1px] left-[-9px]" : "bottom-[-1px] right-[-9px]"}`} />

                <DropdownMenu>
                    <DropdownMenuTrigger className="absolute top-[-10px] right-[-9px]">
                        <Image src={`/icons/${message.analyisis}.svg`} alt={message.analyisis} width={24} height={24} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="px-2 py-2 max-w-[250px]">
                        <div className="flex flex-row *:mr-2 capitalize font-bold">
                            <Image src={`/icons/${message.analyisis}.svg`} alt={message.analyisis} width={24} height={24} />
                            <p>{message.analyisis}</p>
                            <div className="flex flex-row ml-auto">
                                <BarChart2Icon />
                                <span className="font-semibold">{message.rating}</span>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        
                        <p>{message.analyisis_reason}</p>

                        <div className="flex flex-row *:mr-2 font-semibold mt-3">
                            <p>Alternative</p>
                            <Image src="/icons/best.svg" width={24} height={24} alt="best move icon"/>
                            <p>Move:</p>
                        </div>
                        <p>{message.example_best_move}</p>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export function IMessageComponent() {
    const { data, exists } = useMessageData();
    
    return (
        <div className="flex flex-col px-2 py-2 w-[40vw] *:mb-4">
            {!exists && <p className="text-center text-gray-500">No analysis data found</p>}
            {exists && data.analysis.map((message, index) => {
                return <TextBubble message={message} from={message.from} key={index} /> 
            })}
        </div>
    )
}