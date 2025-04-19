"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend, FiEdit, FiPlay } from 'react-icons/fi';
import React from "react";
import { Typewriter } from "./Typewriter";
import { Story } from "../models/world/base/Story";
import { demo } from "../models/world/stories/Demo/Demo";
import TypeWriterViewModel from "@/app/classes/viewmodels/TypeWriterViewModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StoryEditor } from "./StoryEditor";
import { setCurrentTypeWriter } from "@/app/classes/viewmodels/TypeWriterViewModel";
import WorldNodeViewModel from "../viewmodels/WorldNodeViewModel";

enum ViewState {
  Story,
  Editor,
}

export default function PlayerInterface() {
    const [actionText, setActionText] = useState("");
    const [viewState, setViewState] = useState<ViewState>(ViewState.Story);

    const playerInput = useRef<HTMLInputElement>(null);
    const initialized = useRef(false);
    const story = useRef<WorldNodeViewModel>(new WorldNodeViewModel(demo));
    const typeWriterViewModel = useRef(new TypeWriterViewModel({ 
      opacityAnimationDuration: 0.3, typeSpeed: 50, pitch: 0, volumes: [],
      characterStyle: { fontSize: "20px", color: "#FFFFFF" },
      characterInitial: { },
      characterAnimate: { },
      characterTransition: { } }));
  
    async function ProcessInputAsync(){
      const currentAction = actionText;
      setActionText("");
  
      demo.player.performActionAsync(currentAction);
  
      playerInput.current!.focus();
    }

    useEffect(() => {
      if (initialized.current) return;

      initialized.current = true;
      typeWriterViewModel.current.startParsingAsync("Enter [color;orange;start] to start the story.");
      setCurrentTypeWriter(typeWriterViewModel.current);
      typeWriterViewModel.current.story = demo;
      
      playerInput.current!.focus();
    }, [typeWriterViewModel]);
  
    return (
      <div className="grid grid-rows-[1fr_auto] gap-4 p-8 h-full w-full">
        <Card className="bg-[#ffffff10] h-full overflow-auto">
          <CardHeader>
            <CardTitle className="pb-2">
              <div className="grid grid-cols-[1fr_auto] items-center">
                <div className="flex justify-center w-full text-yellow-500">Demo story</div>
                <Button onClick={() => setViewState((viewState + 1) % 2)} variant="outline">
                  {viewState === ViewState.Story ? <FiEdit/> : <FiPlay/>}
                </Button>
              </div>
            </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="h-0 flex-grow overflow-auto"  >
            {viewState === ViewState.Story && (
              <Typewriter viewModel={typeWriterViewModel.current} />
            )}
            {viewState === ViewState.Editor && (
              <StoryEditor storyNode={new WorldNodeViewModel(demo)} />
            )}
          </CardContent>
        </Card>
        {viewState === ViewState.Story && (
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
        )}
        
      </div>
    );
  }
  