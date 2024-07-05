"use client";

import { RizzAnalysis } from "@/server/types";
import { useState, useEffect } from "react";

export function RizzEloParagraph() {

    const [data, setData] = useState<RizzAnalysis>({analysis: [], overall_rating: 0});

    useEffect(() => {
        setData(JSON.parse(localStorage.getItem("analysis") || "{analysis: [], overall_rating: 0}") as RizzAnalysis);
    },[])

    return (
        <p className="mb-2">Your estimated rizz elo: <span className="font-bold">{data.overall_rating}</span></p>
    )

}