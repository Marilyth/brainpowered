import { Coordinates } from "../../base/Coordinates";
import TravelNode from "../../base/TravelNode";
import { Observer } from "../../base/Observer";
import Story from "../../base/Story";
import { Player } from "../../Player";
import { WorldNode } from "../../base/WorldNode";
import Object from "../../base/Object";
import { StaticAction } from "../../Action";

const player: Player = new Player("Hans", new Observer(0, 0, 0));
const startingLocation = new Object("Hallway", "You see a dark hallway.", "A dark hallway stretches forward about 50 meters. The walls are covered in a dark red wallpaper.");
startingLocation.actions.push(
    new StaticAction("start", "This is a [color;orange;demo] story. Please take your time getting adjusted to the way these games play.")
);

const room = new TravelNode("Room", "You see a dark room.", "You see a dark room. Horrible screams can be heard from inside.", "As you open the door. You begin to regret it.");
startingLocation.addChild(room);
startingLocation.addChild(player);

export const demo: Story = new Story("Demo", "", "", player);
