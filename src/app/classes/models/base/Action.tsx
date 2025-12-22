import { events } from "../../utility/Events";
import { RegisterClass } from "../../utility/JsonHelper";
import { WorldNodeProperty } from "./WorldNodeProperty";

@RegisterClass
export class Action extends WorldNodeProperty {
    constructor(public actionAliases: string[], public response: string, nodeId: string) {
        super(nodeId);
    }

    public async triggerAsync(): Promise<void> {
        const eventId = `${this.nodeId}_${this.actionAliases[0]}`;

        await events.emitAsync("write_requested", this.response, eventId);
        await events.emitAsync("action_triggered", eventId);
    }
}
