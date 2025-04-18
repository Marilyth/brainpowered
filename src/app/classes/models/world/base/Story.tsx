import TypeWriterViewModel from "@/app/classes/viewmodels/TypeWriterViewModel";
import { Player } from "@/app/classes/models/world/Player";
import { WorldNode } from "@/app/classes/models/world/base/WorldNode";

export default class Story extends WorldNode {
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
        const objects: WorldNode[] = [this, this.player.parent!, ...this.player.parent!.children];
        for (const object of objects) {
            text = text.replace(new RegExp(`(^|\\s)(${object.name.toLowerCase()})`, "gmi"), `$1[color;${object.color};$2]`);
        }

        return text;
    }
 }