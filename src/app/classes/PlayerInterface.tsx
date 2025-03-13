"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend } from 'react-icons/fi';
import React from "react";
import { Typewriter } from "./Typewriter";
import Story from "./world/base/Story";
import { Demo } from "./world/stories/Demo";
import TypeWriterViewModel from "./TypeWriterViewModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PlayerInterface() {
    const [actionText, setActionText] = useState("");

    const playerInput = useRef<HTMLInputElement>(null);
    const initialized = useRef(false);
    const story = useRef<Story>(new Demo());
    const typeWriterViewModel = useRef(new TypeWriterViewModel({ 
      opacityAnimationDuration: 0.3, typeSpeed: 50, pitch: 0, gain: 1,
      characterStyle: { fontSize: "20px", color: "#FFFFFF" },
      characterInitial: { },
      characterAnimate: { },
      characterTransition: { } }));
  
    async function ProcessInputAsync(){
      const currentAction = actionText;
      setActionText("");
  
      if(currentAction == "start"){
        typeWriterViewModel.current.setAudioContext();
        console.log("Starting the story...");
        typeWriterViewModel.current.story = story.current;
        await story.current.checkNode(typeWriterViewModel.current);
        await story.current.player.location.checkNode(typeWriterViewModel.current);
        await story.current.player.location.moveTowards(typeWriterViewModel.current);
    
        const text = await fetch("/parserShowcase.txt").then((response) => response.text());
        await typeWriterViewModel.current.startParsingAsync("\n\n");
        await typeWriterViewModel.current.startParsingAsync(text);
      }
  
      playerInput.current!.focus();
    }

    useEffect(() => {
      if (initialized.current) return;

      initialized.current = true;
      typeWriterViewModel.current.startParsingAsync("Enter [color;orange;start] to start the story.");
      playerInput.current!.focus();
    }, [typeWriterViewModel]);
  
    return (
      <div className="grid grid-rows-[1fr_auto] gap-4 p-8 h-full w-full">
        <Card className="bg-[#ffffff10]">
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle className="pb-2">Demo story</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="h-0 flex-grow overflow-auto">
              <Typewriter viewModel={typeWriterViewModel.current} />
          </CardContent>
        </Card>
  
        <div className="relative">
          <Input
            className="pr-12"
            ref={playerInput}
            type="text"
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
            placeholder="What do you do?"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ProcessInputAsync();
              }
            }}
          />
          <Button onClick={ProcessInputAsync} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 bg-transparent text-gray-500 hover:bg-transparent">
            <FiSend/>
          </Button>
    </div>
        
      </div>
    );
  }
  