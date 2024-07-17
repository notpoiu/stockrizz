import { Button } from "@/components/ui/button";
import { UploadComponent } from "@/components/upload-component";
import { GithubIcon, InfoIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center w-screen h-screen container">
      <div className="flex flex-row relative">
        <h1 className="text-3xl">Stockrizz</h1>
        <Link href="/about" className="absolute top-0 right-[calc(-1.25rem-5px)]">
          <InfoIcon className="w-5 h-5" />
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

      <div className="fixed bottom-2 w-screen mb-3">
        <div className="flex justify-center items-center flex-row">

          <p className="text-xs text-muted-foreground">Made with ❤️ by notpoiu</p>
          <div className="flex flex-row justify-center items-center">
            <Link href={"https://github.com/notpoiu/stockrizz"} target="_blank">
              <Button variant={"outline"} className="px-3 py-2 ml-2">
                <GithubIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          
        </div>
      </div>
    </main>
  );
}
