import { observer } from "mobx-react-lite";
import { FiPlus } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { WorldNode } from "../../models/WorldNode";
import { PropertySetting } from "./PropertySetting";
import { Separator } from "@/components/ui/separator";
import { Property } from "../../models/base/Property";

interface PropertySettingsProps {
    model: WorldNode;
}

export const PropertySettings = observer((props: PropertySettingsProps) => {
    function addProperty()
    {
        props.model.properties.push(new Property("New property", "", props.model.id));
    }

    return (
        <div className="space-y-4">
            <div className="text-muted-foreground text-sm leading-tight">
                Properties are modifiable variables of the object. E.g. health, mana, gold, etc.
            </div>
            
            <div className="flex flex-col border-1 rounded-md p-2">
                {props.model.properties.map((property, index) => (
                    <div key={index}>
                        <PropertySetting key={index} property={property} onDelete={() => props.model.properties.splice(index, 1)}/>
                        <Separator />
                    </div>
                ))}

                <Button variant="outline" className="mt-2" onClick={() => addProperty()}><FiPlus />Add property</Button>
            </div>
        </div>
    );
});
  