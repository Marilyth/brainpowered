import TypeWriterViewModel from "../../TypeWriterViewModel";
import Action from "../Action";
import { WorldNode } from "./WorldNode";

export default class Location extends WorldNode {
    public color: string = "#AAAAFF";
    public moveDescription: string;

    /**
     * Initializes a new instance of the Node class.
     * @param name The name of the node.
     * @param context The context of the node. I.e. how it is shortly described when checking the parent.
     * @param description The description of the node. I.e. how it is described when checking the node itself.
     * @param moveDescription The description of the movement action.
     */
    constructor(name: string, context: string, description: string, moveDescription: string) {
        super(name, context, description);
        this.moveDescription = moveDescription;

        this.addMoveToAction();
    }

    public moveTowards(stringParser: TypeWriterViewModel) {
        return stringParser.startParsingAsync(this.moveDescription);
    }

    /**
     * Adds the generic check action to the node.
     * This will type out the description of the node and the context of its children.
     */
    private addMoveToAction() {
        const checkSynonyms: string[] = ["Walk", "Jog", "Run", "Sprint", "Dash", "March", "Stroll", "Saunter", "Amble", "Trek", "Hike", "Wander", "Strut", "Mosey", "Glide", "Shuffle", "Tiptoe", "Creep", "Scurry", "Scuttle", "Rush", "Charge", "Bolt", "Gallop", "Bound", "Lumber", "Trudge", "Stride", "Pace", "Roam", "Drift", "Meander", "Advance", "Proceed", "Migrate", "Relocate", "Travel", "Sneak"];
        const checkActionCommand: string = checkSynonyms.join("|");

        this.actions.push(new Action(checkActionCommand, this, this.checkNode.name));
    }
}