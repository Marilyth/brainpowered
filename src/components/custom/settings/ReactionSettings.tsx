import { observer } from "mobx-react-lite";
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { WorldNode } from "../../../classes/models/WorldNode";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TextEditor } from "../TextEditor";
import { Reaction } from "../../../classes/models/base/Reaction";

interface ReactionSettingsProps {
    model: WorldNode;
}

export const ReactionSettings = observer((props: ReactionSettingsProps) => {
    function addReaction()
    {
        props.model.reactions.push(new Reaction("property_changed", "A property changed", props.model.id));
    }

    return (
        <div className="space-y-4">
            <div className="text-muted-foreground text-sm leading-tight">
                Reactions are things that happen in response to events. E.g. when the player loses health, or takes a key.
            </div>
            
            <div className="flex flex-col border-1 rounded-md p-2">
                {props.model.reactions.map((event, index) => (
                    <div key={index}>
                        <div className="space-y-4 hover:bg-muted transition-colors rounded p-2">
                            <div id="header" className="grid grid-cols-[1fr_auto] gap-4">
                                <Input value={event.eventName} onChange={(v) => event.eventName = v.target.value} />
                                <Button variant="ghost" onClick={() => props.model.reactions.splice(index, 1)}>
                                    <FiTrash2 color="salmon" />
                                </Button>
                            </div>
                            <TextEditor text={event.response} onChange={(v) => event.response = v} placeholder="Description" />
                        </div>

                        <Separator className="my-4" />
                    </div>
                ))}

                <Button variant="outline" className="mt-2" onClick={addReaction}><FiPlus />Add reaction</Button>
            </div>
        </div>
    );
});
  