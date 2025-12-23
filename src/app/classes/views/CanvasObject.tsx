import React, { useRef, useState } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { observer } from 'mobx-react-lite';
import { meterToHtmlScale } from './Canvas';
import SelectableWorldNode from '../viewmodels/SelectableWorldNode';
  
interface CanvasObjectProps {
  viewModel: SelectableWorldNode;
  onSelectionChanged: (node: SelectableWorldNode) => void;
}

export const CanvasObject: React.FC<CanvasObjectProps> = observer(({ viewModel, onSelectionChanged }) => {
  function onNewChildObject() {
    viewModel.addChildObject();
    onSelectionChanged(viewModel.children[viewModel.children.length - 1]);
  }

  function onClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
    onSelectionChanged(viewModel);
  }

  return (
    <ContextMenu>
        <ContextMenuTrigger >
            <div
              onClick={onClicked}
              className="absolute border-3 border cursor-pointer"
              style={{
                borderColor: viewModel.node.color + "55",
                background: viewModel.node.color + "20",
                left: viewModel.node.coordinates.x * meterToHtmlScale,
                top: viewModel.node.coordinates.y * meterToHtmlScale,
                width: viewModel.node.dimensions.width * meterToHtmlScale,
                height: viewModel.node.dimensions.depth * meterToHtmlScale,
              }}
            >
              <div
                className="text-center overflow-hidden p-1 text-ellipsis"
                style={{
                  background: viewModel.node.color + "55",
                  color: viewModel.node.color,
                  fontSize:
                    (Math.min(
                      viewModel.node.dimensions.width,
                      viewModel.node.dimensions.depth
                    ) *
                      meterToHtmlScale) /
                    10,
                }}
              >
                {viewModel.node.name}
              </div>
            </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onClick={(e) => e.stopPropagation()} onSelect={onNewChildObject}>Add child object to {viewModel.node.name}</ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  );
});

export default CanvasObject;
