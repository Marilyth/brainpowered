import { makeAutoObservable } from "mobx";
import { Attribute, TextType } from "../models/world/base/Attribute";

export default class AttributeViewModel {
    private _name: string;
    private _textType: TextType;
    private _value: string;
    public model: Attribute;

    constructor(model: Attribute) {
        this.model = model;
        this._name = model.name;
        this._textType = model.textType;
        this._value = model.value;
        
        makeAutoObservable(this);
    }

    public get name() {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
        this.model.name = value;
    }

    public get textType() {
        return this._textType;
    }

    public set textType(value: TextType) {
        this._textType = value;
        this.model.textType = value;
    }

    public get value() {
        return this._value;
    }
    
    public set value(value: string) {
        this._value = value;
        this.model.value = value;
    }
}