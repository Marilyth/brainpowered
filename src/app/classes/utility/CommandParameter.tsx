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

    public toString(): string {
        return this.value;
    }

    public clone(): CommandParameter {
        const parameter = new CommandParameter(this.name, this.description);

        parameter.value = this.value;

        return parameter;
    }
}