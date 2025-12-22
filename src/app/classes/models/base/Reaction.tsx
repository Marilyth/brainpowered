import { events } from "@/app/classes/utility/Events";
import { RegisterClass } from "@/app/classes/utility/JsonHelper";
import { WorldNodeProperty } from "./WorldNodeProperty";

@RegisterClass
export class Reaction extends WorldNodeProperty {
    private isRegistered: boolean = false;
    private callable: (...args: any[]) => Promise<void>;

    public constructor(public eventName: string, public response: string, nodeId: string) {
        super(nodeId);
        this.callable = this.handleReaction.bind(this);
        this.register();
    }

    public register(): void {
        this.unregister();

        events.on(this.eventName, this.callable);
        this.isRegistered = true;
    }

    public unregister(): void {
        if (!this.isRegistered) {
            return;
        }

        events.off(this.eventName, this.callable);
        this.isRegistered = false;
    }

    private async handleReaction(...args: any[]): Promise<void> {
        // Replace $\d+ with the actual arguments passed to the event.
        const argMatcher = /\$(\d+)/g;
        const formattedResponse = this.response.replace(argMatcher, (_, index) => {
            return args[parseInt(index)] || "";
        });

        // EventName contains the id of the parent node. No need to save a reference.
        const eventId = `${this.nodeId}_${this.eventName}`;
        await events.emitAsync("write_requested", formattedResponse, eventId);
        await events.emitAsync("reaction_triggered", eventId);
    }
}