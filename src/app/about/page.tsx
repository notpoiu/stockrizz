import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="flex flex-col justify-center items-center w-screen h-screen container">
            <div className="max-w-[500px]">
                <h1 className="text-3xl">About</h1>
                <p className="mb-2">Stockrizz is the best rizz engine</p>

                <p className="font-bold">Q: What is a rizz engine?</p>
                <p className="mb-2">A: A rizz engine is a tool that helps you analyse your rizz from your messages</p>

                <p className="font-bold">Q: How does Stockrizz work?</p>
                <p className="mb-2">A: Stockrizz under the hood uses openai&apos;s GPT-4o to analyse your rizz.</p>

                <p className="font-bold">Q: How accurate is Stockrizz?</p>
                <p className="mb-2">A: Stockrizz can make some mistakes, if you are a Developer or a Prompt Engineer, and want to help reduce these errors you may find the full site source code @ <Link href="https://github.com/notpoiu/stockrizz" className="text-[#38bdf8] underline" target="_blank">Github</Link></p>
            </div>
            <Link href={"/"}>
                <Button>Go Back</Button>
            </Link>
        </main>
    )
}