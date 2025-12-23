"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend, FiDownload, FiUpload } from 'react-icons/fi';
import React from "react";
import { Typewriter } from "../classes/views/Typewriter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { loadStoryAsync, saveStory } from "@/lib/utils";
import { appContext } from "../context";
import { observer } from "mobx-react-lite";
import { EmptyStoryView } from "../classes/views/EmptyStoryView";

export const PlayInterface = observer(() => {
    const [actionText, setActionText] = useState("");
    const playerInput = useRef<HTMLInputElement>(null);
  
    async function ProcessInputAsync(){
      const currentAction = actionText;
      setActionText("");
  
      appContext.currentStory?.performActionAsync(currentAction);
      playerInput.current!.focus();
    }

    async function loadStory(){
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];

        if (file) {
          await loadStoryAsync(file);
        };
      };

      input.click();
    }
  
    return (
      <div className="h-full w-full max-w-183 mx-auto">
        {appContext.currentStory == null
        ? 
        <EmptyStoryView />
        : 
        <div className="grid grid-rows-[1fr_auto] gap-4 p-8 h-full w-full">
          <Card className="bg-[#ffffff10] h-full overflow-auto">
            <CardHeader>
              <CardTitle className="pb-2">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 items-center">
                  <div className="flex justify-center w-full text-yellow-500">{appContext.currentStory?.name}</div>
                  <Button variant="outline" onClick={loadStory}><FiUpload/></Button>
                  <Button variant="outline" onClick={saveStory}><FiDownload/></Button>
                </div>
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className="h-0 flex-grow overflow-auto"  >
              <Typewriter />
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
        }
      </div>
    );
  }
);
  