import { events } from "@/app/classes/utility/Events";
import { currentTypeWriter } from "@/app/classes/viewmodels/TypeWriterViewModel";
import { WorldNode } from "./WorldNode";

export class StoryEvent {
    private isRegistered: boolean = false;
    private callable: (...args: any[]) => Promise<void>;

    public constructor(public eventName: string, public response: string, public parent: WorldNode) {
        this.callable = this.handleEvent.bind(this);
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

    private async handleEvent(...args: any[]): Promise<void> {
        // Replace $\d+ with the actual arguments passed to the event.
        const argMatcher = /\$(\d+)/g;
        const formattedResponse = this.response.replace(argMatcher, (_, index) => {
            return args[parseInt(index)] || "";
        });

        await this.parent.writeAsync(formattedResponse);
    }
}