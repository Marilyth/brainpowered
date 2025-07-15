import { makeAutoObservable } from "mobx";

export enum CommandParameterType {
    Text = "text",
    Number = "number",
    Boolean = "boolean",
    Color = "colour",
    Code = "code"
}

export class CommandParameter {
    public valueType: CommandParameterType;
    public name: string;
    public description: string;
    public value: string = "";

    constructor(valueType: CommandParameterType, name: string, description: string) {
        this.name = name;
        this.description = description;
        this.valueType = valueType;

        makeAutoObservable(this);
    }

    public toString(): string {
        return this.value;
    }

    public clone(): CommandParameter {
        const parameter = new CommandParameter(this.valueType, this.name, this.description);

        parameter.value = this.value;

        return parameter;
    }
}