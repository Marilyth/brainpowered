import { Coordinates } from "../../base/Coordinates";
import { Observer } from "../../base/Observer";
import { Action } from "../../Action";
import { WorldNode } from "../../base/WorldNode";
import { TravelNode } from "../../base/TravelNode";
import { Player } from "../../Player";
import { Story } from "../../base/Story";

const player: Player = new Player("Hans", new Observer(5, 0, 0));

export const demo: Story = new Story("Demo", "", "", player);
demo.dimensions.width=100;
demo.dimensions.height=100;
demo.dimensions.depth=100;
demo.actions.push(
    new Action(["start", "begin"], "This is a [color;orange;demo] story. Please take your time getting adjusted to the way these games play.", demo)
);

const startingLocation = new WorldNode("Hallway", "You see a dark hallway.", "A dark hallway stretches forward about 50 meters. The walls are covered in a dark red wallpaper.");
startingLocation.dimensions.width = 10;
startingLocation.dimensions.height = 10;
startingLocation.dimensions.depth = 10;

const room = new TravelNode("Room", "You see a dark room.", "You see a dark room. Horrible screams can be heard from inside.", "As you open the door. You begin to regret it.");
room.coordinates = new Coordinates(5, 5, 0);

startingLocation.addChild(room);
startingLocation.addChild(player);
demo.addChild(startingLocation);
