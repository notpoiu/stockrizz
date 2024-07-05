"use client";

import { RizzAnalysis } from "@/server/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import React from "react";
import { BarChart2Icon } from "lucide-react";

function TextWithLineBreaks({text}: {text: string}) {
    const textWithBreaks = text.split('\n').map((text, index) => (
      <React.Fragment key={index}>
        {text}
        <br />
      </React.Fragment>
    ));
  
    return <div className="max-w-[270px]">{textWithBreaks}</div>;
}

export function IMessageComponent() {
    const [data, setData] = useState<RizzAnalysis>({analysis: [], overall_rating: 0});
    const [doesExist, setDoesExist] = useState(false);

    useEffect(() => {
        setData(JSON.parse(localStorage.getItem("analysis") || "{analysis: [], overall_rating: 0}") as RizzAnalysis);
        
        if (localStorage.getItem("analysis") !== null) {
            setDoesExist(true);
        }
    },[])
    
    return (
        <div className="flex flex-col px-2 py-2 w-[40vw] *:mb-4">
            {!doesExist && <p className="text-center text-gray-500">No analysis data found</p>}
            {doesExist && data.analysis.map((message, index) => {
                if (message.from === "to_usr") {
                    return (
                        <div key={index} className="flex justify-start">
                            <div className="px-3 py-2 relative bg-[#e5e5ea] rounded-[20px] rounded-bl-[10px] text-black">
                                <TextWithLineBreaks text={message.message} />
                                <Image src="/txt_bubble_corner_grey.png" alt="" width={36} height={12} className="absolute bottom-[-1px] left-[-9px]" />
            
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

                return (
                    <div key={index} className="flex justify-end">
                        <div className="px-3 py-2 relative bg-[#39a1f9] rounded-[20px] rounded-br-[10px] text-white">
                            <TextWithLineBreaks text={message.message} />
                            <Image src="/txt_bubble_corner_blue.png" alt="" width={36} height={12} className="absolute bottom-[-1px] right-[-9px]" />

                            <DropdownMenu>
                                <DropdownMenuTrigger className="absolute top-[-10px] left-[-9px]"><Image src={`/icons/${message.analyisis}.svg`} alt={message.analyisis} width={24} height={24} /></DropdownMenuTrigger>
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
            })}

        </div>
    )
}