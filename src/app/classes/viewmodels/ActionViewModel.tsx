import { makeAutoObservable } from "mobx";
import { Action } from "../models/world/Action";

export default class ActionViewModel {
    private _actionNames: string[];
    private _response: string;
    public model: Action;

    constructor(model: Action) {
        this.model = model;
        this._actionNames = model.actionNames;
        this._response = model.response;

        makeAutoObservable(this);
    }

    public get actionNames() {
        return this._actionNames.join(", ");
    }

    public set actionNames(value: string) {
        this._actionNames = value.split(", ").map((alias) => alias.trim().toLowerCase());
        this.model.actionNames = this._actionNames;
    }

    public get response() {
        return this._response;
    }

    public set response(value: string) {
        this._response = value;
        this.model.response = value;
    }
}