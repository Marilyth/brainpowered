import { events } from "@/app/classes/utility/Events";
import { currentTypeWriter } from "@/app/classes/viewmodels/TypeWriterViewModel";

export class StoryEvent {
    private isRegistered: boolean = false;
    private callable: (...args: any[]) => void;

    public constructor(public eventName: string, public response: string) {
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

    private handleEvent(...args: any[]): void {
        // Replace $\d+ with the actual arguments passed to the event.
        const argMatcher = /\$(\d+)/g;
        const formattedResponse = this.response.replace(argMatcher, (_, index) => {
            return args[parseInt(index)] || "";
        });

        currentTypeWriter.startParsingAsync(formattedResponse);
    }
}