"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StoryEditor } from "./custom/StoryEditor";
import { appContext } from '../classes/context';
import { EmptyStoryView } from "./custom/EmptyStoryView";
import { observer } from "mobx-react-lite";

export const EditInterface = observer(() => {
    return (
      <div className="h-full w-full">
        {appContext.currentStory == null
        ? 
          <EmptyStoryView />
        : 
          <StoryEditor />
        }
      </div>
    );
  }
);
  