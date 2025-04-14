import { makeAutoObservable } from "mobx";
import { WorldNode } from "../models/world/base/WorldNode";
import Object from "../models/world/base/Object";
import CoordinatesViewModel from "./CoordinatesViewModel";
import DimensionsViewModel from "./DimensionsViewModel";

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
        
        makeAutoObservable(this);
    }

    public coordinates: CoordinatesViewModel;
    public dimensions: DimensionsViewModel;
    public parent: WorldNodeViewModel | null = null;
    public children: WorldNodeViewModel[] = [];
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
}