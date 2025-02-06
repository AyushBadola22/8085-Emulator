"use client";

import { useState } from "react";
import { executeCode } from "@/(emulator)/simulator-functions";

export default function Simulator() {
  const [input, setInput] = useState("");

  return (
    <div className="text-black flex flex-col items-center justify-center min-h-screen p-5 ">
      <h1 className="text-2xl font-bold mb-4">8085 Simulator</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-96 h-32"
        placeholder="Enter assembly code..."
      />
      <button
        onClick={() => {
          const result = executeCode(input);
          console.log(result); // Log the JSON response
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Execute
      </button>
    </div>
  );
}

/**
MVI A, 10 
MVI B, 20
ADD B
STA 2004
HLT
 */
