import { makeAutoObservable } from "mobx";
import { Property } from "../models/world/base/Property";

export enum TextType {
    Text = "text",
    Number = "number",
    Boolean = "boolean",
}

export class PropertyViewModel {
    private _name: string;
    private _value: any;
    public model: Property;
    public textType: TextType;

    constructor(model: Property) {
        this.model = model;
        this._name = model.name;
        this._value = model.value;
        
        if (typeof model.value === "boolean") {
            this.textType = TextType.Boolean;
        } else if (typeof model.value === "number") {
            this.textType = TextType.Number;
        } else {
            this.textType = TextType.Text;
        }

        makeAutoObservable(this);
    }

    public get name() {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
        this.model.name = value;
    }

    public get value() {
        return this._value;
    }
    
    public set value(value: any) {
        this._value = value;
        this.model.value = value;
    }
}