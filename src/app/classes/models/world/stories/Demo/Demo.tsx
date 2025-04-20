import { Observer } from "../../base/Observer";
import { Action } from "../../Action";
import { Player } from "../../Player";
import { Story } from "../../base/Story";
import { TravelNode } from "../../base/TravelNode";

const player: Player = new Player("Player", new Observer(0, 0, 0));
const test: TravelNode = new TravelNode("Door", "Test", "Test", "Test");

export const demo: Story = new Story("Demo", "", "", player);
demo.dimensions.width=100;
demo.dimensions.height=100;
demo.dimensions.depth=100;
demo.actions.push(
    new Action(["start", "begin"], "This is a [color;orange;demo] story.", demo)
);
demo.insertHierarchically(player);