import Action from "../Action";
import TypeWriterViewModel from "../../TypeWriterViewModel";
import { Coordinates } from "./Coordinates";
import { Sound } from "./Sound";
import { Dimensions } from "./Dimensions";

export abstract class WorldNode {
    public name: string;
    public context: string;
    public description: string;
    public connections: WorldNode[] = [];
    public actions: Action[] = [];
    public color: string = "#FFFFFF";
    public coordinates: Coordinates = new Coordinates(0, 0, 0);
    public dimensions: Dimensions = new Dimensions(1, 1, 1);
    public image: string = "";
    public sounds: Sound[] = [];

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

        for (const connection of this.connections) {
            for (const child of connection.traverseNodeTree()) {
                nodes.push(child);
            }
        }

        return nodes;
    }

    public addChild(node: WorldNode) {
        this.connections.push(node);
    }

    public removeChild(node: WorldNode) {
        this.connections = this.connections.filter((child) => child !== node);
    }

    public checkNode(stringParser: TypeWriterViewModel): Promise<void> {
        const descriptions: string[] = [this.description, ...this.connections.map((connection) => connection.context)];

        return stringParser.startParsingAsync(descriptions.join(". "));
    }

    /**
     * Adds the generic check action to the node.
     * This will type out the description of the node and the context of its children.
     */
    private addCheckAction() {
        const checkSynonyms: string[] = ["Inspect", "Assess", "Analyze", "Probe", "Scan", "Investigate", "Survey", "Examine", "Check", "Explore", "Look"];
        const checkActionCommand: string = checkSynonyms.join("|");

        this.actions.push(new Action(checkActionCommand, this, this.checkNode.name));
    }

    private removeAction(action: Action) {
        this.actions = this.actions.filter((a) => a !== action);
    }
}