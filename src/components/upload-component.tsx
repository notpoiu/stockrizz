"use client";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { AnalyseImage } from "@/server/server";
import { useRouter } from "next/navigation";

export function UploadComponent() {
    const router = useRouter();

    const [file, setFile] = React.useState<File | null>(null);
    const [fileEnter, setFileEnter] = React.useState(false);

    useEffect(() => {
        document.addEventListener("paste", (e) => {
            if (e.clipboardData?.files[0]) {
                setFile(e.clipboardData.files[0]);
            }
        });
    }, []);

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                {!file ? (
                    <div
                        className="flex flex-col px-20 py-2 items-center justify-center w-full h-full border-4 border-dashed border-gray-300 rounded-lg"
                        onDrop={(e) => {
                            e.preventDefault();
                            setFileEnter(false);

                            const file = e.dataTransfer.items[0];

                            if (file.type !== "image/png" && file.type !== "image/jpeg") {
                                toast.error("Invalid file type, only PNG and JPEG are allowed");
                            }
                            setFile(e.dataTransfer.files[0]);
                        }}
                        onDragEnter={(e) => {
                            e.preventDefault();
                            setFileEnter(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setFileEnter(false);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <p className="text-md text-gray-500 flex flex-col justify-center items-center text-center">
                            {fileEnter ? "Drop image of a conversation here" : "Drag and drop the image of the conversation here"}
                            <Button
                                className="mt-4"
                                onClick={() => {
                                    const input = document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*";
                                    input.onchange = (e) => {
                                        const selectedFile = (e.target as HTMLInputElement).files?.item(0);
                                        
                                        if (selectedFile) {
                                            setFile(selectedFile as File);
                                            input.remove();
                                        }
                                    };
                                    input.click();
                                }}
                                >
                                    Browse file
                                </Button>
                        </p>
                    </div>
                
                ) : (
                    <div>
                        <div className="flex flex-col px-2 py-2 items-center justify-center w-full h-full border-4 border-dashed border-gray-300 rounded-lg">
                        <img
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover rounded-lg"
                            alt="Uploaded file"
                        />
                        <Button
                            className="mt-4"
                            onClick={() => {
                                setFile(null);
                            }}
                        >
                            Remove
                        </Button>
                        </div>
                    </div>
                
                )}
            </div>
            
            {
                file && (<Button onClick={async () => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = () => {
                        const base64 = reader.result as string;
                        toast.promise(AnalyseImage(base64), {
                            loading: "Analysing...",
                            success: (slug: string) => {
                                router.push(`/conversation/analysis/${slug}`);

                                return "Image analysed successfully!";
                            },
                            error: "Failed to analyse image"
                        })
                    }
                }} className="mt-5">
                    Analyse
                </Button>)
            }
        </div>
    )
}