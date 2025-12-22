import { Action } from "./base/Action";
import { Coordinates } from "./base/Coordinates";
import { Sound } from "./base/Sound";
import { Dimensions } from "./base/Dimensions";
import { Property } from "./base/Property";
import { Reaction } from "./base/Reaction";
import { RegisterClass } from "@/app/classes/utility/JsonHelper";

@RegisterClass
export class WorldNode {
    [key: string]: any;

    private _id: string;

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

        this.coordinates = new Coordinates(0, 0, 0, this._id);
        this.dimensions = new Dimensions(1, 1, 1, this._id);
        this.addCheckAction();

        // ToDo: Add reactions for entering and exiting presence range.
        // E.g. for playing a sound when the player approaches the node.
    }

    public name: string;
    public context: string;
    public description: string;
    public color: string = "#AAFFFF";

    public properties: { [key: string]: Property } = {};
    public reactions: { [key: string]: Reaction } = {};
    public actions: { [key: string]: Action } = {};
    public coordinates: Coordinates;
    public dimensions: Dimensions;

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
        this.updateIdInChildren();
    }

    private updateIdInChildren(){
        for (const actionName in this.actions) {
            this.actions[actionName].nodeId = this.id;
        }

        for (const reactionName in this.reactions) {
            this.reactions[reactionName].nodeId = this.id;
        }

        for (const propertyName in this.properties) {
            this.properties[propertyName].nodeId = this.id;
        }

        this.dimensions.nodeId = this.id;
        this.coordinates.nodeId = this.id;
    }

    /**
     * Adds the generic check action to the node.
     * This will type out the description of the node and the context of its children.
     */
    private addCheckAction() {
        const checkSynonyms: string[] = ["Inspect", "Assess", "Analyze", "Probe", "Scan", "Investigate", "Survey", "Examine", "Check", "Explore", "Look"];
        this.actions["Inspect"] = new Action(checkSynonyms, "${[this.description, ...this.children.map((c) => c.context)].join(\" \")}", this._id);
    }

    /**
     * Checks if the node is inside another node.
     * @param other The other node to check against.
     * @param allowSameArea Whether to allow nodes with the same area to be considered inside each other.
     * @returns True if the node is inside the other node, false otherwise.
     */
    public isInside(other: WorldNode, allowSameArea: boolean): boolean {
        if (!allowSameArea && this.dimensions.getArea() >= other.dimensions.getArea())
            return false;
        
        return (
            this.coordinates.x >= other.coordinates.x &&
            this.coordinates.y >= other.coordinates.y &&
            this.coordinates.z >= other.coordinates.z &&
            this.coordinates.x + this.dimensions.width <= other.coordinates.x + other.dimensions.width &&
            this.coordinates.y + this.dimensions.depth <= other.coordinates.y + other.dimensions.depth &&
            this.coordinates.z + this.dimensions.height <= other.coordinates.z + other.dimensions.height
          );
    }
}