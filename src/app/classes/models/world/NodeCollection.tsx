import { WorldNode } from "./base/WorldNode";

const rawNodes: {[key: string | symbol]: WorldNode } = {};

export const nodes = new Proxy(rawNodes, {
  get: (_, key) => rawNodes[key].getFlattenedObject(),
  set: (_, key, value) => {
    rawNodes[key] = value;
    return true;
  },
});