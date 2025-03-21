import TravelNode from "./base/TravelNode";
import { Observer } from "./base/Observer";
import { events } from "./base/Events";
import { Action } from "./Action";
import { parseUserInput } from "./ActionParser";
import { WorldNode } from "./base/WorldNode";

export class Player extends WorldNode {
    constructor(public name: string, public coordinates: Observer) {
        super(name, "", "");
    }

    public getCoordinates(): Observer {
        return this.coordinates;
    }

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