import StringParser from "../StringParser";
import { WorldNode } from "./base/WorldNode";

export default class Action {
    constructor(actionString: string, owner: WorldNode, ownerCallbackName: string) {
        this.actionString = actionString;
        this.owner = owner;
        this.ownerCallbackName = ownerCallbackName;
    }

    public actionString: string;
    public owner: WorldNode;
    public ownerCallbackName: string;

    /**
     * Triggers the owner's callback with the given string parser.
     * @param stringParser The string parser to trigger the callback with.
     */
    public triggerAsync(stringParser: StringParser): Promise<void> {
        const callback = this.owner[this.ownerCallbackName as keyof WorldNode];
        return (callback as (a: StringParser) => Promise<void>)(stringParser);
    }

    /**
     * Checks if the user input matches the command and returns the exact matched tokens.
     * @param tokens The user input tokens.
     * @returns The exact match of the command, picking out aliases, or null if no match.
     */
    public matches(tokens: string[]): string[] | null {
        const commandTokens: string[] = this.actionString.toLowerCase().split(" ");
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