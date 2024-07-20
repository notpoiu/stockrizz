"use client";

import { RizzAnalysisMessage } from "@/server/types";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import React from "react";
import { BarChart2Icon } from "lucide-react";

export const TextBubbleColors = {
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

export function RawTextBubble({message,from, key, children}: {message: string, from: "to_usr" | "from_usr", key?: number, children?: React.ReactNode}) {
    return (
        <div className={`flex ${from == "to_usr" ? "justify-start text-left" : "justify-end text-right"}`} key={key}>
            <div className={`px-3 py-2 relative ${from == "to_usr" ? "rounded-[20px] rounded-bl-[10px] text-black" : "rounded-[20px] rounded-br-[10px] text-white"}`} style={{"background": TextBubbleColors[from]}}>
                <TextWithLineBreaks text={message} />
                <Image src={`/txt_bubble_corner_${from == "to_usr" ? "grey" : "blue"}.png`} alt="" width={36} height={12} className={`absolute ${from == "to_usr" ? "bottom-[-1px] left-[-9px]" : "bottom-[-1px] right-[-9px]"}`} />
                {children}
            </div>
        </div>
    )
}

export function TextBubble({message,from, key}: {message: RizzAnalysisMessage, from: "to_usr" | "from_usr", key?: number}) {
    
    // For depricated database entries
    // @ts-ignore
    const analysis_icon = message.analysis || message.analyisis;
    // @ts-ignore
    const analysis_message = message.analysis_reason || message.analyisis_reason;

    return (
        <RawTextBubble message={message.message} from={message.from} key={key}>
                <DropdownMenu>
                    <DropdownMenuTrigger className={`absolute ${from == "to_usr" ? "top-[-10px] right-[-9px]" : "top-[-10px] left-[-9px]"}`}>
                        <Image src={`/icons/${analysis_icon}.svg`} alt={analysis_icon} width={24} height={24} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="px-2 py-2 max-w-[250px]">
                        <div className="flex flex-row *:mr-2 capitalize font-bold">
                            <Image src={`/icons/${analysis_icon}.svg`} alt={analysis_icon} width={24} height={24} />
                            <p>{analysis_icon}</p>
                            <div className="flex flex-row ml-auto">
                                <BarChart2Icon />
                                <span className="font-semibold">{message.rating}</span>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        
                        <p>{analysis_message}</p>

                        <div className="flex flex-row *:mr-2 font-semibold mt-3">
                            <p>Alternative</p>
                            <Image src="/icons/best.svg" width={24} height={24} alt="best move icon"/>
                            <p>Move:</p>
                        </div>
                        <p>{message.example_best_move}</p>
                    </DropdownMenuContent>
                </DropdownMenu>
        </RawTextBubble>
    )
}
