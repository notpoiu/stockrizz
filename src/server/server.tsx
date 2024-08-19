"use server";

import OpenAI from "openai";

import path from "path";
import fs from "fs";
import { z } from "zod";
import { message, RizzAnalysis } from "./types";

import { zodResponseFormat } from "openai/helpers/zod";

import { Octokit } from "@octokit/rest";
import { headers } from "next/headers";

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

async function fetch_prompt() {
    const headersList = headers();
    
    if (process.env.NODE_ENV === "development") {
        const file_path = path.join(process.cwd(), 'prompt.md');
        const system_prompt = fs.readFileSync(file_path, "utf8");

        return system_prompt;
    }

    const protocol = process.env.NODE_ENV === "production" ? "https:" : "http:";
    const base_url = process.env.NODE_ENV === "production" ? headersList.get('host') : "localhost:3000";

    const res = await fetch(`${protocol}//${base_url}/api/get_prompt`);
    const system_prompt = await res.text();
    return system_prompt;
}

async function analyse(content: any[]) {
  const system_prompt = await fetch_prompt();

  const gpt_response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
          "role": "system",
          "content": system_prompt
      },
      {
          "role": "user",
          "content": content
      },
    ],
    response_format: zodResponseFormat(RizzAnalysisSchema, "analysis")
  })
  
  return gpt_response.choices[0].message.parsed as RizzAnalysis;
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

        
