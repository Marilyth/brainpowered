import { WorldNode } from "../models/WorldNode";

export default interface SelectableWorldNode {
    node: WorldNode;
    isSelected: boolean;
}