import { Observer } from "../../base/Observer";
import { Action } from "../../base/Action";
import { Player } from "../../Player";
import { Story } from "../../Story";
import { TravelNode } from "../../base/TravelNode";

const player: Player = new Player("Player", new Observer(0, 0, 0));
const test: TravelNode = new TravelNode("Door", "Test", "Test", "Test");

export const demo: Story = new Story("Demo", "", "", player);
demo.insertHierarchically(player);