"use client";

import { RizzAnalysis } from "@/server/types";
import { useState, useEffect } from "react";
import { useMessageData } from "./message-data-provider";

export function RizzEloParagraph() {
    const { data } = useMessageData();

    return (
        <p className="mb-2">Your estimated rizz elo: <span className="font-bold">{data.overall_rating}</span></p>
    )

}