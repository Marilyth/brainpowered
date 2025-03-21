import { events } from "./Events";

export class Attribute {
    public constructor(public name: string, public value: any) { }

    public add(value: any): void {
        this.set(this.value + value);
    }

    public set(value: any): void {
        this.value = value;
        
        events.emit(`attribute_changed:${this.name}`);
    }
}