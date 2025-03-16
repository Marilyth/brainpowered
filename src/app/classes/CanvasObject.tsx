import React, { useRef, useState } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { WorldNode } from './world/base/WorldNode';
import { observer } from 'mobx-react-lite';
  
interface CanvasObjectProps {
  viewModel: WorldNode;
}

export const CanvasObject: React.FC<CanvasObjectProps> = observer(({ viewModel }) => {
  return (
    <ContextMenu>
        <ContextMenuTrigger >
        {viewModel.image ? (
            <img src={viewModel.image} alt="Preview" className="w-full h-full" />
            ) : (
            <div className="w-full h-full bg-[#ffffff10] border-4 border-black rounded-lg">
                <div className="text-center bg-[#00000080] p-2" style={{ color: viewModel.color}}>
                    {viewModel.name}
                </div>
            </div>
        )}
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem>Add child object to {viewModel.name}</ContextMenuItem>
            <ContextMenuItem>Add child location to {viewModel.name}</ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
  );
});

export default CanvasObject;
