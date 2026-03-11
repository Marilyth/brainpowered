import { Observer } from "../../base/Observer";
import { Interaction } from "../../base/Interaction";
import { Story } from "../../Story";
import { WorldNode } from "../../WorldNode";

export const demo: Story = new Story("Demo", "");
demo.addNode(new WorldNode("player", "The Player", "This is the player character."));