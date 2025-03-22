import React, { useRef, useState } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FiMinimize } from 'react-icons/fi';
import { WorldNode } from '@/app/classes/models/world/base/WorldNode';
import { observer } from 'mobx-react-lite';
import CanvasObject from '@/app/classes/views/CanvasObject';
import WorldNodeViewModel from '../viewmodels/WorldNodeViewModel';

export const meterToHtmlScale = 100;

interface CanvasProps {
  rootNode: WorldNodeViewModel;
  onSelectionChanged: (node: WorldNodeViewModel) => void;
}

const Canvas: React.FC<CanvasProps> = observer(({ rootNode, onSelectionChanged }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 4) {
      setOffset((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    setScale((prev) => Math.max(0.1, prev + (e.deltaY > 0 ? -0.1 : 0.1)));
  };

  return (
    <div className='w-full h-full overflow-hidden bg-[#ffffff10] relative rounded-lg'
      onWheel={handleWheel} 
      onMouseMove={handleMouseMove}>
        <ContextMenu>
            <ContextMenuTrigger >
                <div
                  className="w-full h-full relative"
                  style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                      transformOrigin: 'center',
                  }}
                  >
                  <div className="absolute"
                      style={{ left: rootNode.model.coordinates.x * meterToHtmlScale,
                                top: rootNode.model.coordinates.y * meterToHtmlScale,
                                width: rootNode.model.dimensions.width * meterToHtmlScale,
                                height: rootNode.model.dimensions.depth * meterToHtmlScale }}>
                    <CanvasObject viewModel={rootNode} onSelectionChanged={onSelectionChanged} />
                  </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Add object</ContextMenuItem>
                <ContextMenuItem>Add location</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
        
        <div className="absolute top-0 left-0 p-2">
          <Button onClick={() => {setScale(1); setOffset({x: 0, y: 0});}}><FiMinimize/>Reset</Button>
        </div>

        <div className="absolute bottom-0 left-0 p-2 bg-[#00000080] rounded-tr-lg">
          <Label>Position:</Label>
          <Label>Scale: {scale.toFixed(2)}x</Label>
        </div>

        <div className="absolute bottom-0 p-2 right-1/2 border-t-2 flex justify-center"
            style={{
              width: meterToHtmlScale
            }}>
          <Label>
            {(1 / scale).toFixed(2)}m
          </Label>
        </div>
    </div>
  );
});

export default Canvas;
