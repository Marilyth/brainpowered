import { Observer } from "../../base/Observer";
import { Action } from "../../base/Action";
import { Story } from "../../Story";
import { WorldNode } from "../../WorldNode";

export const demo: Story = new Story("Demo", "");
demo.addNode(new WorldNode("player", "The Player", "This is the player character."));