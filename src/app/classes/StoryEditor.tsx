"use client";

import { Separator } from "@/components/ui/separator";
import Canvas from "./Canvas";
import { ObjectSettings } from "./ObjectSettings";
import { useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Object from "./world/base/Object";
import { Coordinates } from "./world/base/Coordinates";

export default function StoryEditor() {
  const testNode = new Object("Table", "", "A wooden table", new Coordinates(0, 0, 0));

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={100}>
        <div className="p-4 h-full">
          <Canvas />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <div className="p-4 h-full">
          <ObjectSettings viewModel={testNode} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
  