import { RegisterClass } from "../../utility/JsonHelper";
import { Observer } from "./base/Observer";
import { WorldNode } from "./base/WorldNode";
import { events } from "../../utility/Events";
import { Action } from "./Action";
import { parseUserInput } from "./ActionParser";

@RegisterClass
export class Player extends WorldNode {
    constructor(name: string, coordinates: Observer) {
        super(name, "", "");

        this.coordinates = coordinates;
    }

    public coordinates: Observer;

    public modifyCoordinates(modifier: (observer: Observer) => void): void {
        modifier(this.coordinates);
        events.emit("player_moved", this.coordinates);
    }

    /**
     * Performs the action text on the current location and connections.
     * @param typeWriter The type writer to use for the action.
     * @param actionText The action text to perform.
     */
    public async performActionAsync(actionText: string): Promise<void> {
        const currentLocationActions: Action[] = [...this.parent!.actions];

        for (const connection of this.parent!.children) {
            currentLocationActions.push(...connection.actions);
        }

        const matchedAction: Action | null = parseUserInput(currentLocationActions, actionText);

        await matchedAction?.triggerAsync();
    }
}