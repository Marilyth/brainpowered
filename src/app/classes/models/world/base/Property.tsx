import { events } from "@/app/classes/utility/Events";
import { RegisterClass } from "@/app/classes/utility/JsonHelper";

@RegisterClass
export class Property {
    private _value: any;

    public constructor(public name: string, value: any) {
        this._value = value;
    }

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        this._value = value;
        events.emitAsync(`property_changed:${this.name}`);
    }
}