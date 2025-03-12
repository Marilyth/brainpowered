"use client";

import { Typewriter } from "./classes/Typewriter";
import Story from "./classes/world/base/Story";
import { Demo } from "./classes/world/stories/Demo";
import TypeWriterViewModel from "./classes/TypeWriterViewModel";

export default function Home() {
  const typeWriterViewModel: TypeWriterViewModel = new TypeWriterViewModel({ 
    opacityAnimationDuration: 0.3, typeSpeed: 50, pitch: 0, gain: 1,
    characterStyle: { fontSize: "20px", color: "#FFFFFF" },
    characterInitial: { },
    characterAnimate: { },
    characterTransition: { } });
  const story: Story = new Demo();

  async function EntryPointAsync(){
    typeWriterViewModel.setAudioContext();
    typeWriterViewModel.story = story;
    await story.checkNode(typeWriterViewModel);
    await story.player.location.checkNode(typeWriterViewModel);
    await story.player.location.moveTowards(typeWriterViewModel);

    const text = await fetch("/parserShowcase.txt").then((response) => response.text());
    await typeWriterViewModel.startParsingAsync("\n\n");
    await typeWriterViewModel.startParsingAsync(text);
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
      <Typewriter viewModel={typeWriterViewModel} />
    </div>
  );
}
