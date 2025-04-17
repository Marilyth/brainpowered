import { Action } from "@/app/classes/models/world/Action";

/**
 * Returns the best match of an action for the user input.
 * @param actions The possible actions.
 * @param input The user input.
 */
export function parseUserInput(actions: Action[], input: string): Action | null {
    const normalizedInput: string = input.toLowerCase().replaceAll(/[^a-z0-9 ]/g, "");
    const tokens: string[] = normalizedInput.split(" ");

    for (const action of actions) {
        console.log("Checking action:", action.actionNames, "against tokens:", tokens);
        if (action.matches(tokens)) {
            return action;
        }
    }

    return null;
}
