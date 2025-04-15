import { events } from "@/app/classes/utility/Events";

export enum TextType {
    Text = "text",
    Number = "number",
    Boolean = "boolean",
}

export class Attribute {
    public constructor(public name: string, public value: any, public textType: TextType) { }

    public add(value: any): void {
        this.set(this.value + value);
    }

    public set(value: any): void {
        this.value = value;
        
        events.emit(`attribute_changed:${this.name}`);
    }
}