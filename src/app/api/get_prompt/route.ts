import path from "path";
import fs from "fs";

export async function GET() {
    const file_path = path.join(process.cwd(), 'prompt.md');
    const system_prompt = fs.readFileSync(file_path, "utf8");

    return new Response(system_prompt)
}