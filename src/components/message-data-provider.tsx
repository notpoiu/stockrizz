"use client";

import { RizzAnalysis } from "@/server/types";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const providerContext = createContext({data: {}, exists: false} as {data: RizzAnalysis, exists: boolean});

export const useMessageData = () => { 
    return useContext(providerContext);
}

export function MessageDataProvider({ children }: {children: ReactNode}) {

    const searchParams = useSearchParams();

    const [data, setData] = useState<RizzAnalysis>({
        analysis: [],
        overall_rating: 0
    });
    const [exists, setExists] = useState(false);

    useEffect(() => {
        if (searchParams.has("s")) {
            try {
                setData(JSON.parse(atob(searchParams.get("s") || "") || "{analysis: [], overall_rating: 0}") as RizzAnalysis);
                setExists(true);
            } catch(e) {
                console.error(e);
            }

            return;
        }

        try{
            setData(JSON.parse(localStorage.getItem("analysis") || "{analysis: [], overall_rating: 0}") as RizzAnalysis);
            setExists(true);
        } catch(e) {
            console.error(e);
        }
    },[])


    return (
        <providerContext.Provider value={{data: data, exists: exists}}>
            {children}
        </providerContext.Provider>
    )
}