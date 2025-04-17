import { Action } from "@/app/classes/models/world/Action";
import { Coordinates } from "@/app/classes/models/world/base/Coordinates";
import { Sound } from "@/app/classes/models/world/base/Sound";
import { Dimensions } from "@/app/classes/models/world/base/Dimensions";
import { Attribute } from "@/app/classes/models/world/base/Attribute";
import { currentTypeWriter } from "@/app/classes/viewmodels/TypeWriterViewModel";
import { StoryEvent } from "./StoryEvent";


export abstract class WorldNode {
    public name: string;
    public context: string;
    public description: string;
    public color: string = "#FFFFFF";
    public image: string = "";

    public attributes: Attribute[] = [];
    public events: StoryEvent[] = [];
    public children: WorldNode[] = [];
    public actions: Action[] = [];
    public sounds: Sound[] = [];
    public parent: WorldNode | null = null;
    public coordinates: Coordinates = new Coordinates(0, 0, 0);
    public dimensions: Dimensions = new Dimensions(1, 1, 1);

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
        this.children.push(node);
        node.parent = this;
    }

    public removeChild(node: WorldNode) {
        this.children = this.children.filter((child) => child !== node);
        node.parent = null;
    }

    /**
     * Adds the generic check action to the node.
     * This will type out the description of the node and the context of its children.
     */
    private addCheckAction() {
        const checkSynonyms: string[] = ["Inspect", "Assess", "Analyze", "Probe", "Scan", "Investigate", "Survey", "Examine", "Check", "Explore", "Look"];
        this.actions.push(new Action(checkSynonyms, "${[description, ...children.map((c) => c.context)].join(\" \")}", this));
    }

    public addAction(action: Action) {
        this.actions.push(action);
    }

    public removeAction(action: Action) {
        this.actions = this.actions.filter((a) => a !== action);
    }

    /**
     * A string crawling through the properties of the node using JavaScript's eval function.
     * @param expression The expression to evaluate. This can be a string containing variables and their values.
     */
    public evaluateVariableExpression(expression: string): string {
        const context: { [key: string]: any } = {};

        for (const key in this) {
            context[key] = this[key];
        }

        for (const attribute of this.attributes || []) {
            context[attribute.name] = attribute.value;
        }

        try {
            const func = new Function(...Object.keys(context), `return ${expression};`);
            const result = func(...Object.values(context));
            return typeof result === "string" ? result : "";
        } catch (e) {
            console.error("Expression evaluation error:", e);
            return "";
        }
    }

    public async writeAsync(text: string): Promise<void> {
        await currentTypeWriter.startParsingAsync(text, this);
    }
}