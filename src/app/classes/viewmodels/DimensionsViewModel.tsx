import { makeAutoObservable } from "mobx";
import { Dimensions } from "../models/world/base/Dimensions";

export default class DimensionsViewModel {
    private _width: number;
    private _depth: number;
    private _height: number;

    private model: Dimensions;

    constructor(model: Dimensions) {
        this.model = model;
        this._width = model.width;
        this._depth = model.depth;
        this._height = model.height;
        
        makeAutoObservable(this);
    }

    public get width() {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
        this.model.width = value;
    }

    public get depth() {
        return this._depth;
    }

    public set depth(value: number) {
        this._depth = value;
        this.model.depth = value;
    }

    public get height() {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;
        this.model.height = value;
    }
}