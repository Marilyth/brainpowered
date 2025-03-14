import React, { useRef, useState } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
  
const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    console.log(e);
    setScale((prev) => Math.max(0.1, prev + e.deltaY * -0.001));
  };

  return (
    <div className='w-full h-full overflow-auto' onWheel={handleWheel}>
        <ContextMenu>
            <ContextMenuTrigger >
                <canvas
                    ref={canvasRef}
                    className="bg-[#ffffff10] w-full h-full"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: 'center',
                    }}
                    onMouseMove={handleMouseMove}
                    />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Add object</ContextMenuItem>
                <ContextMenuItem>Add location</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    </div>
  );
};

export default Canvas;
