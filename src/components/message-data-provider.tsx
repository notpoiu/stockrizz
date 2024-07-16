"use client";

import { base64decode } from "@/lib/base64";
import { RizzAnalysis } from "@/server/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, ReactNode, Suspense, useContext, useEffect, useState } from "react";

const providerContext = createContext({data: {analysis: [], overall_rating: 0}, exists: false} as {data: RizzAnalysis, exists: boolean});

export const useMessageData = () => { 
    return useContext(providerContext);
}

export function MessageDataProvider({ children }: {children: ReactNode}) {

    const [data, setData] = useState<RizzAnalysis>({
        analysis: [],
        overall_rating: 0
    });
    const [exists, setExists] = useState(false);

    useEffect(() => {
        try{
            setData(JSON.parse(localStorage.getItem("analysis") || "{analysis: [], overall_rating: 0}") as RizzAnalysis);
            setExists(true);
        } catch(e) {
            console.error(e);
        }
    }, [])


    return (
        <providerContext.Provider value={{data: data, exists: exists}}>
            {children}
        </providerContext.Provider>
    )
}
