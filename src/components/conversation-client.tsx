"use client";

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

import { Textarea } from "@/components/ui/textarea"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
  

import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { RawTextBubble, TextBubbleColors } from "./message-gen-component";
import { Label } from "./ui/label";

import { message, RizzAnalysis } from "../server/types";

import { z } from "zod";
import { toast } from "sonner";
import { AnalyseConversation } from "@/server/server";

import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { BarChart2Icon, EditIcon, MoreHorizontalIcon, OptionIcon, SettingsIcon, TrashIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

const msgSchema = z.object({
    message: z.string(),
    from: z.enum(["to_usr", "from_usr"]),
});

export function ConersationClientPage() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [from, setFrom] = useState<"from_usr" | "to_usr">("from_usr");
    const [message, setMessage] = useState<string>("Hello, how are you?");
    const [messages, setMessages] = useState<message[] | null>(null);

    const [edit_message, setEditMessage] = useState<string>("");
    const [edit_from, setEditFrom] = useState<"from_usr" | "to_usr">("from_usr");

    useEffect(() => {
        if (messages === null) {
            return;
        }

        localStorage.setItem("created.convo", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {

        const data = localStorage.getItem("created.convo");
        const is_not_null = data && data.length > 0 && data !== "undefined" && data !== "null";
        if (is_not_null && z.array(msgSchema).safeParse(JSON.parse(data)).success) {
            setMessages(JSON.parse(data));
            localStorage.setItem("created.convo", JSON.stringify(data));
        }

        if (!is_not_null) {
            setMessages([]);
        }
    }, []);

    function reset_alert_options() {
        setMessage("Hello, how are you?");
        setFrom("from_usr");

        setEditMessage("");
        setEditFrom("from_usr");
    }

    return (
        <main className="container">
            <h1 className="text-center text-lg mt-2">Conversation feed</h1>

            <div className="flex flex-col gap-2 mt-2">
                {messages && messages.map((message, index) => (
                    <RawTextBubble message={message.message} from={message.from} key={index}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={`absolute ${from == "to_usr" ? "top-[-10px] right-[-9px]" : "top-[-10px] left-[-9px]"}`}>
                                <SettingsIcon className="w-[24px] h-[24px] stroke-black" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="px-2 py-2 max-w-[250px]">
                                <div className="flex flex-row *:mr-2 capitalize font-bold">
                                    <SettingsIcon className="w-[24px] h-[24px] mr-2" />
                                    <p>Options</p>
                                </div>
                                <DropdownMenuSeparator />

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full">
                                            <TrashIcon className="w-[24px] h-[24px] mr-2" />
                                            Delete Message
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you absolutely sure? This action is irreversible.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => {
                                                const new_messages = messages.filter((msg, i) => i !== index);
                                                setMessages(new_messages);
                                                localStorage.setItem("created.convo", JSON.stringify(new_messages));
                                            }}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full mt-2" onClick={() => {
                                            setEditMessage(message.message);
                                            setEditFrom(message.from);
                                        }}>
                                            <EditIcon className="w-[24px] h-[24px] mr-2" />
                                            Edit Message
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Edit Text</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This exits a message, a preview is shown below
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        
                                        <div className="mt-2" />
                                        
                                        <RawTextBubble message={edit_message} from={edit_from} />
                                        
                                        <div className="grid w-full gap-1.5 mt-3">
                                            <Label htmlFor="message">Your message</Label>
                                            <Textarea placeholder="Type your message here."  onChange={(event) => { setEditMessage(event.target.value); }} />
                                        </div>

                                        <AlertDialogFooter>
                                            <Select onValueChange={(value) => {
                                                // @ts-ignore
                                                setEditFrom(value)
                                            }}>
                                                <SelectTrigger className="md:mr-auto max-sm:mt-2">
                                                    <SelectValue placeholder="Coming from..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="from_usr">From you</SelectItem>
                                                    <SelectItem value="to_usr">From them</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <AlertDialogCancel onClick={reset_alert_options}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => {
                                                const new_messages = messages.map((msg, i) => {
                                                    if (i === index) {
                                                        return {message: edit_message, from: edit_from};
                                                    }

                                                    return msg;
                                                });

                                                setMessages(new_messages);

                                                reset_alert_options();
                                            }}>Save</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </RawTextBubble>
                ))}
            </div>

            <footer className="fixed bottom-0 w-[calc(100%-2rem-2rem)] mb-2 flex flex-col border-t py-2">
                <h1>Conversation Generator</h1>
                <p className="text-sm">Generate a conversation</p>

                <div className="fixed bottom-0 mb-4 right-[32px] flex-row max-md:flex-col">
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} className="max-md:block hidden">
                                <MoreHorizontalIcon className="w-[24px] h-[24px] stroke-black" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="flex flex-col">
                            <Link href="/">
                                <Button variant={"outline"} className="mb-2 w-full">
                                    Go Back
                                </Button>
                            </Link>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button disabled={isOpen} className="mb-2">
                                        Analyse
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are there any modifications you want to do? This action is irreversible.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => {
                                            toast.promise(AnalyseConversation(messages as message[]), {
                                                loading: "Analysing...",
                                                success: (data: RizzAnalysis) => {
                                                    console.log(data);
        
                                                    if ((data as unknown) as string == "undefined" || (data as unknown) as string == "null") {
                                                        throw new Error("Invalid response from GPT-4o");
                                                    }
        
                                                    localStorage.setItem("analysis", JSON.stringify(data));
                    
                                                    router.push("/analysis");
                                                    localStorage.removeItem("created.convo");
                                                    return "Conversation analysed successfully!";
                                                },
                                                error: "Failed to analyse"    
                                            })
                                        }}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog onOpenChange={(open) => {setIsOpen(open)}}>
                                <AlertDialogTrigger asChild>
                                    <Button disabled={isOpen} className="">
                                        Create Text Message
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Text Creation</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This creates a message, a preview is shown below
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    
                                    <div className="mt-2" />
                                    
                                    <RawTextBubble message={message} from={from} />
                                    
                                    <div className="grid w-full gap-1.5 mt-3">
                                        <Label htmlFor="message">Your message</Label>
                                        <Textarea placeholder="Type your message here."  onChange={(event) => { setMessage(event.target.value); }} />
                                    </div>

                                    <AlertDialogFooter>
                                        <Select onValueChange={(value) => {
                                            // @ts-ignore
                                            setFrom(value)
                                        }}>
                                            <SelectTrigger className="md:mr-auto max-sm:mt-2">
                                                <SelectValue placeholder="Coming from..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="from_usr">From you</SelectItem>
                                                <SelectItem value="to_usr">From them</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <AlertDialogCancel onClick={reset_alert_options}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => {
                                            setMessages([...messages as message[], {message, from}]);
                                            reset_alert_options();
                                        }}>Create</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/">
                        <Button variant={"outline"} className="mr-2 max-md:hidden">
                            Go Back
                        </Button>
                    </Link>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={isOpen} className="mr-2 max-md:hidden">
                                Analyse
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are there any modifications you want to do? This action is irreversible.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    toast.promise(AnalyseConversation(messages as message[]), {
                                        loading: "Analysing...",
                                        success: (data: RizzAnalysis) => {
                                            console.log(data);

                                            if ((data as unknown) as string == "undefined" || (data as unknown) as string == "null") {
                                                throw new Error("Invalid response from GPT-4o");
                                            }

                                            localStorage.setItem("analysis", JSON.stringify(data));
            
                                            router.push("/analysis");
                                            localStorage.removeItem("created.convo");
                                            return "Conversation analysed successfully!";
                                        },
                                        error: "Failed to analyse"    
                                    })
                                }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog onOpenChange={(open) => {setIsOpen(open)}}>
                        <AlertDialogTrigger asChild>
                            <Button disabled={isOpen} className="max-md:hidden">
                                Create Text Message
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Text Creation</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This creates a message, a preview is shown below
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            
                            <div className="mt-2" />
                            
                            <RawTextBubble message={message} from={from} />
                            
                            <div className="grid w-full gap-1.5 mt-3">
                                <Label htmlFor="message">Your message</Label>
                                <Textarea placeholder="Type your message here."  onChange={(event) => { setMessage(event.target.value); }} />
                            </div>

                            <AlertDialogFooter>
                                <Select onValueChange={(value) => {
                                    // @ts-ignore
                                    setFrom(value)
                                }}>
                                    <SelectTrigger className="md:mr-auto max-sm:mt-2">
                                        <SelectValue placeholder="Coming from..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="from_usr">From you</SelectItem>
                                        <SelectItem value="to_usr">From them</SelectItem>
                                    </SelectContent>
                                </Select>
                                <AlertDialogCancel onClick={reset_alert_options}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    setMessages([...messages as message[], {message, from}]);
                                    reset_alert_options();
                                }}>Create</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    

                    
                </div>
            </footer>
        </main>
    )
}