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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 4) {
      setOffset((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }

    const referenceRect = e.currentTarget.getBoundingClientRect();

    const relativeX = ((e.clientX - e.currentTarget.getBoundingClientRect().left - offset.x) / scale) / meterToHtmlScale;
    const relativeY = ((e.clientY - e.currentTarget.getBoundingClientRect().top - offset.y) / scale) / meterToHtmlScale;

    setMousePosition({ x: relativeX, y: relativeY  });
  };

  const handleWheel = (e: React.WheelEvent) => {
    setScale((prev) => prev + (prev / 10) * (e.deltaY > 0 ? -1 : 1));
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
                      transform: `translate(${offset.x}px, ${offset.y}px)`,
                  }}
                  >
                    <div
                      className="w-full h-full relative"
                      style={{
                          transform: `scale(${scale})`,
                          transformOrigin: 'top left',
                          transition: '0.1s'
                      }}
                      >
                      <div className="absolute"
                          style={{ left: rootNode.coordinates.x * meterToHtmlScale,
                                    top: rootNode.coordinates.y * meterToHtmlScale,
                                    width: rootNode.dimensions.width * meterToHtmlScale,
                                    height: rootNode.dimensions.depth * meterToHtmlScale }}>
                        <CanvasObject viewModel={rootNode} onSelectionChanged={onSelectionChanged} />
                      </div>
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
          <Label>Position: {mousePosition.x.toFixed(2)}x {mousePosition.y.toFixed(2)}y</Label>
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
