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
  
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
  

import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { RawTextBubble } from "./message-gen-component";
import { Label } from "./ui/label";

import { message } from "../server/types";

import Image from "next/image";

import { z } from "zod";
import { toast } from "sonner";
import { AnalyseConversation } from "@/server/server";

import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { EditIcon, HomeIcon, MoreHorizontalIcon, SettingsIcon, TrashIcon } from "lucide-react";

import Link from "next/link";

const msgSchema = z.object({
    message: z.string(),
    from: z.enum(["to_usr", "from_usr"]),
});

function ConversationCreationActions({ messages, setMessages, is_for_mobile }: { messages: message[] | null, setMessages: (messages: message[] | null) => void, is_for_mobile?: boolean }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [from, setFrom] = useState<"from_usr" | "to_usr">("from_usr");
    const [message, setMessage] = useState<string>("Hello, how are you?");
    const router = useRouter();
    
    const reset_alert_options = () => {
        setMessage("Hello, how are you?");
        setFrom("from_usr");
    }

    return (
        <>
            <Link href="/">
                <Button variant={"outline"} className={is_for_mobile ? "" : "max-md:hidden mr-2"}>
                    {is_for_mobile ? "Back to" : ""}<HomeIcon className={`w-[24px] h-[24px] stroke-black ${is_for_mobile ? "ml-2" : ""}`} />
                </Button>
            </Link>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button disabled={isOpen} className={is_for_mobile ? "" : "max-md:hidden mr-2"}>
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
                                success: (slug: string) => {
                                    router.push(`/conversation/analysis/${slug}`);
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
                    <Button disabled={isOpen} className={is_for_mobile ? "" : "max-md:hidden"}>
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
                        <Textarea placeholder="Type your message here." className="text-[16px]"  onChange={(event) => { setMessage(event.target.value); }} />
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
        </>
    )
}

function ConversationEditActions({ messages, setMessages, index, message, is_for_mobile }: { messages: message[] | null, setMessages: (messages: message[] | null) => void, index: number, message: message, is_for_mobile?: boolean }) {
    const [edit_message, setEditMessage] = useState<string>("");
    const [edit_from, setEditFrom] = useState<"from_usr" | "to_usr">("from_usr");
    
    function reset_alert_options() {
        setEditMessage("");
        setEditFrom("from_usr");
    }
    
    return (
        <>
            {!is_for_mobile && (
                <>
                    <div className="flex flex-row *:mr-2 capitalize font-bold">
                        <SettingsIcon className="w-[24px] h-[24px] mr-2" />
                        <p>Options</p>
                    </div>
                    <DropdownMenuSeparator />
                </>
            )}

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className={is_for_mobile ? "" : "w-full"}>
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
                            if (messages === null) {
                                return;
                            }

                            const new_messages = messages.filter((msg, i) => i !== index);
                            setMessages(new_messages);
                            localStorage.setItem("created.convo", JSON.stringify(new_messages));
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className={is_for_mobile ? "" : "w-full mt-2"} onClick={() => {
                        if (messages === null) {
                            return;
                        }

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
                            if (messages === null) {
                                return;
                            }

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

        </>
    )
}

export function ConersationClientPage() {
    const [messages, setMessages] = useState<message[] | null>(null);

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
            setMessages([
                {message: "Hello, how are you?", from: "from_usr"},
                {message: "I'm doing well, thank you.", from: "to_usr"}
            ]);
        }
    }, []);

    return (
        <main className="container">
            <h1 className="text-center text-lg mt-2">Conversation feed</h1>

            {/* Preemptively load images so it dosen't need to load the image while the user is creating a message creating a bugged state where the image is still downloading so it has the wrong image for a few seconds */}
            {/* Very bad solution and im sorry for people that need accessability :( */}
            <Image src="/txt_bubble_corner_grey.png" alt="" width={36} height={12} className="fixed bottom-[-100px] opacity-0" />
            <Image src="/txt_bubble_corner_blue.png" alt="" width={36} height={12} className="fixed bottom-[-100px] opacity-0" />

            <div className="flex flex-col gap-2 mt-2">
                {messages && messages.map((message, index) => (
                    <RawTextBubble message={message.message} from={message.from} key={index}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={`absolute max-md:hidden ${message.from == "to_usr" ? "top-[-10px] right-[-9px]" : "top-[-10px] left-[-9px]"}`}>
                                <SettingsIcon className="w-[24px] h-[24px] stroke-black" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="px-2 py-2 max-w-[250px]">
                                <ConversationEditActions messages={messages} setMessages={setMessages} index={index} message={message} />
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Drawer>
                            <DrawerTrigger className={`absolute hidden max-md:block ${message.from == "to_usr" ? "top-[-10px] right-[-9px]" : "top-[-10px] left-[-9px]"}`}>
                                <SettingsIcon className="w-[24px] h-[24px] stroke-black" />
                            </DrawerTrigger>

                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>Message</DrawerTitle>
                                    <DrawerDescription>Message details</DrawerDescription>
                                </DrawerHeader>
                                
                                <div className="w-full flex flex-row *:mr-2 justify-center items-center mb-5">
                                    <ConversationEditActions messages={messages} setMessages={setMessages} index={index} message={message} is_for_mobile={true} />
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </RawTextBubble>
                ))}
            </div>

            <footer className="fixed bottom-2 mb-3 container w-[calc(100%-4rem)] flex flex-row justify-center items-center border-t py-2">
                <div className="flex flex-col">
                    <h1>Conversation Generator</h1>
                    <p className="text-sm">Generate a conversation</p>
                </div>

                <div className="ml-auto flex-row flex justify-center items-center max-md:flex-col">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant={"outline"} className="max-md:block hidden">
                                <MoreHorizontalIcon className="w-[24px] h-[24px] stroke-black" />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Actions</DrawerTitle>
                                <DrawerDescription>This menu shows most actions you may need to use</DrawerDescription>
                            </DrawerHeader>

                            <div className="flex flex-col container w-full *:mb-2 justify-center items-center mb-5">
                                <ConversationCreationActions messages={messages} setMessages={setMessages} is_for_mobile={true} />
                            </div>
                       </DrawerContent>
                    </Drawer>

                    <ConversationCreationActions messages={messages} setMessages={setMessages} />
                </div>
            </footer>
        </main>
    )
}
