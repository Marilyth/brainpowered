import { RegisterClass } from "@/classes/utility/JsonHelper";
import { WorldNodeProperty } from "./WorldNodeProperty";
import { events } from "../../utility/Events";
import { makeObservable } from "mobx";

@RegisterClass
export class Dimensions extends WorldNodeProperty {
    constructor(private _width: number, private _depth: number, private _height: number, nodeId: string) {
        super(nodeId);

        makeObservable(this, {
            _width: true,
            _depth: true,
            _height: true,
        } as any);
    }

    public get width(): number {
        return this._width;
    }

    public get depth(): number {
        return this._depth;
    }

    public get height(): number {
        return this._height;
    }

    public set width(value: number) {
        this._width = value;
        this.notifyDimensionsChanged();
    }

    public set depth(value: number) {
        this._depth = value;
        this.notifyDimensionsChanged();
    }

    public set height(value: number) {
        this._height = value;
        this.notifyDimensionsChanged();
    }

    public getArea(): number {
        return this.width * this.depth;
    }

    public getVolume(): number {
        return this.width * this.depth * this.height;
    }

    private notifyDimensionsChanged(): void {
        events.emitAsync("dimensions_changed", this.nodeId);
    }
}