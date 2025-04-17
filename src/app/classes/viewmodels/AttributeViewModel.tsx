import { makeAutoObservable } from "mobx";
import { Attribute } from "../models/world/base/Attribute";

export enum TextType {
    Text = "text",
    Number = "number",
    Boolean = "boolean",
}

export class AttributeViewModel {
    private _name: string;
    private _value: any;
    public model: Attribute;
    public textType: TextType;

    constructor(model: Attribute) {
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