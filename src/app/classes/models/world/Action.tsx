import { WorldNode } from "./base/WorldNode";

export class Action {
    constructor(actionNames: string[], response: string, parent: WorldNode) {
        this.actionNames = [];

        for (const alias of actionNames) {
            this.actionNames.push(alias.toLowerCase());
        }

        this.response = response;
        this.parent = parent;
    }

    public actionNames: string[];
    public response: string;
    public parent: WorldNode;

    /**
     * Checks if the user input matches the command and returns the exact matched tokens.
     * @param tokens The user input tokens.
     * @returns The exact match of the command, picking out aliases, or null if no match.
     */
    public matches(tokens: string[]): boolean {
        // Check if any token matches the name of this node before continuing.
        const nodeName: string = this.parent.name.toLowerCase();

        if (!tokens.some((token) => token.toLowerCase() === nodeName)) {
            return false;
        }

        // Check if any of the actions match the tokens.
        for (const actionName of this.actionNames) {
            if (tokens.some((token) => token.toLowerCase() === actionName)) {
                return true;
            }
        }
        
        return false;
    }

    public async triggerAsync(): Promise<void> {
        await this.parent.writeAsync(this.response);
    }
}
