import TravelNode from "@/app/classes/models/world/base/TravelNode";
import { Observer } from "@/app/classes/models/world/base/Observer";
import { events } from "@/app/classes/utility/Events";
import { Action } from "@/app/classes/models/world/Action";
import { parseUserInput } from "@/app/classes/models/world/ActionParser";
import { WorldNode } from "@/app/classes/models/world/base/WorldNode";

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