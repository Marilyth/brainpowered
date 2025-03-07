import Location from "../base/Location";
import Story from "../base/Story";
import { Player } from "../Player";

export class Demo extends Story {
    constructor() {
        const startingLocation: Location = new Location("Room", "You see a dark room.", "You see a dark room. Horrible screams can be heard from inside.", "You walk into the room.");
        const player: Player = new Player("Hans", startingLocation);

        super("Demo", "A short demo.", "This is a [color;orange;demo] story. Please take your time getting adjusted to the way these games play.", player);
    }
}