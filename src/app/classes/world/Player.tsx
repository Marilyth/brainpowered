import Location from "./base/Location";
import { Observer } from "./base/Observer";
import { events } from "./base/Events";

export class Player {
    constructor(public name: string, public location: Location, private coordinates: Observer) { }

    public getCoordinates(): Observer {
        return this.coordinates;
    }

    public modifyCoordinates(modifier: (observer: Observer) => void): void {
        modifier(this.coordinates);
        events.emit("playerMoved", this.coordinates);
    }
}