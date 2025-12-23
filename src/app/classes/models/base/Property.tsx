import { events } from "@/app/classes/utility/Events";
import { RegisterClass } from "@/app/classes/utility/JsonHelper";
import { WorldNodeProperty } from "./WorldNodeProperty";
import { makeObservable } from "mobx";

@RegisterClass
export class Property extends WorldNodeProperty {
    private _value: any;

    public constructor(public name: string, value: any, nodeId: string) {
        super(nodeId);
        this._value = value;

        makeObservable(this, {
            _value: true,
        } as any);
    }

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        this._value = value;
        const eventId = `${this.nodeId}_${this.name}`;

        events.emitAsync("property_changed", eventId);
    }
}