import { observer } from "mobx-react-lite";
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { WorldNode } from "../../models/WorldNode";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TextEditor } from "../TextEditor";
import { Interaction } from "../../models/base/Interaction";

interface InteractionSettingsProps {
    model: WorldNode;
}

export const InteractionSettings = observer((props: InteractionSettingsProps) => {
    function addInteraction()
    {
        props.model.interactions.push(new Interaction(["look"], "You looked at me...", props.model.id));
    }

    return (
        <div className="space-y-4">
            <div className="text-muted-foreground text-sm leading-tight">
                Interactions are things the user can do to / with the object. E.g. inspect, open, take, etc.
            </div>
            
            <div className="flex flex-col border-1 rounded-md p-2">
                {props.model.interactions.map((interaction, index) => (
                    <div key={index}>
                        <div className="space-y-4 hover:bg-muted transition-colors rounded p-2">
                            <div id="header" className="grid grid-cols-[1fr_auto] gap-4">
                                <Input placeholder="Name" value={interaction.actionAliases[0]} onChange={(v) => interaction.actionAliases[0] = v.target.value} />
                                <Button variant="ghost" onClick={() => props.model.interactions.splice(index, 1)}>
                                    <FiTrash2 color="salmon" />
                                </Button>
                            </div>
                            <TextEditor text={interaction.response} onChange={(v) => interaction.response = v} placeholder="Description" />
                        </div>
                        <Separator />
                    </div>
                ))}

                <Button variant="outline" className="mt-2" onClick={addInteraction}><FiPlus />Add interaction</Button>
            </div>
        </div>
    );
});
  