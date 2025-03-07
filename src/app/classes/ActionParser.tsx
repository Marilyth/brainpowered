import Action from "./Action";

/**
 * Returns the best match of an action for the user input.
 * @param actions The possible actions.
 * @param input The user input.
 */
export function parseUserInput(actions: Action[], input: string): Action | null {
    const normalizedInput: string = input.toLowerCase().replaceAll(/[^a-z0-9 ]/g, "");
    const tokens: string[] = normalizedInput.split(" ");
    let biggestMatch: Action | null = null;
    let biggestMatchLength: number = 0;

    for (const action of actions) {
        const match: string[] | null = matchCommand(tokens, action.actionString);

        if (match && match.length > biggestMatchLength) {
            biggestMatch = action;
            biggestMatchLength = match.length;
        }
    }

    // Return the biggest match.
    return biggestMatch;
}

/**
 * 
 * @param tokens The user input tokens.
 * @param command The command to match.
 * @returns The exact match of the command, picking out aliases, or null if no match.
 */
function matchCommand(tokens: string[], command: string): string[] | null {
    const commandTokens: string[] = command.toLowerCase().split(" ");
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
