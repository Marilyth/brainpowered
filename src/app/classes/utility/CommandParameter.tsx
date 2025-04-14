import { makeAutoObservable } from "mobx";

export class CommandParameter {
    public name: string = "";
    public description: string = "";
    public value: string = "";

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;

        makeAutoObservable(this);
    }

    public ToString(): string {
        return this.value;

        makeAutoObservable(this);
    }
}