import Action from "../Action";
import StringParser from "../../StringParser";

export abstract class WorldNode {
    public name: string;
    public context: string;
    public description: string;
    public connections: WorldNode[] = [];
    public actions: Action[] = [];
    public color: string = "#FFFFFF";

    /**
     * Initializes a new instance of the Node class.
     * @param name The name of the node.
     * @param context The context of the node. I.e. how it is shortly described when checking the parent.
     * @param description The description of the node. I.e. how it is described when checking the node itself.
     * @param actions The actions that can be performed on the node.
     */
    constructor(name: string, context: string, description: string) {
        this.name = name;
        this.context = context;
        this.description = description;

        this.addCheckAction();
    }

    public addChild(node: WorldNode) {
        this.connections.push(node);
    }

    public removeChild(node: WorldNode) {
        this.connections = this.connections.filter((child) => child !== node);
    }

    public checkNode(stringParser: StringParser): Promise<void> {
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