"use client";

import StringParser from "./classes/StringParser";
import { useRef } from "react";

export default function Home() {
  const parser = useRef<StringParser>(null);
  const sit = "https://cdn.freesound.org/previews/533/533060_11781670-lq.mp3";
  const step = "https://cdn.freesound.org/previews/477/477356_10191288-lq.mp3";
  const pageflip = "https://cdn.freesound.org/previews/457/457916_5137631-lq.mp3";
  const lightbulbExplode = "https://cdn.freesound.org/previews/558/558969_1474550-lq.mp3";
  const doorOpen = "https://cdn.freesound.org/previews/186/186742_522747-lq.mp3";
  const lightSwitch = "https://cdn.freesound.org/previews/217/217498_4034520-lq.mp3";

  async function EntryPointAsync(){
    await parser.current?.startParsingAsync(`You stand in front of a [color;#FFAAAA;door]. You [sound;${doorOpen};100;[color;orange;open] it]. You find yourself in an empty room with nothing but a [color;#FFAAAA;table] and a [color;#FFAAAA;chair] in the center. It is quite dark. You are searching for a [color;#FFAAAA;light switch]. [sound;${step};100;[color;orange;Step]], [sound;${step};100;[color;orange;step]], [sound;${step};100;[color;orange;step]]. [color;#AAAAFF;[voice;180;100;"There it is!"]] you exclaim. [sound;${lightSwitch};100;[color;orange;Click]]. [color;#AAAAFF;[voice;180;100;"Now that's better, time to-"]] [sound;${lightbulbExplode};100;[color;red;BOOM]] [color;#AAAAFF;[voice;240;50;"... What..?"]] you ask in disbelief. [sound;${lightSwitch};100;[color;orange;Click]][pause;500], [sound;${lightSwitch};100;[color;orange;click]], [sound;${lightSwitch};100;[color;orange;click]]... [color;#AAAAFF;[voice;180;80;"Oh Christ, fine. No lights."]] You [sound;${step};100;[color;orange;approach the [color;#FFAAAA;table]]][sound;${step};100;][sound;${step};100;][sound;${step};100], and [sound;${sit};100;[color;orange;sit down]]. There is a [color;#FFAAAA;book] resting on top of the dusty [color;#FFAAAA;table]. The title reads [color;#AAAAFF;[voice;180;100;[speed;100;"The MindGames"]]].[pause;1000] Curiously, you [sound;${pageflip};100;[color;orange;open] the [color;#FFAAAA;book]].`);
  }

  return (
    <div>
      <button onClick={EntryPointAsync}>Start</button>
      <StringParser ref={parser} typeWriterProps={{ pitch: 0, gain: 1, characterAnimationDuration: 500, typeSpeed: 50, color: "white", size: "24px", text: "" }} />
    </div>
  );
}
