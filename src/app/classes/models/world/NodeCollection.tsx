import { WorldNode } from "./base/WorldNode";

export class MonacoLibrary{
  public code: string;
  public fileName: string;
  
  constructor() {
    this.fileName = `ts:filename/global.d.ts`;
    this.loadFromObject();

    console.log(this.code);
  }

  public loadFromObject() {
    this.code = `declare const global: {\n`;

    for (const key in rawNodes) {
      const node = nodes[key];

      this.code += ` ${key}: {${this.createObjectDeclaration(node)}};\n`;
      console.log(node);
    }

    this.code + `};`;
  }

  public createObjectDeclaration(obj: any): string {
    if (obj == null)
      return "any";

    let declaration = ``;

    for (const key in obj) {
      let keyType = typeof obj[key];
      
      // If the type is primitive, use it directly.
      if (keyType === "string" || keyType === "number" || keyType === "boolean") {
        declaration += `  ${key}: ${keyType};\n`;
        continue;
      }

      // If the type is an object, we need to create a more complex declaration.
      // declaration += `  ${key}: {${this.createObjectDeclaration(obj[key])}};\n`;
    }

    return declaration;
  }
}

const rawNodes: {[key: string | symbol]: WorldNode } = {};

export const nodes = new Proxy(rawNodes, {
  get: (_, key) => {
    console.log(key);
    console.log(rawNodes[key]);
    return rawNodes[key]?.getFlattenedObject()
  },
  set: (_, key, value) => {
    rawNodes[key] = value;
    return true;
  },
});
