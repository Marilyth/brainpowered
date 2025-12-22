import { Story } from "./base/Story";
import { WorldNode } from "./base/WorldNode";

const rawNodes: {[key: string | symbol]: WorldNode } = {};

export const nodes = new Proxy(rawNodes, {
  get: (_, key) => {
    let worldNode = rawNodes[key];

    if (worldNode?.getFlattenedObject === undefined)
      return worldNode;

    return worldNode?.getFlattenedObject()
  },
  set: (_, key, value) => {
    rawNodes[key] = value;
    return true;
  },
});
