import { Button } from "@/components/ui/button";
import { UploadComponent } from "@/components/upload-component";
import { GithubIcon, InfoIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center w-screen h-screen container">
      <div className="flex flex-row">
        <h1 className="text-3xl">Stockrizz</h1>
        <Link href="/about">
          <Button variant={"outline"} className="ml-2">
            <InfoIcon />
          </Button>
        </Link>
      </div>
      <p className="mb-5">The best rizz engine</p>
      

      <div className="flex flex-col justify-center items-center">
        <UploadComponent />
        <div className="flex flex-row justify-center items-center mt-3">
          Or create a conversation here:
          <Link href="/create/conversation" className="ml-2">
            <Button variant={"outline"}>Create Conversation</Button>
          </Link>
        </div>
      </div>

      <div className="fixed bottom-2 left-2">
        <Link href={"https://github.com/notpoiu/stockrizz"} target="_blank" className="flex flex-row justify-center items-center">
          <p className="text-xs text-blue-300">Site is open source in Github</p><GithubIcon className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </main>
  );
}
