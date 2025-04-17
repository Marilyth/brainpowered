import { makeAutoObservable } from "mobx";
import { WorldNode } from "../models/world/base/WorldNode";
import Object from "../models/world/base/Object";
import CoordinatesViewModel from "./CoordinatesViewModel";
import DimensionsViewModel from "./DimensionsViewModel";
import { AttributeViewModel } from "./AttributeViewModel";
import StoryEventViewModel from "./StoryEventViewModel";
import { Attribute } from "../models/world/base/Attribute";
import { StoryEvent } from "../models/world/base/StoryEvent";
import ActionViewModel from "./ActionViewModel";
import { Action } from "../models/world/Action";

export default class WorldNodeViewModel {
    private _name: string;
    private _description: string;
    private _context: string;
    public model: WorldNode;

    constructor(model: WorldNode) {
        this.model = model;
        this.color = model.color;
        this._name = model.name;
        this._description = model.description;
        this._context = model.context;

        this.coordinates = new CoordinatesViewModel(model.coordinates);
        this.dimensions = new DimensionsViewModel(model.dimensions);
        this.children = model.children.map((child) => new WorldNodeViewModel(child));
        this.children.forEach((child) => child.parent = this);

        this.attributes = model.attributes.map((attribute) => new AttributeViewModel(attribute));
        this.events = model.events.map((event) => new StoryEventViewModel(event));
        this.actions = model.actions.map((action) => new ActionViewModel(action));

        makeAutoObservable(this);
    }

    public coordinates: CoordinatesViewModel;
    public dimensions: DimensionsViewModel;
    public parent: WorldNodeViewModel | null = null;
    public children: WorldNodeViewModel[] = [];
    public attributes: AttributeViewModel[] = [];
    public events: StoryEventViewModel[] = [];
    public actions: ActionViewModel[] = [];
    public isSelected: boolean = false;
    public color: string = "#FFFFFF";

    public get name() {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
        this.model.name = value;
    }

    public get description() {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
        this.model.description = value;
    }

    public get context() {
        return this._context;
    }

    public set context(value: string) {
        this._context = value;
        this.model.context = value
    }

    public addChildObject() {
        const node = new Object("New Node", "New Context", "New Description");

        // Make dimensions 1/10th of the parent's dimensions.
        node.dimensions.width = this.model.dimensions.width / 2;
        node.dimensions.depth = this.model.dimensions.depth / 2;
        node.dimensions.height = this.model.dimensions.height / 2;

        this.model.addChild(node);
        this.children.push(new WorldNodeViewModel(node));
    }

    public removeChildObject(child: WorldNodeViewModel) {
        this.children = this.children.filter((c) => c !== child);
        this.model.removeChild(child.model);
    }

    public addAttribute() {
        const attribute = new Attribute("New Attribute", false);
        this.attributes.push(new AttributeViewModel(attribute));
        this.model.attributes.push(attribute);
    }

    public removeAttribute(attribute: AttributeViewModel) {
        this.attributes = this.attributes.filter((a) => a !== attribute);
        this.model.attributes = this.model.attributes.filter((a) => a !== attribute.model);
    }

    public addStoryEvent() {
        const event = new StoryEvent("EventName", "My response!", this.model);
        this.events.push(new StoryEventViewModel(event));
        this.model.events.push(event);
    }

    public removeStoryEvent(event: StoryEventViewModel) {
        event.model.unregister();
        this.events = this.events.filter((e) => e !== event);
        this.model.events = this.model.events.filter((e) => e !== event.model);
    }

    public addAction() {
        const action = new Action(["use"], "You used the ${name}", this.model);
        this.actions.push(new ActionViewModel(action));
        this.model.actions.push(action);
    }

    public removeAction(action: ActionViewModel) {
        this.actions = this.actions.filter((a) => a !== action);
        this.model.actions = this.model.actions.filter((a) => a !== action.model);
    }
}