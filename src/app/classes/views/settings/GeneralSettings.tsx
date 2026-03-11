import { observer } from "mobx-react-lite";
import { Input } from "@/components/ui/input";
import { TextEditor } from "../TextEditor";
import { FiTrash2 } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { WorldNode } from "../../models/WorldNode";
import { appContext } from "@/app/context";

interface GeneralSettingsProps {
    model: WorldNode;
}

export const GeneralSettings = observer((props: GeneralSettingsProps) => {
  return (
    <div className="space-y-4">
        <div className="text-muted-foreground text-sm leading-tight">
            These are crucial properties which every object has in common.
        </div>
        
        <div className="flex flex-col border-1 rounded-md p-2 space-y-4">
            <Field>
                <FieldLabel>Id</FieldLabel>

                <FieldDescription>
                    The id is a unique identifier for the object which is used to reference it in reactions and scripts.
                </FieldDescription>

                <FieldContent className="grid grid-cols-[1fr_auto] gap-4">
                    <Input disabled value={props.model.id} />
                    <Button variant="ghost" onClick={() => appContext.currentStory.removeNode(props.model)}>
                        <FiTrash2 color="salmon" />
                    </Button>
                </FieldContent>
            </Field>
            
            <Field>
                <FieldLabel>Colour</FieldLabel>
                <FieldDescription>
                    The colour of the object. This is used when referencing the object in text.
                </FieldDescription>
                <FieldContent>
                    <Input type="color" value={props.model.color} onChange={(v) => props.model.color = v.target.value} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldDescription>
                    The name is the way this object is referenced in the story and by the player in interactions.
                </FieldDescription>
                <FieldContent>
                    <Input value={props.model.name} onChange={(v) => props.model.name = v.target.value} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldDescription>
                    The description is shown to the player when they inspect the object.
                </FieldDescription>
                <FieldContent>
                    <TextEditor isMultiline={true} text={props.model.description} onChange={(s) => props.model.description = s} placeholder="You can see an old wooden table, brittle from being exposed to water." />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Context</FieldLabel>
                <FieldDescription>
                    The context is shown to the player when they inspect the parent of the object. E.g. if the object is a table, the parent is the room.
                </FieldDescription>
                <FieldContent>
                    <TextEditor isMultiline={true} text={props.model.context} onChange={(s) => props.model.context = s} placeholder="A wooden table can be seen in the corner of the room." />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Dimensions</FieldLabel>
                <FieldDescription>
                    The dimensions (width, depth, height) of the object in meters.
                </FieldDescription>
                <FieldContent className="grid grid-cols-3 gap-4">
                    <Input type="number" min={0} placeholder="Width" value={props.model.dimensions.width} onChange={(v) => props.model.dimensions.width = v.target.valueAsNumber} />
                    <Input type="number" min={0} placeholder="Depth" value={props.model.dimensions.depth} onChange={(v) => props.model.dimensions.depth = v.target.valueAsNumber} />
                    <Input type="number" min={0} placeholder="Height" value={props.model.dimensions.height} onChange={(v) => props.model.dimensions.height = v.target.valueAsNumber} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Location</FieldLabel>
                <FieldDescription>
                    The location (x, y, z) of the object in meters. This is used to determine the proximity of the player to the object.
                </FieldDescription>
                <FieldContent className="grid grid-cols-3 gap-4">
                    <Input type="number" placeholder="X" value={props.model.coordinates.x} onChange={(v) => props.model.coordinates.x = v.target.valueAsNumber} />
                    <Input type="number" placeholder="Y" value={props.model.coordinates.y} onChange={(v) => props.model.coordinates.y = v.target.valueAsNumber} />
                    <Input type="number" placeholder="Z" value={props.model.coordinates.z} onChange={(v) => props.model.coordinates.z = v.target.valueAsNumber} />
                </FieldContent>
            </Field>
        </div>
    </div>
  );
});
  