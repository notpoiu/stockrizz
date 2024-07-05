"use client";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { AnalyseImage } from "@/server/server";
import { useRouter } from "next/navigation";
import { RizzAnalysis } from "@/server/types";

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
                        className="flex flex-col px-2 py-2 items-center justify-center w-full h-full border-4 border-dashed border-gray-300 rounded-lg"
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
                            Drag and drop a png/jpeg image here or paste an image from clipboard
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
                    // turn file into base64
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = () => {
                        const base64 = reader.result as string;
                        toast.promise(AnalyseImage(base64), {
                            loading: "Analysing...",
                            success: (data: RizzAnalysis) => {
                                console.log(data);
                                localStorage.setItem("image", base64);
                                localStorage.setItem("analysis", JSON.stringify(data));

                                router.push("/analysis");
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