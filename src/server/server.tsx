"use server";

import OpenAI from "openai";

import { z } from "zod";
import { message, RizzAnalysis } from "./types";

import { Octokit } from "@octokit/rest";
import path from "path";

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

const code = '```ts\nexport interface RizzAnalysisMessage { message: string; from: "from_usr" | "to_usr"; rating: number; analysis: "great_find" | "good" | "missed_win" | "blunder" | "mistake" | "brilliant" | "inaccuracy" | "incorrect" | "correct" | "best" | "book" | "excellent" | "forced" analysis_reason: string; example_best_move: string; }\nexport interface RizzAnalysis { analysis: RizzAnalysisMessage[]; overall_rating: number; }\n```'
const json_resp = '```json\n{overall_rating: 0, analysis: []}\n```'

const system_prompt = `You are an AI that rates how "rizzy" each message is. Basically a stockfish for rizz.

The rating is basically a scale from -15 to 15 of how that made the conversation move forward. The overall rating is basically a chess elo, the max cap is 3500 and minimum you can do is 0. A typical good convo has a rating of 1500-2000. A higher rating than 2000 means the conversation or the person is exceptionally charismatic or interesting.

You respond via a raw JSON. following the `RizzAnalysis` interface:
${code}

For instance, respond with this:
{overall_rating: 0, analysis: []}
And NOT the following:
${json_resp}

The user may provide a image. If the image has no context respond with a empty RizzAnalysis response if the image has no text bubble that shows whos the user assume that the one trying to be charismatic is the user.


The scale of rizz is defined in 13 ratings (like stockfish ratings): great_find, good, missed_win, blunder, mistake, brilliant, inaccuracy, incorrect, correct, best, book, excellent, forced

Typically, a book move is given at the start of the conversation when either person asks a question or says a introduction ex: "hi".

You should give a rating that would show how well the person managed to move the conversation in a good way, for instance, heres a conversation that could happen and the rating i would give the messages:

from_user: Heyy, I have a question
rating: book

to_user: Yeah what is it?
rating: book

from_user: Why don't you have a girlfriend?
rating: good

to_user: Yeahh well my parents are strict
rating: excellent

to_user: wbu?
rating: good

from_user: Your parents are strict
rating: brilliant`

async function analyse(content: any[]) {
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
                    "content": content
                },
            ],
            temperature: 1,
            max_tokens: 4095,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        try{
            response = JSON.parse(gpt_response.choices[0].message.content?.replaceAll("```json","").replaceAll("```","") || "{analysis: [], overall_rating: 0}");
            
            if (response && RizzAnalysisSchema.safeParse(response).success) {
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

export async function AnalyseImage(img_b64: string) {
    if (!img_b64) {
        throw new Error("Invalid file type, only PNG and JPEG are allowed");
    }

    if (!img_b64.startsWith("data:image/png;base64,") && !img_b64.startsWith("data:image/jpeg;base64,")) {
        throw new Error("Invalid file type, only PNG and JPEG are allowed");
    }

    const result = await analyse([
        {
            "type": "image_url",
            "image_url": {
                "url": img_b64
            }
        }
    ]);

    const id = await ShareConversation(result);
    return id;
}

export async function AnalyseConversation(messages: message[]) {

    if (!messages || messages.length === 0) {
        throw new Error("Invalid messages");
    }

    const result = await analyse([
        {
            "type": "text",
            "text": JSON.stringify(messages)
        }
    ]);

    const id = await ShareConversation(result);
    return id;
}

const owner = process.env.GITHUB_REPO_OWNER || "notpoiu";
const repo = process.env.GITHUB_REPO_NAME || "test_database";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

function GenerateConversationID(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
  

export async function ShareConversation(result: RizzAnalysis) {
    if (!result) {
        throw new Error("Invalid result");
    }

    if (!RizzAnalysisSchema.safeParse(result).success) {
        throw new Error("Invalid result");
    }

    const contentBase64 = Buffer.from(JSON.stringify(result)).toString('base64');

    const id = GenerateConversationID(getRandomArbitrary(5, 8));

    const params = {
        owner: owner,
        repo: repo,
        path: `conversations/${id}.json`,
        message: 'Conversation Analysis Share',
        content: contentBase64,
    };

    await octokit.repos.createOrUpdateFileContents(params);

    return id;
}

export async function GetConversation(id: string) {
    if (!id) {
        return null;
    }

    const params = {
        owner: owner,
        repo: repo,
        path: `conversations/${id}.json`,
    };

    try{
        const response = await octokit.repos.getContent(params);

        if (response.status !== 200) {
            return null;
        }
    
        // @ts-ignore
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    
        return JSON.parse(content) as RizzAnalysis;

    } catch (e) {
        return null;
    }

}

        
