"use client";

import StringParser from "./classes/StringParser";
import { useEffect, useRef } from "react";
import Typewriter from "./classes/Typewriter";
import Delay from "./classes/Await";

export default function Home() {
  const parser = useRef<StringParser>(null);

  async function EntryPointAsync(){
    await parser.current?.parseAsync("Hello world [color;red;asdf] [speed;500;Hello world]");
  }

  // Write "Hello world" in the type writer once loaded.
  useEffect(() => {
    EntryPointAsync();
  }, []);

  return (
      <StringParser ref={parser} typeWriterProps={{ characterAnimationDuration: 300, typeSpeed: 50, color: "white", size: "24px", text: "" }} />
  );
}
