"use client";

import { Separator } from "@/components/ui/separator";
import Canvas from "@/app/classes/views/Canvas";
import { ObjectSettings } from "@/app/classes/views/ObjectSettings";
import { useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Coordinates } from "@/app/classes/models/world/base/Coordinates";
import { Story } from "../models/world/base/Story";
import { observer } from "mobx-react-lite";
import WorldNodeViewModel from "../viewmodels/WorldNodeViewModel";

interface StoryEditorProps {
  storyNode: WorldNodeViewModel;
}

export const StoryEditor: React.FC<StoryEditorProps> = observer(({ storyNode }) => {
  const [selectedNode, setSelectedNode] = useState(storyNode);

  function onSelectionChanged(node: WorldNodeViewModel) {
    if (selectedNode != null)
      selectedNode.isSelected = false;

    if (node != null)
      node.isSelected = true;

    setSelectedNode(node);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={100}>
        <div className="p-4 h-full">
          <Canvas rootNode={storyNode} onSelectionChanged={onSelectionChanged} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <div className="p-4 h-full">
          <ObjectSettings viewModel={selectedNode} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
});
  