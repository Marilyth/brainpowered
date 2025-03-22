import { makeAutoObservable } from "mobx";
import { WorldNode } from "../models/world/base/WorldNode";
import Object from "../models/world/base/Object";

export default class WorldNodeViewModel {
    public model: WorldNode;
    public parent: WorldNodeViewModel | null = null;
    public children: WorldNodeViewModel[] = [];

    constructor(model: WorldNode) {
        this.model = model;
        this.children = model.children.map((child) => new WorldNodeViewModel(child));
        this.children.forEach((child) => child.parent = this);
        
        makeAutoObservable(this);
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