"use client";

import StringParser from "./classes/StringParser";
import { useRef } from "react";

export default function Home() {
  const parser = useRef<StringParser>(null);

  async function EntryPointAsync(){
    let text = await fetch("/parserShowcase.txt").then((response) => response.text());
    await parser.current?.startParsingAsync("Parser Showcase\n\n[pause;1000]");
    await parser.current?.startParsingAsync(text);
  }

  return (
    <div>
      <button onClick={EntryPointAsync}>Start</button>
      <StringParser ref={parser} typeWriterProps={{ pitch: 0, gain: 1, characterAnimationDuration: 500, typeSpeed: 50, color: "white", size: "24px", text: "" }} />
    </div>
  );
}
