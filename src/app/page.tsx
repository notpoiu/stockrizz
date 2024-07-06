import { Button } from "@/components/ui/button";
import { UploadComponent } from "@/components/upload-component";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center w-screen h-screen">
      <div className="flex flex-row">
        <h1 className="text-3xl">Stockrizz</h1>
        <Link href="/about">
          <Button variant={"outline"} className="ml-2">
            <InfoIcon />
          </Button>
        </Link>
      </div>
      <p className="mb-5">The best rizz engine</p>
      

      <div className="flex flex-row">
        
        <UploadComponent />
      </div>
    </main>
  );
}
