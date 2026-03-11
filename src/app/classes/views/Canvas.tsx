import React, { useEffect, useRef, useState } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FiMinimize } from 'react-icons/fi';
import { WorldNode } from '@/app/classes/models/WorldNode';
import { observer } from 'mobx-react-lite';
import CanvasObject from '@/app/classes/views/CanvasObject';
import SelectableWorldNode from '../viewmodels/SelectableWorldNode';
import { appContext } from '@/app/context';

export const meterToHtmlScale = 100;

interface CanvasProps {
  onSelectionChanged: (node: SelectableWorldNode) => void;
  nodesList: SelectableWorldNode[];
}

const Canvas: React.FC<CanvasProps> = observer(({ nodesList, onSelectionChanged }) => {
  const [contextLocation, setContextLocation] = useState({ x: 0, y: 0, snapX: 0, snapY: 0, snapSize: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const [gridSize, setGridSize] = useState(100);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 4) {
      setOffset((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }

    const relativeX = ((e.clientX - e.currentTarget.getBoundingClientRect().left - offset.x) / scale) / meterToHtmlScale;
    const relativeY = ((e.clientY - e.currentTarget.getBoundingClientRect().top - offset.y) / scale) / meterToHtmlScale;

    setMousePosition({ x: relativeX, y: relativeY});
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    const zoomIntensity = 0.1;
    const rect = e.currentTarget.getBoundingClientRect();

    // Mouse position relative to the canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setScale((prevScale) => {
      const zoomDirection = e.deltaY > 0 ? -1 : 1;
      const newScale = prevScale + prevScale * zoomIntensity * zoomDirection;

      // Calculate world position of cursor before zoom.
      const worldX = (mouseX - offset.x) / prevScale;
      const worldY = (mouseY - offset.y) / prevScale;

      // Compute new offset so that the world point under cursor stays fixed.
      const newOffsetX = mouseX - worldX * newScale;
      const newOffsetY = mouseY - worldY * newScale;

      // Update offset alongside scale.
      setOffset({ x: newOffsetX, y: newOffsetY });

      return newScale;
    });
  };

  const saveContextLocation = (e: React.MouseEvent) => {
    const snapSize = gridSize / meterToHtmlScale / scale;
    const snapXPosition = snapSize * Math.floor(mousePosition.x / snapSize);
    const snapYPosition = snapSize * Math.floor(mousePosition.y / snapSize);

    const currentContextLocation = {
      x: mousePosition.x,
      y: mousePosition.y,
      snapX: snapXPosition,
      snapY: snapYPosition,
      snapSize: snapSize
    };

    setContextLocation(currentContextLocation);
    console.log("Context location saved:", currentContextLocation);
  }

  function addObject() {
    const newNode = new WorldNode("New Object", "An object", "A newly created object.");
    newNode.coordinates.x = contextLocation.snapX;
    newNode.coordinates.y = contextLocation.snapY;
    newNode.dimensions.width = contextLocation.snapSize;
    newNode.dimensions.depth = contextLocation.snapSize;

    appContext.currentStory?.addNode(newNode);
  }

  function calculateCanvasSize() {
    const left = Math.min(...nodesList.map(node => node.node.coordinates.x)) * meterToHtmlScale;
    const top = Math.min(...nodesList.map(node => node.node.coordinates.y)) * meterToHtmlScale;
    const right = Math.max(...nodesList.map(node => node.node.coordinates.x + node.node.dimensions.width)) * meterToHtmlScale;
    const bottom = Math.max(...nodesList.map(node => node.node.coordinates.y + node.node.dimensions.depth)) * meterToHtmlScale;

    setCanvasSize({
      left: left,
      top: top,
      width: right - left,
      height: bottom - top
    });
  }
  
  useEffect(() => {
    const nearest2Exponent = Math.round(Math.log2(1 / scale));
    const gridUnit = Math.pow(2, nearest2Exponent);

    setGridSize(meterToHtmlScale * scale * gridUnit);
  }, [scale]);

  useEffect(() => {
    calculateCanvasSize();
  }, [appContext.currentStory.nodesList]);

  return (
    <div
      className="w-full h-full overflow-hidden relative bg-foreground/10 rounded-md"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onContextMenu={saveContextLocation}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${gridSize}px ${gridSize}px`,
              backgroundPosition: `${offset.x % gridSize}px ${offset.y % gridSize}px`,
            }}
          />

          {/* Canvas content */}
          <div
            className="w-full h-full relative"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: "top left"
            }}
          >
            <div
              className="absolute"
              style={{
                left: canvasSize.left,
                top: canvasSize.top,
                width: canvasSize.width,
                height: canvasSize.height,
              }}
            >
              {nodesList.map((node) => (
                <CanvasObject
                  key={node.node.id}
                  viewModel={node}
                  onSelectionChanged={onSelectionChanged}
                />
              ))}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onSelect={addObject}>Add object</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* UI overlays */}
      <div className="absolute top-0 left-0 p-2">
        <Button
          onClick={() => {
            setScale(1);
            setOffset({ x: 0, y: 0 });
          }}
        >
          <FiMinimize /> Reset
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 p-2 bg-[#00000080] rounded-tr-lg">
        <Label>
          Position: {mousePosition.x.toFixed(2)}x {mousePosition.y.toFixed(2)}y
        </Label>
        <Label>Scale: {scale.toFixed(2)}x</Label>
      </div>

      <div
        className="absolute bottom-0 left-1/2 border-t-2 border-t-foreground flex justify-center p-2"
        style={{
          width: gridSize,
          transform: "translateX(-50%)",
        }}
      >
        <Label>{(gridSize / meterToHtmlScale / scale).toFixed(2)}m</Label>
      </div>

    </div>

  );
});

export default Canvas;
