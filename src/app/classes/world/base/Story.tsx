import { Player } from "../Player";
import { WorldNode } from "./WorldNode";

export default abstract class Story extends WorldNode {
    public player: Player;
    public color: string = "#FFFFAA";

    constructor(name: string, description: string, longDescription: string, player: Player) {
        super(name, description, longDescription);

        this.player = player;
    }

    /**
     * Replaces all occurences of the node and children's names in the text with a colored version of the name.
     * @param text The text to replace the names in.
     */
    public markNodesInText(text: string): string {
        const objects: WorldNode[] = [this, this.player.location, ...this.player.location.connections];
        for (const object of objects) {
            text = text.replace(new RegExp(`(${object.name.toLowerCase()})`, "g"), `[color;${object.color};$1]`);
        }

        return text;
    }
 }