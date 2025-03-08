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
      <StringParser ref={parser} typeWriterProps={{ blockStyle: {fontSize: "24px", color: "#FFFFFF"}, characterStyle: {}, characterAnimate: {}, characterInitial: {}, characterTransition: {}, pitch: 0, gain: 1, opacityAnimationDuration: 200, typeSpeed: 50, text: "" }} />
    </div>
  );
}
