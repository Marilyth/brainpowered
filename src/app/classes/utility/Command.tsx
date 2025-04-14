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

    public ToString(): string {
        const commandComponents = [this.name];

        for (const parameter of this.parameters) {
            commandComponents.push(parameter.ToString());
        }

        return commandComponents.join(";");
    }
}