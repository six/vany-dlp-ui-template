"use client";

import { VanaDlpIntegration } from "./contribution/VanaDlpIntegration";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white dark:bg-black py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">VANY DLP Template</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl flex justify-center">
          <VanaDlpIntegration />
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="container mx-auto px-4">
          <p>This app demonstrates VANA DLP integration with IPFS</p>
        </div>
      </footer>
    </div>
  );
}
