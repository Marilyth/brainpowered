"use client";

import StringParser from "./components/StringParser";
import { useRef } from "react";
import Story from "./classes/world/base/Story";
import { Demo } from "./classes/world/stories/Demo";

export default function Home() {
  const parser = useRef<StringParser>(null);
  const story: Story = new Demo();

  async function EntryPointAsync(){
    parser.current!.story = story;
    await story.checkNode(parser.current!);
    await story.player.location.checkNode(parser.current!);
    await story.player.location.moveTowards(parser.current!);

    const text = await fetch("/parserShowcase.txt").then((response) => response.text());
    await parser.current?.startParsingAsync("\n\n");
    await parser.current?.startParsingAsync(text);
  }

  // async function testAudio() {
  //   story.player.modifyCoordinates((c) => {c.setFacingDirection(new Coordinates(0, 0, 1));});
  //   // Sea is 100 meters below the user, 23 meters in front. It can be heard from 200 meters away.
  //   const seaSound = new SpatialSound("sounds/sea.mp3", "", "", 1, 0, 0, new Coordinates(0, -100, 23), 200, story.player.getCoordinates());
  //   seaSound.play();

  //   // Bird is 10 meters above the user, 5 meters to the right. It can be heard from 50 meters away.
  //   const birdSound = new SpatialSound("sounds/chirping.mp3", "", "", 1, 1000, 0, new Coordinates(5, 10, 0), 50, story.player.getCoordinates());
  //   birdSound.play();

  //   // The player turns 180 degrees.
  //   for(let i = 0; i < 180; i++) {
  //     await Delay(20);
  //     const x = Math.sin(i * Math.PI / 180);
  //     const z = Math.cos(i * Math.PI / 180);
  //     story.player.modifyCoordinates((c) => {c.setFacingDirection(new Coordinates(x, 0, z));});
  //   }

  //   // The player moves 40 meters forward.
  //   for(let i = 0; i < 40; i++) {
  //     await Delay(100);
  //     story.player.modifyCoordinates((c) => {c.z -= 1;});
  //   }
    
  //   await Delay(1000);
  //   // The player moves 40 meters forward.
  //   for(let i = 0; i < 40; i++) {
  //     await Delay(100);
  //     story.player.modifyCoordinates((c) => {c.z -= 1;});
  //   }
  // }

  return (
    <div>
      <button onClick={EntryPointAsync}>Start</button>
      <StringParser ref={parser} typeWriterProps={{ blockStyle: {fontSize: "24px", color: "#FFFFFF"}, characterStyle: {}, characterAnimate: {}, characterInitial: {}, characterTransition: {}, pitch: 0, gain: 1, opacityAnimationDuration: 200, typeSpeed: 50, text: "" }} />
    </div>
  );
}
