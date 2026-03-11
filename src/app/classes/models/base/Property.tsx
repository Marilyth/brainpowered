import { events } from "@/app/classes/utility/Events";
import { RegisterClass } from "@/app/classes/utility/JsonHelper";
import { WorldNodeProperty } from "./WorldNodeProperty";
import { action, computed, makeAutoObservable, makeObservable, observable } from "mobx";

export enum PropertyType {
    Text = "text",
    Number = "number",
    Boolean = "boolean",
}

@RegisterClass
export class Property extends WorldNodeProperty {
    private _value: any;

    public constructor(public name: string, value: any, nodeId: string) {
        super(nodeId);
        this._value = value;

        makeObservable<Property, "_value">(this, {
            _value: observable,
            value: computed,
            propertyType: observable,
            name: observable,
        });
    }

    public propertyType: PropertyType = PropertyType.Text;

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        this._value = value;
        const eventId = `${this.nodeId}_${this.name}`;

        events.emitAsync("property_changed", eventId);
    }
}