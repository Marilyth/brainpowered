import { makeAutoObservable } from "mobx";
import { Coordinates } from "../models/world/base/Coordinates";

export default class CoordinatesViewModel {
    private _x: number;
    private _y: number;
    private _z: number;
    private model: Coordinates;

    constructor(model: Coordinates) {
        this.model = model;
        this._x = model.x;
        this._y = model.y;
        this._z = model.z;
        
        makeAutoObservable(this);
    }

    public get x() {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
        this.model.x = value;
    }

    public get y() {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
        this.model.y = value;
    }

    public get z() {
        return this._z;
    }

    public set z(value: number) {
        this._z = value;
        this.model.z = value;
    }
}