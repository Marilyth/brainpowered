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

export const CanvasObject = observer((props: CanvasObjectProps) => {
  function onClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
    props.onSelectionChanged(props.viewModel);
  }

  return (
      <div
        onClick={onClicked}
        className="absolute border-1 cursor-pointer"
        style={{
          background: props.viewModel.node.color,
          left: props.viewModel.node.coordinates.x * meterToHtmlScale,
          top: props.viewModel.node.coordinates.y * meterToHtmlScale,
          width: props.viewModel.node.dimensions.width * meterToHtmlScale,
          height: props.viewModel.node.dimensions.depth * meterToHtmlScale,
        }}
      >
        <div
          className="text-center overflow-hidden p-1 text-ellipsis"
          style={{
            fontSize:
              (Math.min(
                props.viewModel.node.dimensions.width,
                props.viewModel.node.dimensions.depth
              ) *
                meterToHtmlScale) /
              10,
          }}
        >
          {props.viewModel.node.name}
        </div>
      </div>
  );
});

export default CanvasObject;
