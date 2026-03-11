import { makeAutoObservable } from "mobx";
import { CommandParameter } from "./CommandParameter";

export class Command {
    public name: string = "";
    public description: string = "";
    public parameters: CommandParameter[] = [];
    private onTrigger: (args: string[]) => Promise<void>|void = () => { return; };

    constructor(onTrigger: (args: string[]) => Promise<void>|void ) {
        this.onTrigger = onTrigger;
        makeAutoObservable(this);
    }

    public async InvokeAsync(args: string[]) : Promise<void> {
        const result = this.onTrigger(args);

        if (result instanceof Promise) {
            await result;
        }
    }

    public toString(): string {
        const commandComponents = [this.name];

        for (const parameter of this.parameters) {
            commandComponents.push(parameter.toString());
        }

        return this.name == "script" ? `\${${commandComponents.join(";")}}` : `[${commandComponents.join(";")}]`;
    }

    public clone(): Command {
        const command = new Command(this.onTrigger);

        command.name = this.name;
        command.description = this.description;

        for (const parameter of this.parameters) {
            command.parameters.push(parameter.clone());
        }

        return command;
    }
}