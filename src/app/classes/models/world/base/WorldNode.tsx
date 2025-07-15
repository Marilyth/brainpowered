import { Action } from "@/app/classes/models/world/Action";
import { Coordinates } from "@/app/classes/models/world/base/Coordinates";
import { Sound } from "@/app/classes/models/world/base/Sound";
import { Dimensions } from "@/app/classes/models/world/base/Dimensions";
import { Property } from "@/app/classes/models/world/base/Property";
import { currentTypeWriter } from "@/app/classes/viewmodels/TypeWriterViewModel";
import { StoryEvent } from "./StoryEvent";
import { nodes } from "../NodeCollection";
import { RegisterClass } from "@/app/classes/utility/JsonHelper";

@RegisterClass
export class WorldNode {
    [key: string]: any;

    private _id: string;
    private _name: string;

    /**
     * Initializes a new instance of the Node class.
     * @param name The name of the node.
     * @param context The context of the node. I.e. how it is shortly described when checking the parent.
     * @param description The description of the node. I.e. how it is described when checking the node itself.
     */
    constructor(name: string, context: string, description: string) {
        this.name = name;
        this.context = context;
        this.description = description;
        this.addCheckAction();
    }

    public context: string;
    public description: string;
    public color: string = "#AAFFFF";
    public image: string = "";

    public properties: Property[] = [];
    public events: StoryEvent[] = [];
    public children: WorldNode[] = [];
    public parent: WorldNode | null = null;
    public actions: Action[] = [];
    public sounds: Sound[] = [];
    public coordinates: Coordinates = new Coordinates(0, 0, 0);
    public dimensions: Dimensions = new Dimensions(1, 1, 1);
    
    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        if (this._name === value) return;

        this._name = value;
        this._id = this.generateId();
    }

    /**
     * All reachable nodes from this node in hierarchical order.
     */
    public traverseNodeTree(): WorldNode[] {
        const nodes: WorldNode[] = [this];

        for (const link of this.children) {
            for (const child of link.traverseNodeTree()) {
                nodes.push(child);
            }
        }

        return nodes;
    }

    public addChild(node: WorldNode) {
        if (node.parent === this || node === this) return;

        node.parent?.removeChild(node);
        this.children.push(node);
        node.parent = this;
    }

    public removeChild(node: WorldNode) {
        if (node.parent !== this) return;

        this.children = this.children.filter((child) => child !== node);
        node.parent = null;
    }

    /**
     * Adds the generic check action to the node.
     * This will type out the description of the node and the context of its children.
     */
    private addCheckAction() {
        const checkSynonyms: string[] = ["Inspect", "Assess", "Analyze", "Probe", "Scan", "Investigate", "Survey", "Examine", "Check", "Explore", "Look"];
        this.actions.push(new Action(checkSynonyms, "${[this.description, ...this.children.map((c) => c.context)].join(\" \")}", this));
    }

    /**
     * Flattens the worldnode and all its attributes into a single object.
     * @returns A flattened object containing all properties of the node and its attributes directly accessible.
     */
    public getFlattenedObject(): { [key: string]: any }  {
        const flattenedObject: { [key: string]: any } = { };

        for (const key in this) {
            // Might need to fetch children and parent from nodes.
            Object.defineProperty(flattenedObject, key, {
                get: () => this[key],
                set: (value: any) => {
                    this[key] = value;
                },
                enumerable: true,
                configurable: true
            });
        }

        // Add real properties manually because JS is dumb af and doesn't know they exist.
        for (const key of ["id", "name"]) {
            Object.defineProperty(flattenedObject, key, {
                get: () => this[key],
                set: (value: any) => {
                    this[key] = value;
                },
                enumerable: true,
                configurable: true
            });
        }
        
        // Add properties as named properties for ease of access.
        for (const property of this.properties || []) {
            Object.defineProperty(flattenedObject, property.name, {
                get: () => property.value,
                set: (value) => {
                    property.value = value;
                },
                enumerable: true,
                configurable: true
            });
        }

        return flattenedObject;
    }

    /**
     * A string crawling through the properties of the node using JavaScript's eval function.
     * @param expression The expression to evaluate. This can be a string containing variables and their values.
     */
    public evaluateVariableExpression(expression: string): string {
        const context: { [key: string]: any } = { global: nodes };

        try {
            const func = new Function(...Object.keys(context), `return ${expression};`);
            const result = func.apply(this.getFlattenedObject(), Object.values(context));

            if (result !== undefined)
                return result.toString();

            return "";
        } catch (e) {
            console.error("Expression evaluation error:", e);
            return "";
        }
    }

    public async writeAsync(text: string): Promise<void> {
        await currentTypeWriter.queueTextAsync(text, this);
    }

    /**
     * Generates a unique id for the node.
     * @returns A unique id for the node. This is generated by normalizing the name and appending an iterative number if the id already exists.
     */
    public generateId(): string {
        if (this._id)
            return this._id;

        const genName: string = this.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        let genNumber: number = 0;
        let genId = genName;

        while (genId in nodes) {
            genId = `${genName}_${++genNumber}`;
        }

        return genId;
    }

    /**
     * Checks if the node is inside another node.
     * @param other The other node to check against.
     * @returns True if the node is inside the other node, false otherwise.
     */
    public isInside(other: WorldNode): boolean {
        return (
            this.coordinates.x >= other.coordinates.x &&
            this.coordinates.y >= other.coordinates.y &&
            this.coordinates.z >= other.coordinates.z &&
            this.coordinates.x + this.dimensions.width <= other.coordinates.x + other.dimensions.width &&
            this.coordinates.y + this.dimensions.depth <= other.coordinates.y + other.dimensions.depth &&
            this.coordinates.z + this.dimensions.height <= other.coordinates.z + other.dimensions.height
          );
    }

    /**
     * Registers the node in the global nodes collection.
     * This should be called when the node is created or modified.
     */
    public registerNode() {
        this._id = this.generateId();
        nodes[this._id] = this;
        console.log(`Registered node: ${this.name} with id: ${this._id}`);
    }
}