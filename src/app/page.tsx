import { UploadComponent } from "@/components/upload-component";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center w-screen h-screen">
      <h1 className="text-3xl">Stockrizz</h1>
      <p className="mb-5">The best rizz engine</p>

      <div className="flex flex-row">
        <UploadComponent />
      </div>
    </main>
  );
}
