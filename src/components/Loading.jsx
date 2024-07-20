import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-row h-screen justify-center items-center my-auto text-zinc-500 text-lg font-medium">
      <Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading
    </div>
  );
}
