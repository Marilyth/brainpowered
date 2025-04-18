import React, { useRef, useState } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { WorldNode } from '@/app/classes/models/world/base/WorldNode';
import { observer } from 'mobx-react-lite';
import { meterToHtmlScale } from './Canvas';
import WorldNodeViewModel from '../viewmodels/WorldNodeViewModel';
  
interface CanvasObjectProps {
  viewModel: WorldNodeViewModel;
  onSelectionChanged: (node: WorldNodeViewModel) => void;
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
            <div onClick={onClicked} className="w-full h-full backdrop-blur-[16px] bg-[#333333b0]" style={{ borderColor: viewModel.isSelected ? '#888822f0' : '#000000', borderWidth: viewModel.dimensions.width * meterToHtmlScale / 50 }}>
                <div className="text-center p-2" style={{ color: viewModel.color, fontSize: viewModel.dimensions.width * meterToHtmlScale / 10 }}>
                  {viewModel.name}
                </div>

                {viewModel.children.map((node, index) => (
                    <div key={index} className="absolute"
                        style={{ left: node.coordinates.x * meterToHtmlScale,
                                  top: node.coordinates.y * meterToHtmlScale,
                                  width: node.dimensions.width * meterToHtmlScale,
                                  height: node.dimensions.depth * meterToHtmlScale,
                                  transition: '0.1s'
                                   }}>
                      <CanvasObject key={index} viewModel={node} onSelectionChanged={onSelectionChanged} />
                    </div>
                  ))}
            </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onClick={(e) => e.stopPropagation()} onSelect={onNewChildObject}>Add child object to {viewModel.name}</ContextMenuItem>
            <ContextMenuItem>Add child location to {viewModel.name}</ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  );
});

export default CanvasObject;
