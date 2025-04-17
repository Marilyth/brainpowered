import { events } from "@/app/classes/utility/Events";

export class Attribute {
    private _value: any;

    public constructor(public name: string, value: any) {
        this._value = value;
    }

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        this._value = value;
        events.emit(`attribute_changed:${this.name}`);
    }
}