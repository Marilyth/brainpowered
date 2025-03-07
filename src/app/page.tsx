"use client";

import StringParser from "./classes/StringParser";
import { useRef } from "react";
import Story from "./classes/world/base/Story";
import { Demo } from "./classes/world/stories/Demo";

export default function Home() {
  const parser = useRef<StringParser>(null);
  const story: Story = new Demo();

  async function EntryPointAsync(){
    parser.current!.story = story;
    await story.checkNode(parser.current!);
    //await story.player.location.checkNode(parser.current!);
    //await story.player.location.moveTowards(parser.current!);

    const text = await fetch("/parserShowcase.txt").then((response) => response.text());
    await parser.current?.startParsingAsync("\n\n");
    await parser.current?.startParsingAsync(text);
  }

  return (
    <div>
      <button onClick={EntryPointAsync}>Start</button>
      <StringParser ref={parser} typeWriterProps={{ pitch: 0, gain: 1, opacityAnimationDuration: 200, ColorAnimationDuration: 1000, typeSpeed: 50, color: "#FFFFFF", size: "24px", text: "" }} />
    </div>
  );
}
