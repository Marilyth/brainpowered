import { makeAutoObservable } from "mobx";
import { StoryEvent } from "../models/world/base/StoryEvent";

export default class StoryEventViewModel {
    private _eventName: string;
    private _response: string;
    public model: StoryEvent;

    constructor(model: StoryEvent) {
        this.model = model;
        this._eventName = model.eventName;
        this._response = model.response;

        makeAutoObservable(this);
    }

    public get eventName() {
        return this._eventName;
    }

    public set eventName(value: string) {
        this._eventName = value;
        this.model.eventName = value;
        this.model.register();
    }

    public get response() {
        return this._response;
    }

    public set response(value: string) {
        this._response = value;
        this.model.response = value;
    }
}