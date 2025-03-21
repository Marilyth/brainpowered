import { currentTypeWriter } from "../TypeWriterViewModel";
import { events } from "./base/Events";

export default class EventHandler {
    constructor(eventName: string, outputText: string) {
        this.eventName = eventName;
        this.outputText = outputText;

        events.on(`event_triggered:${this.eventName}`, this.triggerAsync.bind(this));
    }

    public eventName: string;
    public outputText: string;

    /**
     * Triggers the owner's callback with the given string parser.
     * @param stringParser The string parser to trigger the callback with.
     */
    private async triggerAsync(...args: string[]): Promise<void> {
        await currentTypeWriter.startParsingAsync(this.outputText);
    }
}