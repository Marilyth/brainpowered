"use client";

import Canvas from "@/app/classes/views/Canvas";
import { ObjectSettings } from "@/app/classes/views/settings/ObjectSettings";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { observer } from "mobx-react-lite";
import SelectableWorldNode from "../viewmodels/SelectableWorldNode";
import { appContext } from "@/app/context";
import { makeAutoObservable, observable } from "mobx";

export const StoryEditor = observer(() => {
  const selectableNodes = observable.array(appContext.currentStory.nodesList.map(node => makeAutoObservable({node: node, isSelected: false}) as SelectableWorldNode));
  const [selectedNode, setSelectedNode] = useState<SelectableWorldNode | null>(null);

  function onSelectionChanged(node: SelectableWorldNode) {
    if (selectedNode != null)
      selectedNode.isSelected = false;

    if (node != null)
      node.isSelected = true;

    setSelectedNode(node);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={100}>
        <div className="p-4 h-full">
          <Canvas onSelectionChanged={onSelectionChanged} nodesList={selectableNodes} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <div className="flex flex-col h-full">
          <div className="flex whitespace-pre justify-center my-4">
            Editing <div className="text-yellow-500">{appContext.currentStory.name}</div>
          </div>
          {selectedNode != null && (
            <ObjectSettings viewModel={selectedNode} />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
});
  