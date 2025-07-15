"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend, FiEdit, FiPlay, FiSave, FiDownload, FiUpload } from 'react-icons/fi';
import React from "react";
import { Typewriter } from "./Typewriter";
import { Story } from "../models/world/base/Story";
import { demo } from "../models/world/stories/Demo/Demo";
import TypeWriterViewModel, { currentTypeWriter } from "@/app/classes/viewmodels/TypeWriterViewModel";
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
import { deserialize, serialize } from "../utility/JsonHelper";

enum ViewState {
  Story,
  Editor,
}

export default function PlayerInterface() {
    const [actionText, setActionText] = useState("");
    const [viewState, setViewState] = useState<ViewState>(ViewState.Story);
    const [story, setStory] = useState<WorldNodeViewModel>(new WorldNodeViewModel(demo));
    const [typeWriterViewModel, setTypeWriter] = useState(new TypeWriterViewModel({
      opacityAnimationDuration: 0.3, typeSpeed: 50, pitch: 0, volumes: [],
      characterStyle: { fontSize: "20px", color: "#FFFFFF" },
      characterInitial: { },
      characterAnimate: { },
      characterTransition: { } }, story));

    const playerInput = useRef<HTMLInputElement>(null);
    const initialized = useRef(false);
  
    async function ProcessInputAsync(){
      const currentAction = actionText;
      setActionText("");
  
      story.model.player.performActionAsync(currentAction);
      playerInput.current!.focus();
    }

    function loadStory(){
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const jsonString = e.target?.result as string;
            const loadedStory: Story = deserialize(jsonString) as Story;
            const worldNodeviewModel = new WorldNodeViewModel(loadedStory);
            worldNodeviewModel.model.registerNode();

            const typeWriter = new TypeWriterViewModel({
              opacityAnimationDuration: 0.3, typeSpeed: 50, pitch: 0, volumes: [],
              characterStyle: { fontSize: "20px", color: "#FFFFFF" },
              characterInitial: { },
              characterAnimate: { },
              characterTransition: { } }, worldNodeviewModel);

            setStory(worldNodeviewModel);
            setTypeWriter(typeWriter);
            setCurrentTypeWriter(typeWriter);
            console.log(currentTypeWriter);
          };
          reader.readAsText(file);
        }
      };
      input.click();
    }

    function saveStory(){
      const storyJson = serialize(story.model);
      const blob = new Blob([storyJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${story.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    useEffect(() => {
      if (initialized.current) return;

      initialized.current = true;
      typeWriterViewModel.startParsingAsync("Enter [color;orange;start] to start the story.");
      setCurrentTypeWriter(typeWriterViewModel);
      
      playerInput.current!.focus();
    }, [typeWriterViewModel]);
  
    return (
      <div className="grid grid-rows-[1fr_auto] gap-4 p-8 h-full w-full">
        <Card className="bg-[#ffffff10] h-full overflow-auto">
          <CardHeader>
            <CardTitle className="pb-2">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 items-center">
                <div className="flex justify-center w-full text-yellow-500">{story.name}</div>
                <Button variant="outline" onClick={loadStory}><FiUpload/></Button>
                <Button variant="outline" onClick={saveStory}><FiDownload/></Button>
                <Button onClick={() => setViewState((viewState + 1) % 2)} variant="outline">
                  {viewState === ViewState.Story ? 
                    <FiEdit/> 
                  : 
                    <FiPlay/>
                  }

                </Button>
              </div>
            </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="h-0 flex-grow overflow-auto"  >
            {viewState === ViewState.Story && (
              <Typewriter viewModel={typeWriterViewModel} />
            )}
            {viewState === ViewState.Editor && (
              <StoryEditor storyNode={story} />
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
  