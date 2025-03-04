"use client";

import TypeWriter from "./classes/Typewriter";
import { useEffect, useRef } from "react";

export default function Home() {
  const tw = useRef<TypeWriter>(null);
  const tw2 = useRef<TypeWriter>(null);

  async function EntryPointAsync(){
    await tw.current?.typeAsync("You open the letter and read: ");
    await tw2.current?.typeAsync("\"You shouldn't have done this...\"");
  }

  // Write "Hello world" in the type writer once loaded.
  useEffect(() => {
    EntryPointAsync();
  }, []);

  return (
    <div className="m-8">
      <TypeWriter ref={tw} typeSpeed={50} color="#AAAAAA" size="24px" characterAnimationDuration={100} />
      <TypeWriter ref={tw2} typeSpeed={100} color="#8888FF" size="24px" characterAnimationDuration={300} />
    </div>
  );
}
