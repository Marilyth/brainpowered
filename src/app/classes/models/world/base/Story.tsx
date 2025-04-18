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
    
    /**
     * Inserts the nodes into the smallest parent node that can contain them. Or the root if no parent can contain it.
     * @param nodes The nodes to insert.
     */
    public insertHierarchically(...nodes: WorldNode[]): void {
        // For optimization, order the nodes by their area, so that the largest node is inserted first.
        nodes.sort((a, b) => {
            const aSize = a.dimensions.getArea();
            const bSize = b.dimensions.getArea();

            return bSize - aSize;
        });

        // Insert the nodes into the smallest parent node.
        for (const node of nodes) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let nearestParent: WorldNode = this;

            for (let i = 0; i < nearestParent.children.length; i++) {
                const child = nearestParent.children[i];

                if (node.isInside(child)) {
                    nearestParent = child;
                    i = -1; // Restart the loop to check the new nearest parent.
                }
            }

            // Check if any of the children of the nearest parent are inside the node, and shift them to the node.
            for (const child of nearestParent.children) {
                if (child.isInside(node)) {
                    node.addChild(child);
                }
            }

            nearestParent.addChild(node);
        }
    }
 }