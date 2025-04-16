import { currentTypeWriter } from "@/app/classes/viewmodels/TypeWriterViewModel";
import { events } from "@/app/classes/utility/Events";

export abstract class Action {
    constructor(actionName: string) {
        this.eventName = actionName;
    }

    public eventName: string;

    /**
     * Triggers the owner's callback with the given string parser.
     * @param stringParser The string parser to trigger the callback with.
     */
    public abstract triggerAsync(): Promise<void>;

    /**
     * Checks if the user input matches the command and returns the exact matched tokens.
     * @param tokens The user input tokens.
     * @returns The exact match of the command, picking out aliases, or null if no match.
     */
    public matches(tokens: string[]): string[] | null {
        const commandTokens: string[] = this.eventName.toLowerCase().split(" ");
        const matchIndices: number[] = [];
        const matchTokens: string[] = [];
        
        for (let i = 0; i < commandTokens.length; i++) {
            const commandToken: string = commandTokens[i];
            const commandAliases: string[] = commandToken.split("|");
            let hasMatched: boolean = false;

            for (const alias of commandAliases) {
                // Optionally, we could lemmatize the alias for more natural matching.
                
                for (let j = 0; j < tokens.length; j++) {
                    const token: string = tokens[j];

                    if (token.startsWith(alias)) {
                        matchIndices.push(j);
                        matchTokens.push(alias);
                        hasMatched = true;
                        break;
                    }
                }

                if (hasMatched)
                    break;
            }

            // If we didn't find a match, return null.
            if (!hasMatched)
                return null;
        }

        // Optionally, we can check if the indices are in order.
        // But for now, we'll just check if they're all present.

        return matchTokens;
    }
}

export class DynamicAction extends Action {
    constructor(actionName: string, callback: () => Promise<void>) {
        super(actionName);
        this.callback = callback;
    }

    public callback: () => Promise<void>;

    public async triggerAsync(): Promise<void> {
        await events.emitAsync(`action_triggering:${this.eventName}`);

        await this.callback();

        await events.emitAsync(`action_triggered:${this.eventName}`);
    }
}

export class StaticAction extends Action{
    constructor (actionName: string, outputText: string) {
        super(actionName);
        this.outputText = outputText;
    }
    
    public outputText: string;

    public async triggerAsync(): Promise<void> {
        await events.emitAsync(`action_triggering:${this.eventName}`);

        await currentTypeWriter.startParsingAsync(this.outputText);

        await events.emitAsync(`action_triggered:${this.eventName}`);
    }
}
