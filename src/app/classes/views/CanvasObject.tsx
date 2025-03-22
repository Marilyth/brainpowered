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
  function onClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
    onSelectionChanged(viewModel);
  }

  return (
    <ContextMenu>
        <ContextMenuTrigger >
        {viewModel.model.image ? (
            <img onClick={onClicked} src={viewModel.model.image} alt="Preview" className="w-full h-full">
              {viewModel.children.map((node, index) => (
                <div key={index} className="absolute"
                    style={{ left: node.model.coordinates.x * meterToHtmlScale,
                              top: node.model.coordinates.y * meterToHtmlScale,
                              width: node.model.dimensions.width * meterToHtmlScale,
                              height: node.model.dimensions.depth * meterToHtmlScale }}>
                  <CanvasObject key={index} viewModel={node} onSelectionChanged={onSelectionChanged} />
                </div>
              ))}
            </img>
            ) : (
            <div onClick={onClicked} className="w-full h-full bg-[#333333f0] border-4 border-black rounded-lg">
                <div className="text-center bg-[#111111f0] p-2" style={{ color: viewModel.model.color, fontSize: viewModel.model.dimensions.height * meterToHtmlScale / 10 }}>
                  {viewModel.model.name}
                </div>

                {viewModel.children.map((node, index) => (
                    <div key={index} className="absolute"
                        style={{ left: node.model.coordinates.x * meterToHtmlScale,
                                  top: node.model.coordinates.y * meterToHtmlScale,
                                  width: node.model.dimensions.width * meterToHtmlScale,
                                  height: node.model.dimensions.depth * meterToHtmlScale }}>
                      <CanvasObject key={index} viewModel={node} onSelectionChanged={onSelectionChanged} />
                    </div>
                  ))}
            </div>
        )}
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onSelect={() => viewModel.addChildObject()}>Add child object to {viewModel.model.name}</ContextMenuItem>
            <ContextMenuItem>Add child location to {viewModel.model.name}</ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  );
});

export default CanvasObject;
