import { Coordinates } from "../../base/Coordinates";
import Location from "../../base/Location";
import { Observer } from "../../base/Observer";
import Story from "../../base/Story";
import { Player } from "../../Player";

export class Demo extends Story {
    constructor() {
        const startingLocation = new Location("Room", "You see a dark room.", "You see a dark room. Horrible screams can be heard from inside.", "You walk into the room.", new Coordinates(0, 0, 0));
        const player = new Player("Hans", startingLocation, new Observer(0, 0, 0));

        super("Demo", "A short demo.", "This is a [color;orange;demo] story. Please take your time getting adjusted to the way these games play.", player);
    }
}