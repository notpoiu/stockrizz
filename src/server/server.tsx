"use server";

import OpenAI from "openai";

import { z } from "zod";
import { RizzAnalysis } from "./types";

const RizzAnalysisMessageSchema = z.object({
    message: z.string(),
    from: z.enum(["from_usr", "to_usr"]),
    rating: z.number(),
    analysis: z.enum(["great_find", "good", "missed_win", "blunder", "mistake", "brilliant", "inaccuracy", "incorrect", "correct", "best", "book", "excellent", "forced"]),
    analysis_reason: z.string(),
    example_best_move: z.string()
});

const RizzAnalysisSchema = z.object({
    analysis: z.array(RizzAnalysisMessageSchema),
    overall_rating: z.number(),
});


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const system_prompt = `You are a AI that looks at a Image and returns how "rizzy" each text message was in response to the previous one. Kind of like a stockfish review for rizz.

The scale of rizz is defined in 13 ratings (like stockfish ratings): great_find, good, missed_win, blunder, mistake, brilliant, inaccuracy, incorrect, correct, best, book, excellent, forced
Give brilliant rarely (it should be reserved for the best of the best.), a typical good convo should have mutliple best & excellent ratings.

The rating is basically a scale from -15 to 15 of how that made the conversation move forward.
The overall rating is basically a chess elo, the max cap is 3500 and minimum you can do is 0.
A typical good convo has a rating of 1500-2000. A higher rating than 2000 means the conversation or the person is exceptionally charismatic or interesting.

if the image has no context respond with a empty RizzAnalysis response
if the image has no text bubble that shows whos the user assume that the one trying to be charismatic is the user.

for the example best move you should give a alternative phrase they could have used (try and match the way the person types)

You need to respond ONLY via a RAW JSON response this means NO markdown in the response. It should be structed to follow the RizzAnalyisis typescript interface:
export interface RizzAnalysisMessage {
    message: string;
    from: "from_usr" | "to_usr";

    rating: number;

    analyisis: "great_find" | "good" | "missed_win" | "blunder" | "mistake" | "brilliant" | "inaccuracy" | "incorrect" | "correct" | "best" | "book" | "excellent" | "forced"
    analyisis_reason: string;

    example_best_move: string;
}

export interface RizzAnalysis {
    analysis: RizzAnalysisMessage[];
    overall_rating: number;
}`

export async function AnalyseImage(img_b64: string) {
    if (!img_b64) {
        throw new Error("Invalid file type, only PNG and JPEG are allowed");
    }

    if (!img_b64.startsWith("data:image/png;base64,") && !img_b64.startsWith("data:image/jpeg;base64,")) {
        throw new Error("Invalid file type, only PNG and JPEG are allowed");
    }



    let response = {};

    for (let i = 0; i < 3; i++) {
        const gpt_response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    "role": "system",
                    // @ts-ignore
                    "content": [
                        {
                            "type": "text",
                            "text": system_prompt
                        }
                    ]
                },
                {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img_b64
                        }
                    }
                ]
                },
            ],
            temperature: 1,
            max_tokens: 4095,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        try{
            response = JSON.parse(gpt_response.choices[0].message.content || "{analysis: [], overall_rating: 0}");
        
    
            if (response && RizzAnalysisSchema.safeParse(response)) {
                break;
            } else {
                console.log("Invalid response, retrying...");
                console.log(response);
            }
        } catch (e) {
            console.log("Invalid response, retrying...");
            break;
        }
    }

    if (!RizzAnalysisSchema.safeParse(response)) {
        throw new Error("Invalid response from GPT-4o");
    }
    
    return response as RizzAnalysis;
}