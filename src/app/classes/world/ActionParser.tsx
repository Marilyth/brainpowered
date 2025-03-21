import { Action } from "./Action";

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
        const match: string[] | null = action.matches(tokens);

        if (match && match.length > biggestMatchLength) {
            biggestMatch = action;
            biggestMatchLength = match.length;
        }
    }

    // Return the biggest match.
    return biggestMatch;
}
