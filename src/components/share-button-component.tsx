"use client";

import { ClipboardIcon, ShareIcon } from "lucide-react";
import { Button } from "./ui/button";
import { RizzAnalysis } from "@/server/types";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { useMessageData } from "./message-data-provider";

export function ShareButton({className, variant}: {className?: string, variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}) {
    const { data, exists } = useMessageData();
    const [urlString, setUrlString] = useState<string>("Loading...");

    function Share() {
        if (!exists) {
            toast.error("Sorry there was an error generating the link, please try again later.");
            return;
        }

        const url = new URL(window.location.href);

        // s like share
        url.searchParams.append("s", btoa(JSON.stringify(data)));

        setUrlString(url.toString());

        toast.success("Link generated, copied to clipboard!");
        navigator.clipboard.writeText(url.toString());
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant} className={className} onClick={Share}>
                    Share <ShareIcon className="ml-2" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Share your Rizz Analytics</AlertDialogTitle>
                    <AlertDialogDescription>
                        Share the link generated to share how you did to others!
                        (yes its super long because we don&apos;t use a database to store data)
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <pre className="px-2 mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 text-white">
                    {urlString}
                </pre>

                <AlertDialogFooter>
                    <AlertDialogCancel>Dismiss</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}